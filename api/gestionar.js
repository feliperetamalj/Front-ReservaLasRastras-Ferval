/**
 * POST /api/gestionar { token, accion: 'ver' | 'cancelar' | 'borrar' }
 *
 * El enlace del correo lleva el token en el fragmento de /agendar/gestionar
 * (#token=…), que el navegador no envía al servidor; la página lo manda aquí
 * en el cuerpo. Así no queda en ningún registro. Las acciones piden un clic: los antivirus del correo
 * abren los enlaces solos y no deben cancelar nada.
 */
import { correoCancelacion } from '../src/data/correos.js';
import { fechaLegible } from '../src/utils/agenda.js';
import { configurada, db, enviarCorreo, horaCorta, leerCuerpo, responder, sitio } from './_servidor.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTIVA = 'estado=in.(solicitada,confirmada)';

export default async function gestionar(req, res) {
  if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido.' });
  if (!configurada()) return responder(res, 503, { error: 'La agenda no está disponible.' });

  const { token, accion } = leerCuerpo(req) ?? {};
  if (typeof token !== 'string' || !UUID.test(token) || !['ver', 'cancelar', 'borrar'].includes(accion)) {
    return responder(res, 400, { error: 'Enlace no válido.' });
  }
  const filtro = `token_gestion=eq.${token}`;
  const campos = 'select=fecha,hora,estado';

  const r =
    accion === 'ver'
      ? await db(`visitas?${filtro}&${campos}`)
      : accion === 'cancelar'
        ? await db(`visitas?${filtro}&${ACTIVA}&${campos}`, {
            method: 'PATCH',
            prefer: 'return=representation',
            body: { estado: 'cancelada' },
          })
        : await db(`visitas?${filtro}&${campos}`, { method: 'DELETE', prefer: 'return=representation' });

  if (!r.ok) {
    console.error('gestionar: Supabase respondió', r.estado);
    return responder(res, 502, { error: 'No pudimos completar la acción.' });
  }

  let visita = r.datos[0];
  // Cancelar una visita ya cancelada no es un error: el resultado es el que se pidió.
  const yaCancelada = !visita && accion === 'cancelar';
  if (yaCancelada) visita = (await db(`visitas?${filtro}&${campos}`)).datos?.[0];
  if (!visita) {
    return responder(res, 404, { error: 'No encontramos esa visita. Puede que sus datos ya se hayan borrado.' });
  }

  // La sala se entera de que el bloque quedó libre (si no lo sabía ya). Si el
  // aviso falla, la acción igual vale.
  const avisar = (accion === 'cancelar' && !yaCancelada) || (accion === 'borrar' && visita.estado !== 'cancelada');
  if (avisar) {
    await enviarCorreo({
      para: process.env.AGENDA_CORREO_SALA,
      ...correoCancelacion({
        sitio: sitio(),
        fecha: fechaLegible(visita.fecha),
        hora: horaCorta(visita.hora),
        borrado: accion === 'borrar',
      }),
    });
  }

  return responder(res, 200, {
    visita: { ...visita, hora: horaCorta(visita.hora), estado: accion === 'borrar' ? 'borrada' : visita.estado },
  });
}
