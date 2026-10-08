/**
 * POST /api/agendar
 * { fecha, hora, nombre, telefono, email?, interes?, comentario?, consentimiento, marketing?, website }
 *
 * 201 agendada · 409 la hora se ocupó · 422 datos inválidos · 429 demasiados
 * intentos · 502/503 la agenda no responde (la página ofrece WhatsApp).
 */
import { POLITICA } from '../src/data/privacidad.js';
import { EVENTO, TEXTOS, correoSala, correoVisitante, mensajeConfirmacion } from '../src/data/agenda.js';
import { crearIcs, fechaCorta, fechaLegible, limpiar, validarSolicitud } from '../src/utils/agenda.js';
import { configurada, db, enviarCorreo, escapar, huella, leerCuerpo, responder, sitio } from './_servidor.js';

const LIMITE = { intentos: 5, minutos: 10 };

export default async function agendar(req, res) {
  if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido.' });
  if (!configurada()) return responder(res, 503, { error: 'La agenda no está disponible.' });

  const datos = leerCuerpo(req);
  if (!datos) return responder(res, 400, { error: 'Solicitud mal formada.' });

  // Trampa para bots: el campo es invisible para las personas. Se responde
  // como si hubiera funcionado para no enseñarle al bot qué lo delató.
  if (datos.website) return responder(res, 201, { ok: true });

  const errores = validarSolicitud(datos);
  if (Object.keys(errores).length) return responder(res, 422, { errores });

  const ip_hash = huella(req);
  const desde = new Date(Date.now() - LIMITE.minutos * 60000).toISOString();
  const recientes = await db(`visitas?select=id&ip_hash=eq.${ip_hash}&creada_en=gte.${desde}`, {
    method: 'HEAD',
    prefer: 'count=exact',
  });
  if (recientes.total >= LIMITE.intentos) {
    return responder(res, 429, { error: 'Recibimos varias solicitudes seguidas. Intenta en unos minutos.' });
  }

  const visita = limpiar(datos);
  const r = await db('visitas?select=id,token_gestion', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      ...visita,
      consentimiento: true,
      // El texto que vio la persona y la versión de la política: la prueba del consentimiento.
      consentimiento_texto: TEXTOS.consentimiento,
      politica_version: POLITICA.version,
      ip_hash,
    },
  });
  // El índice único por bloque resuelve la carrera entre dos personas.
  if (r.estado === 409) return responder(res, 409, { error: 'Esa hora se acaba de ocupar. Elige otra.' });
  if (!r.ok) {
    console.error('agendar: Supabase respondió', r.estado);
    return responder(res, 502, { error: 'No pudimos registrar tu solicitud.' });
  }
  const { id, token_gestion } = r.datos[0];

  const fecha = fechaLegible(visita.fecha);
  const telefonoWa = visita.telefono.replace(/\D/g, '');
  const sala = correoSala({
    nombre: escapar(visita.nombre),
    telefono: escapar(visita.telefono),
    email: escapar(visita.email ?? ''),
    fecha,
    fechaCorta: fechaCorta(visita.fecha),
    hora: visita.hora,
    interes: escapar(visita.interes ?? ''),
    comentario: escapar(visita.comentario ?? ''),
    marketing: visita.marketing,
    enlaceWhatsApp: `https://wa.me/${telefonoWa}?text=${encodeURIComponent(
      mensajeConfirmacion({ nombre: visita.nombre, fecha, hora: visita.hora }),
    )}`,
  });

  // Sin el aviso a la sala la visita no existe para nadie: se deshace y la
  // página ofrece seguir por WhatsApp, así no se pierde el contacto.
  if (!(await enviarCorreo({ para: process.env.AGENDA_CORREO_SALA, ...sala }))) {
    await db(`visitas?id=eq.${id}`, { method: 'DELETE' });
    return responder(res, 502, { error: 'No pudimos registrar tu solicitud.' });
  }

  if (visita.email) {
    const ics = crearIcs({
      uid: `${id}@reservalasrastras.cl`,
      fecha: visita.fecha,
      hora: visita.hora,
      ...EVENTO,
    });
    const correo = correoVisitante({
      nombre: escapar(visita.nombre),
      fecha,
      hora: visita.hora,
      // El token va en el fragmento (#): el navegador no lo manda al servidor y no queda en registros.
      enlaceGestion: `${sitio()}/agendar/gestionar#token=${token_gestion}`,
    });
    // Si falla, la visita igual quedó: la confirmación llega por WhatsApp.
    await enviarCorreo({
      para: visita.email,
      ...correo,
      adjuntos: [{ filename: 'visita-reserva-las-rastras.ics', content: Buffer.from(ics).toString('base64') }],
    });
  }

  return responder(res, 201, { ok: true });
}
