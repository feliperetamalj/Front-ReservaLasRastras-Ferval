/**
 * Reglas de la agenda, compartidas por la página /agendar y por las funciones
 * de `api/`: el servidor vuelve a validar con exactamente las mismas.
 *
 * Todo se calcula en la hora de Santiago, sin importar la zona del navegador
 * ni la del servidor (las funciones de Vercel corren en UTC). Las fechas se
 * manejan como texto "AAAA-MM-DD" y las horas como "HH:MM".
 */
import { ATENCION } from '../data/contacto.js';
import { FERIADOS } from '../data/feriados.js';
import { AGENDA } from '../data/agenda.js';

const partes = new Intl.DateTimeFormat('en-CA', {
  timeZone: AGENDA.zona,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const leer = (instante) =>
  Object.fromEntries(partes.formatToParts(instante).map((p) => [p.type, p.value]));

/** El día y el minuto del día que marca el reloj de Santiago en ese instante. */
export function relojSantiago(instante = new Date()) {
  const p = leer(instante);
  return { fecha: `${p.year}-${p.month}-${p.day}`, minutos: Number(p.hour) * 60 + Number(p.minute) };
}

const mediodia = (iso) => new Date(`${iso}T12:00:00Z`);

export const sumarDias = (iso, n) => {
  const d = mediodia(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** 0 = domingo … 6 = sábado. */
export const diaSemana = (iso) => mediodia(iso).getUTCDay();

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const aHora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Inicio de cada visita que cabe entera dentro de un tramo de atención. */
export const BLOQUES = ATENCION.tramos.flatMap(([desde, hasta]) => {
  const inicios = [];
  for (let m = aMinutos(desde); m + AGENDA.duracionMinutos <= aMinutos(hasta); m += AGENDA.duracionMinutos) {
    inicios.push(aHora(m));
  }
  return inicios;
});

/** Por qué no se atiende ese día, o null si se atiende. */
export function motivoCierre(iso) {
  if (FERIADOS[iso]) return 'Feriado';
  const dia = diaSemana(iso);
  if (!ATENCION.dias.includes(dia)) return dia === 0 ? 'Domingo cerrado' : 'Cerrado';
  return null;
}

/**
 * Los días que ofrece la agenda, desde hoy, con sus bloques.
 *
 * `ocupados` es un Set de "AAAA-MM-DD HH:MM". Un bloque está libre si nadie
 * lo pidió y si falta al menos la anticipación mínima para que empiece.
 *
 * ponytail: la anticipación cuenta cada día como 24 h. La noche del cambio de
 * hora dura 23 o 25: solo importaría si la anticipación cruzara esa
 * medianoche, y con 2 h y la sala abriendo a las 10:00 no la cruza.
 */
export function calendario(ahora = new Date(), ocupados = new Set()) {
  const { fecha: hoy, minutos } = relojSantiago(ahora);
  const limite = minutos + AGENDA.anticipacionMinutos;

  return Array.from({ length: AGENDA.diasVentana }, (_, i) => {
    const fecha = sumarDias(hoy, i);
    const cierre = motivoCierre(fecha);
    const bloques = cierre
      ? []
      : BLOQUES.map((hora) => ({
          hora,
          libre: i * 1440 + aMinutos(hora) >= limite && !ocupados.has(`${fecha} ${hora}`),
        }));
    const libres = bloques.filter((b) => b.libre).length;
    return { fecha, motivo: cierre ?? (libres ? null : 'Sin horas disponibles'), bloques };
  });
}

/** Si ese bloque se puede pedir ahora (sin mirar si alguien ya lo tomó). */
export const bloqueValido = (fecha, hora, ahora = new Date()) =>
  calendario(ahora).some((d) => d.fecha === fecha && d.bloques.some((b) => b.hora === hora && b.libre));

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

/** Las reglas de cada campo. Devuelve { campo: mensaje } con lo que falla. */
export function validarDatos(datos) {
  const nombre = texto(datos.nombre);
  const telefono = texto(datos.telefono);
  const email = texto(datos.email);
  const errores = {};

  if (nombre.length < 2) errores.nombre = 'Escribe tu nombre para saber a quién recibir.';
  else if (nombre.length > 80) errores.nombre = 'El nombre puede tener hasta 80 caracteres.';

  if (!telefono) errores.telefono = 'Déjanos un teléfono para confirmarte la visita.';
  else if (telefono.replace(/\D/g, '').length < 8 || telefono.length > 20)
    errores.telefono = 'El teléfono parece incompleto.';

  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)))
    errores.email = 'Revisa el correo: le falta el @ o el dominio.';

  if (texto(datos.interes).length > 60) errores.interes = 'Elige una opción de la lista.';
  if (texto(datos.comentario).length > 500)
    errores.comentario = 'El comentario puede tener hasta 500 caracteres.';

  return errores;
}

/** Validación completa de una solicitud, la que aplica el servidor. */
export function validarSolicitud(datos, ahora = new Date()) {
  const errores = validarDatos(datos);
  if (datos.consentimiento !== true)
    errores.consentimiento = 'Para agendar necesitamos tu autorización para usar estos datos.';
  if (!bloqueValido(datos.fecha, datos.hora, ahora)) errores.hora = 'Elige un día y una hora disponibles.';
  return errores;
}

/** Los campos tal como se guardan: recortados, y los opcionales vacíos como null. */
export const limpiar = (datos) => ({
  fecha: datos.fecha,
  hora: datos.hora,
  nombre: texto(datos.nombre),
  telefono: texto(datos.telefono),
  email: texto(datos.email) || null,
  interes: texto(datos.interes) || null,
  comentario: texto(datos.comentario) || null,
  marketing: datos.marketing === true,
});

const largo = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const corto = new Intl.DateTimeFormat('es-CL', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

/** "2026-10-17" -> "sábado 17 de octubre" */
export const fechaLegible = (iso) => largo.format(mediodia(iso)).replace(',', '');
/** "2026-10-17" -> "sáb 17 oct" */
export const fechaCorta = (iso) => corto.format(mediodia(iso)).replace(/[.,]/g, '');

/** El instante real en que empieza esa hora de Santiago, con su horario de verano o de invierno. */
export function instanteSantiago(fecha, hora) {
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, mi] = hora.split(':').map(Number);
  const pared = Date.UTC(a, m - 1, d, h, mi);
  const desfase = (t) => {
    const p = leer(new Date(t));
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - t;
  };
  // Dos pasadas: la primera estima el desfase con la hora mal ubicada; la segunda lo corrige.
  const t = pared - desfase(pared);
  return new Date(pared - desfase(t));
}

const enUtc = (fecha) => fecha.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escaparIcs = (s) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** Corta las líneas a 75 bytes, como pide el formato (RFC 5545). */
function plegar(linea) {
  const codificar = new TextEncoder();
  const trozos = [];
  let actual = '';
  for (const c of linea) {
    if (codificar.encode(actual + c).length > (trozos.length ? 74 : 75)) {
      trozos.push(actual);
      actual = '';
    }
    actual += c;
  }
  trozos.push(actual);
  return trozos.join('\r\n ');
}

/**
 * Archivo de calendario de la visita. Las horas van en UTC: así cualquier
 * calendario la ubica bien sin depender de que conozca la zona de Santiago.
 */
export function crearIcs({ uid, fecha, hora, resumen, lugar, descripcion, ahora = new Date() }) {
  const inicio = instanteSantiago(fecha, hora);
  const fin = new Date(inicio.getTime() + AGENDA.duracionMinutos * 60000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Reserva Las Rastras//Agenda de visitas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${enUtc(ahora)}`,
    `DTSTART:${enUtc(inicio)}`,
    `DTEND:${enUtc(fin)}`,
    `SUMMARY:${escaparIcs(resumen)}`,
    `LOCATION:${escaparIcs(lugar)}`,
    `DESCRIPTION:${escaparIcs(descripcion)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(plegar)
    .join('\r\n')
    .concat('\r\n');
}
