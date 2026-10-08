/*
  Reglas de la agenda. Corre con `npm test` (node --test, sin dependencias).

  Las horas de los casos se escriben en UTC a propósito: así el test no
  depende de la zona del equipo donde corre. Chile continental está en UTC−3
  en verano (desde el primer sábado de septiembre a medianoche) y en UTC−4 en
  invierno (desde el primer sábado de abril a medianoche).
*/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BLOQUES,
  calendario,
  crearIcs,
  fechaCorta,
  fechaLegible,
  instanteSantiago,
  limpiar,
  motivoCierre,
  relojSantiago,
  validarSolicitud,
} from '../src/utils/agenda.js';

// Jueves 8 de octubre de 2026, 12:00 en Santiago (UTC−3).
const JUEVES_MEDIODIA = new Date('2026-10-08T15:00:00Z');

const valida = {
  fecha: '2026-10-09',
  hora: '10:00',
  nombre: 'Ana Pérez',
  telefono: '+56 9 1234 5678',
  email: '',
  interes: '',
  comentario: '',
  consentimiento: true,
};

test('los bloques salen del horario: una visita de una hora que cabe entera en cada tramo', () => {
  assert.deepEqual(BLOQUES, ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']);
});

test('domingos y feriados no se atienden; los sábados sí', () => {
  assert.equal(motivoCierre('2026-10-11'), 'Domingo cerrado');
  assert.equal(motivoCierre('2026-10-12'), 'Feriado');
  assert.equal(motivoCierre('2026-10-17'), null);
});

test('el calendario va de hoy al fin del cuarto mes siguiente y respeta la anticipación de 2 horas', () => {
  const dias = calendario(JUEVES_MEDIODIA);
  assert.equal(dias[0].fecha, '2026-10-08');
  assert.equal(dias.at(-1).fecha, '2027-02-28');
  assert.equal(dias.length, 144);
  const hoy = Object.fromEntries(dias[0].bloques.map((b) => [b.hora, b.libre]));
  assert.deepEqual(hoy, {
    '10:00': false,
    '11:00': false,
    '12:00': false,
    '14:00': true,
    '15:00': true,
    '16:00': true,
    '17:00': true,
  });
});

test('un bloque pedido queda ocupado y un día sin bloques libres dice por qué', () => {
  const ocupados = new Set(BLOQUES.map((h) => `2026-10-09 ${h}`));
  ocupados.delete('2026-10-09 15:00');
  const viernes = calendario(JUEVES_MEDIODIA, ocupados)[1];
  assert.deepEqual(viernes.bloques.filter((b) => b.libre).map((b) => b.hora), ['15:00']);

  ocupados.add('2026-10-09 15:00');
  assert.equal(calendario(JUEVES_MEDIODIA, ocupados)[1].motivo, 'Sin horas disponibles');
  assert.equal(calendario(JUEVES_MEDIODIA)[3].motivo, 'Domingo cerrado');
});

test('la solicitud válida pasa', () => {
  assert.deepEqual(validarSolicitud(valida, JUEVES_MEDIODIA), {});
});

test('se rechazan domingos, feriados, horas fuera de horario, pasadas y fuera de la ventana', () => {
  const con = (cambios) => validarSolicitud({ ...valida, ...cambios }, JUEVES_MEDIODIA);
  assert.ok(con({ fecha: '2026-10-11' }).hora, 'domingo');
  assert.ok(con({ fecha: '2026-10-12' }).hora, 'feriado');
  assert.ok(con({ hora: '13:00' }).hora, 'hora de almuerzo');
  assert.ok(con({ hora: '18:00' }).hora, 'después del cierre');
  assert.ok(con({ hora: '10:30' }).hora, 'fuera de bloque');
  assert.ok(con({ fecha: '2026-10-08', hora: '13:00' }).hora, 'hoy, con menos de 2 h');
  assert.ok(con({ fecha: '2026-10-07' }).hora, 'ayer');
  assert.ok(con({ fecha: '2027-03-01' }).hora, 'después del cuarto mes');
  assert.deepEqual(con({ fecha: '2027-02-26' }), {}, 'el último viernes de la ventana sí se puede');
  assert.ok(con({ fecha: '2026-12-25' }).hora, 'Navidad');
  assert.ok(con({ fecha: 'mañana' }).hora, 'fecha mal escrita');
});

test('sin consentimiento no se agenda, y tiene que ser true, no un texto', () => {
  assert.ok(validarSolicitud({ ...valida, consentimiento: false }, JUEVES_MEDIODIA).consentimiento);
  assert.ok(validarSolicitud({ ...valida, consentimiento: 'true' }, JUEVES_MEDIODIA).consentimiento);
});

test('los campos se validan y se recortan', () => {
  const con = (cambios) => validarSolicitud({ ...valida, ...cambios }, JUEVES_MEDIODIA);
  assert.ok(con({ nombre: ' A ' }).nombre);
  assert.ok(con({ nombre: 'x'.repeat(81) }).nombre);
  assert.ok(con({ telefono: '1234' }).telefono);
  assert.ok(con({ telefono: '' }).telefono);
  assert.ok(con({ email: 'ana@' }).email);
  assert.ok(con({ comentario: 'x'.repeat(501) }).comentario);
  assert.ok(con({ nombre: { $ne: 1 } }).nombre, 'un objeto no pasa por texto');
  assert.deepEqual(limpiar({ ...valida, nombre: '  Ana  ', email: ' ', marketing: 'si' }), {
    fecha: '2026-10-09',
    hora: '10:00',
    nombre: 'Ana',
    telefono: '+56 9 1234 5678',
    email: null,
    interes: null,
    comentario: null,
    marketing: false,
  });
});

test('cambio de hora de septiembre: la misma hora de pared es otro instante', () => {
  // 2026: el sábado 5 de septiembre a medianoche los relojes pasan a la 1:00.
  assert.equal(instanteSantiago('2026-09-05', '10:00').toISOString(), '2026-09-05T14:00:00.000Z');
  assert.equal(instanteSantiago('2026-09-07', '10:00').toISOString(), '2026-09-07T13:00:00.000Z');
});

test('cambio de hora de abril: la noche que se repite una hora el día no cambia antes de tiempo', () => {
  // 2027: el sábado 3 de abril a medianoche los relojes vuelven a las 23:00.
  assert.equal(instanteSantiago('2027-04-03', '10:00').toISOString(), '2027-04-03T13:00:00.000Z');
  assert.equal(instanteSantiago('2027-04-05', '10:00').toISOString(), '2027-04-05T14:00:00.000Z');
  assert.deepEqual(relojSantiago(new Date('2027-04-04T03:30:00Z')), { fecha: '2027-04-03', minutos: 23 * 60 + 30 });
  // Viernes 2 de abril a las 22:30 en Santiago: el sábado 3 se puede pedir a las 10:00.
  const dias = calendario(new Date('2027-04-03T01:30:00Z'));
  assert.equal(dias[0].fecha, '2027-04-02');
  assert.equal(dias[1].bloques[0].libre, true);
  // El lunes 5, ya en invierno, ofrece los mismos bloques de pared.
  assert.deepEqual(dias[3].bloques.map((b) => b.hora), BLOQUES);
});

test('fechas legibles en español', () => {
  assert.equal(fechaLegible('2026-10-17'), 'sábado 17 de octubre');
  assert.equal(fechaCorta('2026-10-17'), 'sáb 17 oct');
});

test('el archivo de calendario usa UTC, CRLF y líneas de hasta 75 bytes', () => {
  const ics = crearIcs({
    uid: 'prueba@reservalasrastras.cl',
    fecha: '2026-10-17',
    hora: '10:00',
    resumen: 'Visita a Reserva Las Rastras',
    lugar: 'Alto Las Rastras · Camino Las Rastras, cruce Ruta 115-CH, Talca',
    descripcion: 'Sala de ventas. Un ejecutivo te confirmará por WhatsApp; si no puedes venir, avísanos.',
    ahora: JUEVES_MEDIODIA,
  });
  assert.match(ics, /\r\nDTSTART:20261017T130000Z\r\n/);
  assert.match(ics, /\r\nDTEND:20261017T140000Z\r\n/);
  assert.match(ics, /LOCATION:Alto Las Rastras · Camino Las Rastras\\, cruce/);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  for (const linea of ics.split('\r\n')) {
    assert.ok(new TextEncoder().encode(linea).length <= 75, linea);
  }
});
