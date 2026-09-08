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
