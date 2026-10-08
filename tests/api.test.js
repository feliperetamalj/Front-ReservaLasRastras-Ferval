/*
  Funciones de la agenda contra un Supabase y un Gmail simulados: se
  reemplazan `fetch` y `cartero.enviar`, y se revisa qué se pidió. No sale
  nada a la red.
*/
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import agendar from '../api/agendar.js';
import disponibilidad from '../api/disponibilidad.js';
import gestionar from '../api/gestionar.js';
import { cartero } from '../api/_servidor.js';
import { calendario } from '../src/utils/agenda.js';
import { POLITICA } from '../src/data/privacidad.js';

const ENTORNO = {
  SUPABASE_URL: 'https://prueba.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'secreto-de-prueba',
  SMTP_USUARIO: 'agenda@ejemplo.cl',
  SMTP_CLAVE: 'clave-de-prueba',
  AGENDA_CORREO_SALA: 'sala@ejemplo.cl',
  HASH_SALT: 'sal',
};

let llamadas;
let respuestas;
let correos;
let gmailFalla;

cartero.enviar = async (mensaje) => {
  if (gmailFalla) throw Object.assign(new Error('rechazado'), { code: 'EAUTH' });
  correos.push(mensaje);
};

/** `respuestas` decide qué contesta cada servicio: (url, opciones) => { status, body, headers }. */
globalThis.fetch = async (url, opciones = {}) => {
  llamadas.push({ url: String(url), metodo: opciones.method ?? 'GET', cuerpo: opciones.body && JSON.parse(opciones.body) });
  const r = respuestas(String(url), opciones) ?? { status: 200, body: [] };
  return new Response(r.body === undefined ? null : JSON.stringify(r.body), {
    status: r.status,
    headers: r.headers,
  });
};

beforeEach(() => {
  Object.assign(process.env, ENTORNO);
  llamadas = [];
  correos = [];
  gmailFalla = false;
  respuestas = () => undefined;
});

const peticion = (method, body, headers = {}) => ({ method, body, headers: { 'x-real-ip': '1.2.3.4', ...headers } });
const respuesta = () => {
  const res = { cabeceras: {} };
  res.setHeader = (k, v) => (res.cabeceras[k] = v);
  res.end = (cuerpo) => (res.cuerpo = JSON.parse(cuerpo));
  return res;
};
const llamar = async (fn, req) => {
  const res = respuesta();
  await fn(req, res);
  return res;
};

const primerBloqueLibre = () => {
  const dia = calendario().find((d) => d.bloques.some((b) => b.libre));
  return { fecha: dia.fecha, hora: dia.bloques.find((b) => b.libre).hora };
};
const solicitud = (cambios = {}) => ({
  ...primerBloqueLibre(),
  nombre: 'Ana Pérez',
  telefono: '+56 9 1234 5678',
  email: 'ana@ejemplo.cl',
  comentario: '<b>hola</b>',
  consentimiento: true,
  marketing: false,
  website: '',
  ...cambios,
});

const supabaseInserta = (url, op) => {
  if (op.method === 'HEAD') return { status: 200, headers: { 'content-range': '*/0' } };
  if (op.method === 'POST') return { status: 201, body: [{ id: 'v1', token_gestion: '11111111-2222-4333-8444-555555555555' }] };
  return undefined;
};

test('sin variables de entorno la agenda se declara apagada y no consulta nada', async () => {
  delete process.env.SMTP_CLAVE;
  const d = await llamar(disponibilidad, peticion('GET'));
  assert.deepEqual(d.cuerpo, { configurada: false, ocupados: [] });
  const a = await llamar(agendar, peticion('POST', solicitud()));
  assert.equal(a.statusCode, 503);
  assert.equal(llamadas.length, 0);
});

test('disponibilidad devuelve solo fecha y hora de lo ocupado', async () => {
  respuestas = () => ({ status: 200, body: [{ fecha: '2026-10-09', hora: '10:00:00' }] });
  const res = await llamar(disponibilidad, peticion('GET'));
  assert.deepEqual(res.cuerpo, { configurada: true, ocupados: ['2026-10-09 10:00'] });
  assert.match(llamadas[0].url, /select=fecha,hora&/);
  assert.equal(res.cabeceras['Cache-Control'], 'no-store');
});

test('agenda, avisa a la sala y confirma al visitante con el .ics', async () => {
  respuestas = supabaseInserta;
  const res = await llamar(agendar, peticion('POST', solicitud()));
  assert.equal(res.statusCode, 201);

  const insercion = llamadas.find((l) => l.metodo === 'POST' && l.url.includes('/rest/v1/visitas'));
  assert.equal(insercion.cuerpo.consentimiento, true);
  assert.match(insercion.cuerpo.consentimiento_texto, /^Acepto que Inmobiliaria Ferval/);
  assert.equal(insercion.cuerpo.politica_version, POLITICA.version);
  assert.match(insercion.cuerpo.ip_hash, /^[0-9a-f]{64}$/);
  assert.ok(!JSON.stringify(insercion.cuerpo).includes('1.2.3.4'), 'la IP no se guarda en claro');
  assert.ok(!('website' in insercion.cuerpo));

  assert.equal(correos.length, 2);
  assert.equal(correos[0].to, 'sala@ejemplo.cl');
  assert.equal(correos[0].from.address, 'agenda@ejemplo.cl');
  assert.ok(correos[0].html.includes('&lt;b&gt;hola&lt;/b&gt;'), 'el comentario va escapado');
  assert.match(correos[0].html, /wa\.me\/56912345678\?text=/);
  assert.equal(correos[1].to, 'ana@ejemplo.cl');
  assert.equal(correos[1].attachments[0].filename, 'visita-reserva-las-rastras.ics');
  assert.match(correos[1].attachments[0].content, /^BEGIN:VCALENDAR/);
  assert.match(correos[1].html, /\/agendar\/gestionar#token=11111111-/);
  assert.match(correos[1].html, /\/email\/logo\.png/, 'el logo va con URL absoluta del sitio');
  assert.match(correos[1].text, /Un ejecutivo te confirmará por WhatsApp/, 'trae versión en texto plano');
});

test('sin correo del visitante solo se avisa a la sala', async () => {
  respuestas = supabaseInserta;
  await llamar(agendar, peticion('POST', solicitud({ email: '' })));
  assert.equal(correos.length, 1);
});

test('la trampa para bots responde bien y no guarda nada', async () => {
  const res = await llamar(agendar, peticion('POST', solicitud({ website: 'https://spam.example' })));
  assert.equal(res.statusCode, 201);
  assert.equal(llamadas.length, 0);
});

test('sin consentimiento o con datos malos responde 422 sin tocar la base', async () => {
  const res = await llamar(agendar, peticion('POST', solicitud({ consentimiento: false, telefono: '12' })));
  assert.equal(res.statusCode, 422);
  assert.ok(res.cuerpo.errores.consentimiento && res.cuerpo.errores.telefono);
  assert.equal(llamadas.length, 0);
});

test('si otra persona tomó el bloque, 409', async () => {
  respuestas = (url, op) => (op.method === 'POST' ? { status: 409, body: { code: '23505' } } : supabaseInserta(url, op));
  const res = await llamar(agendar, peticion('POST', solicitud()));
  assert.equal(res.statusCode, 409);
});

test('cinco solicitudes en diez minutos desde la misma IP frenan la sexta', async () => {
  respuestas = (url, op) => (op.method === 'HEAD' ? { status: 200, headers: { 'content-range': '0-4/5' } } : undefined);
  const res = await llamar(agendar, peticion('POST', solicitud()));
  assert.equal(res.statusCode, 429);
  assert.ok(!llamadas.some((l) => l.metodo === 'POST'));
});

test('si el aviso a la sala falla, la visita se deshace y la página ofrece WhatsApp', async () => {
  respuestas = supabaseInserta;
  gmailFalla = true;
  const res = await llamar(agendar, peticion('POST', solicitud()));
  assert.equal(res.statusCode, 502);
  assert.ok(llamadas.some((l) => l.metodo === 'DELETE' && l.url.includes('id=eq.v1')));
});

test('gestionar: token inválido 400; cancelar avisa a la sala; borrar elimina', async () => {
  const token = '11111111-2222-4333-8444-555555555555';
  const malo = await llamar(gestionar, peticion('POST', { token: 'x', accion: 'borrar' }));
  assert.equal(malo.statusCode, 400);

  respuestas = (url, op) => ({
    status: 200,
    body: [{ fecha: '2026-10-09', hora: '10:00:00', estado: op.method === 'PATCH' ? 'cancelada' : 'solicitada' }],
  });

  const cancelada = await llamar(gestionar, peticion('POST', { token, accion: 'cancelar' }));
  assert.deepEqual(cancelada.cuerpo.visita, { fecha: '2026-10-09', hora: '10:00', estado: 'cancelada' });
  assert.equal(correos.length, 1);
  assert.match(correos[0].subject, /^Visita cancelada/);

  llamadas = [];
  const borrada = await llamar(gestionar, peticion('POST', { token, accion: 'borrar' }));
  assert.equal(borrada.cuerpo.visita.estado, 'borrada');
  assert.ok(llamadas.some((l) => l.metodo === 'DELETE' && l.url.includes(`token_gestion=eq.${token}`)));
});
