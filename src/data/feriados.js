/**
 * Feriados legales nacionales de Chile en que la sala de ventas no agenda
 * visitas. Los domingos ya están cerrados por horario: aquí van igual, para
 * que la lista sea completa y fácil de cotejar.
 *
 * 2026 (desde octubre): cotejado con feriados.cl el 2026-10-08.
 * 2027: calculado con las leyes de traslado (19.668: San Pedro y San Pablo y
 * Encuentro de Dos Mundos pasan al lunes; 20.299: Iglesias Evangélicas;
 * 21.357: Pueblos Indígenas en el solsticio) y contrastado con calendarios
 * publicados. Revisar a fin de año si una ley especial agrega días (por
 * ejemplo, un 17 de septiembre) o si hay elecciones.
 *
 * Agregar cada año los del siguiente: la agenda mira hasta cuatro meses
 * hacia adelante (desde septiembre ya ofrece enero).
 */
export const FERIADOS = {
  '2026-10-12': 'Encuentro de Dos Mundos',
  '2026-10-31': 'Día de las Iglesias Evangélicas y Protestantes',
  '2026-11-01': 'Día de Todos los Santos',
  '2026-12-08': 'Inmaculada Concepción',
  '2026-12-25': 'Navidad',

  '2027-01-01': 'Año Nuevo',
  '2027-03-26': 'Viernes Santo',
  '2027-03-27': 'Sábado Santo',
  '2027-05-01': 'Día del Trabajo',
  '2027-05-21': 'Día de las Glorias Navales',
  '2027-06-21': 'Día Nacional de los Pueblos Indígenas',
  '2027-06-28': 'San Pedro y San Pablo',
  '2027-07-16': 'Virgen del Carmen',
  '2027-08-15': 'Asunción de la Virgen',
  '2027-09-18': 'Independencia Nacional',
  '2027-09-19': 'Día de las Glorias del Ejército',
  '2027-10-11': 'Encuentro de Dos Mundos',
  '2027-10-31': 'Día de las Iglesias Evangélicas y Protestantes',
  '2027-11-01': 'Día de Todos los Santos',
  '2027-12-08': 'Inmaculada Concepción',
  '2027-12-25': 'Navidad',
};
