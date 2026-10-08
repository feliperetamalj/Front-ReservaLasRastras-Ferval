/**
 * GET /api/disponibilidad → { configurada, ocupados: ["AAAA-MM-DD HH:MM", …] }
 *
 * Solo dice qué bloques de la ventana ya están pedidos: ningún dato personal.
 * La ventana la calcula el servidor; no se aceptan fechas del cliente.
 */
import { calendario } from '../src/utils/agenda.js';
import { configurada, db, horaCorta, responder } from './_servidor.js';

export default async function disponibilidad(req, res) {
  if (req.method !== 'GET') return responder(res, 405, { error: 'Método no permitido.' });
  if (!configurada()) return responder(res, 200, { configurada: false, ocupados: [] });

  const dias = calendario();
  const r = await db(
    `visitas?select=fecha,hora&fecha=gte.${dias[0].fecha}&fecha=lte.${dias.at(-1).fecha}` +
      '&estado=in.(solicitada,confirmada)',
  );
  if (!r.ok) {
    console.error('disponibilidad: Supabase respondió', r.estado);
    return responder(res, 502, { error: 'No pudimos leer la agenda.' });
  }
  return responder(res, 200, {
    configurada: true,
    ocupados: r.datos.map((v) => `${v.fecha} ${horaCorta(v.hora)}`),
  });
}
