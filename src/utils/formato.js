/** Formato de cifras en convención chilena: punto para miles, coma decimal. */

const nf = (opciones) => new Intl.NumberFormat('es-CL', opciones);

/** 10500 -> "UF 10.500" */
export const uf = (valor) =>
  valor == null ? 'Precio a consultar' : `UF ${nf({ maximumFractionDigits: 0 }).format(valor)}`;

/** 179.22 -> "179,22 m²" · 150 -> "150 m²" */
export const m2 = (valor) =>
  `${nf({ maximumFractionDigits: Number.isInteger(valor) ? 0 : 2 }).format(valor)} m²`;

/** 1076.98 -> "1.077" (para tarjetas donde los decimales estorban) */
export const m2Corto = (valor) => nf({ maximumFractionDigits: 0 }).format(valor);

/** 3 -> "3 dormitorios" · 1 -> "1 dormitorio" */
export const plural = (n, singular, pluralPalabra) =>
  `${n} ${n === 1 ? singular : pluralPalabra}`;

const PALABRAS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];

/** 7 -> "siete". Para cifras que van en una frase y no deben escribirse a mano. */
export const enPalabras = (n) => PALABRAS[n] ?? String(n);

/** "2026-09-24" -> "24 de septiembre de 2026" */
export const fechaLarga = (iso) =>
  new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );

/**
 * "Casa Mediterránea 308 m²" -> "Mediterránea 308 m²", para mostrar junto al
 * rótulo "Se vende con casa" (o "por construir"). El espacio antes de m² no se parte.
 */
export const casaCorta = (texto) => texto.replace(/^Casa /, '').replace(' m²', ' m²');
