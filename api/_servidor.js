/**
 * Piezas comunes de las funciones de la agenda. El guion bajo del nombre le
 * dice a Vercel que este archivo no es un endpoint.
 *
 * Sin dependencias: Supabase se consulta por su API REST (PostgREST) y los
 * correos salen por la API de Resend, las dos con `fetch`.
 *
 * Reglas que no se rompen:
 * - Las claves solo existen aquí, en variables de entorno de Vercel.
 * - Ningún dato personal va a `console`: los registros de Vercel los guardan.
 */
import { createHash } from 'node:crypto';

const VARIABLES = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'AGENDA_CORREO_SALA',
  'AGENDA_REMITENTE',
  'HASH_SALT',
];

/** La agenda funciona solo con todo configurado; si falta algo, el sitio ofrece WhatsApp. */
export const configurada = () => VARIABLES.every((v) => process.env[v]);

export function responder(res, estado, cuerpo) {
  res.statusCode = estado;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(cuerpo));
}

/** El cuerpo JSON de la petición, o null si no lo es. */
export function leerCuerpo(req) {
  try {
    const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    return cuerpo && typeof cuerpo === 'object' && !Array.isArray(cuerpo) ? cuerpo : null;
  } catch {
    return null;
  }
}

/**
 * Consulta a la tabla con la clave de servicio, que salta RLS. Las claves
 * nuevas (sb_secret_…) van solo en `apikey`; las antiguas, que son un JWT,
 * también como Bearer.
 */
export async function db(ruta, { method = 'GET', body, prefer } = {}) {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = { apikey: clave, 'Content-Type': 'application/json' };
  if (clave.startsWith('eyJ')) headers.Authorization = `Bearer ${clave}`;
  if (prefer) headers.Prefer = prefer;

  const opciones = { method, headers };
  if (body !== undefined) opciones.body = JSON.stringify(body);
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${ruta}`, opciones);
  const datos = await r.json().catch(() => null);
  const rango = r.headers.get('content-range');
  return { ok: r.ok, estado: r.status, datos, total: rango ? Number(rango.split('/')[1]) : null };
}

/** Envía un correo. Devuelve true si Resend lo aceptó. */
export async function enviarCorreo({ para, asunto, html, adjuntos }) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.AGENDA_REMITENTE,
      to: [para],
      subject: asunto,
      html,
      attachments: adjuntos,
    }),
  });
  if (!r.ok) console.error('Resend rechazó un correo:', r.status);
  return r.ok;
}

/**
 * Huella de la IP: sirve para limitar envíos y como parte de la prueba del
 * consentimiento sin guardar la dirección. Vercel fija `x-real-ip` y no deja
 * que el cliente la falsifique.
 */
export function huella(req) {
  const ip = req.headers['x-real-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return createHash('sha256').update(`${ip}${process.env.HASH_SALT}`).digest('hex');
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Lo que escribió la persona, listo para ir dentro del HTML de un correo. */
export const escapar = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Dirección pública del sitio, para los enlaces de los correos. No sale del encabezado Host, que el cliente controla. */
export const sitio = () =>
  `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'reservalasrastras.cl'}`;

/** "10:00:00" (como lo devuelve Postgres) -> "10:00" */
export const horaCorta = (hora) => String(hora).slice(0, 5);
