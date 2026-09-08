/**
 * Los seis modelos de vivienda del proyecto.
 *
 * Todo el contenido sale de las fichas de reservalasrastras.cl leídas el
 * 2026-09-08. Donde el sitio original se contradice a sí mismo, el campo queda
 * en `null` y se explica en `notaDato` — es preferible decir "consultar" a
 * publicar una cifra que el propio cliente desmiente en otra pantalla.
 */

// Vite resuelve estas rutas en tiempo de compilación, con hash y sin parpadeo.
// El patrón tiene que ser literal: una variable aquí no funciona.
const IMAGENES = import.meta.glob('../assets/modelos/**/*.webp', {
  eager: true,
  import: 'default',
});

import { medida } from './medidas';

const img = (slug, nombre) => IMAGENES[`../assets/modelos/${slug}/${nombre}.webp`];

/** Devuelve las variantes de un mismo archivo para armar el srcset. */
export const variantes = (slug, nombre, anchos) =>
  anchos
    .map((a) => {
      const ruta = IMAGENES[`../assets/modelos/${slug}/${nombre}-${a}.webp`];
      return ruta ? `${ruta} ${a}w` : null;
    })
    .filter(Boolean)
    .join(', ');

/** Terminaciones comunes a toda la promoción. */
const TERMINACIONES_BASE = [
  'Altura de piso a cielo 2,60 m',
  'Pisos de gres porcelánico',
  'Ventanas de PVC folio madera con vidrio termopanel',
  'Puertas interiores enchapadas',
  'Concepto abierto en áreas comunes',
  'Muebles de cocina con cubierta de cuarzo',
  'Cocina equipada con isla central',
  'Amplios ventanales integrados al living-comedor',
  'Terraza en gres esmaltado rectificado',
  'Calefacción central con radiadores',
  'Dormitorio principal en suite con walk-in closet',
];

export const MODELOS = [
  {
    slug: 'colonial-150',
    nombre: 'Colonial 150',
    m2: 150,
    uf: 10500,
    dormitorios: 3,
    banos: 4,
    pisos: 1,
    estilo: 'Colonial',
    material: 'Albañilería reforzada',
    resumen:
      'Un solo piso de estilo chileno, con tejas y hasta 2,60 m de altura interior.',
    descripcion:
      'Nuestro modelo 150 de estilo chileno cuenta con 3 dormitorios y 4 baños, ' +
      'amplios jardines y una arquitectura que fusiona lo tradicional y lo moderno ' +
      'en un solo piso. Todo con un concepto abierto que funciona gracias a puertas ' +
      'correderas en las zonas centrales.',
    destacados: ['Puertas correderas en zonas centrales', 'Baño de servicio', 'Quincho con parrilla'],
    terminaciones: [...TERMINACIONES_BASE, 'Baño de servicio'],
    adicionales: ['Quincho con parrilla', 'Caldera'],
    galeria: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
    plantas: ['planta'],
    notaDato: null,
  },
  {
    slug: 'colonial-192',
    nombre: 'Colonial 192',
    m2: 192,
    uf: 11990,
    dormitorios: 4,
    banos: 5,
    pisos: 2,
    estilo: 'Colonial',
    material: 'Albañilería reforzada',
    resumen:
      'Dos pisos con espacio versátil en el segundo nivel y dormitorio de servicio.',
    descripcion:
      'Nuestro modelo 192 de estilo colonial de 2 pisos cuenta con 4 dormitorios más ' +
      'uno de servicio y 5 baños. Amplio espacio versátil en el segundo piso, con ' +
      'concepto abierto, cocina equipada y una gran isla central.',
    destacados: ['Dormitorio y baño de servicio', 'Segundo piso versátil', 'Piso superior en SPC vinílico'],
    terminaciones: [...TERMINACIONES_BASE, 'Segundo piso en SPC vinílico', 'Dormitorio y baño de servicio'],
    adicionales: ['Quincho con parrilla', 'Caldera'],
    galeria: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
    plantas: ['planta', 'planta-2'],
    notaDato:
      'El sitio original nombra este modelo como 190 en la portada, 192 en el menú y ' +
      '192 en su propia ficha. Mantenemos 192, que es lo que dice la ficha.',
  },
  {
    slug: 'mediterranea-310',
    nombre: 'Mediterránea 310',
    m2: 310,
    uf: null,
    dormitorios: 5,
    banos: 5,
    pisos: 2,
    estilo: 'Mediterránea',
    material: 'Hormigón armado',
    resumen: 'El modelo mayor de la promoción, con sala de estar y envolvente térmica EIFS.',
    descripcion:
      'Modelo de estilo mediterráneo de 310 m² con 5 dormitorios, 5 baños y sala de ' +
      'estar. Vivienda de hormigón armado con sistema térmico de envolvente EIFS.',
    destacados: ['Sala de estar independiente', 'Hormigón armado', 'Envolvente térmica EIFS'],
    terminaciones: [...TERMINACIONES_BASE, 'Baño de servicio'],
    adicionales: ['Quincho con parrilla', 'Caldera'],
    galeria: ['g1', 'g2', 'g3'],
    plantas: ['planta'],
    notaDato:
      'La superficie de este modelo aparece como 310, 283 y 159 m² en distintas partes ' +
      'de la ficha original, y como 308 m² en el sitio de Ferval. Publicamos 310, que es ' +
      'lo que dicen el título y el texto de la ficha, y el precio queda a consultar.',
  },
  {
    slug: 'mediterranea-182',
    nombre: 'Mediterránea 182',
    m2: 182,
    uf: null,
    dormitorios: 4,
    banos: 4,
    pisos: 2,
    estilo: 'Mediterránea',
    material: 'Hormigón armado',
    resumen: 'Cuatro dormitorios y sala de estar en hormigón armado.',
    descripcion:
      'Modelo de estilo mediterráneo de 182 m² con 4 dormitorios, 4 baños y sala de ' +
      'estar. Vivienda de hormigón armado con sistema térmico de envolvente EIFS.',
    destacados: ['Sala de estar independiente', 'Hormigón armado', 'Envolvente térmica EIFS'],
    terminaciones: [...TERMINACIONES_BASE, 'Baño de servicio'],
    adicionales: ['Quincho con parrilla', 'Caldera'],
    galeria: ['g1', 'g2', 'g3'],
    plantas: ['planta'],
    notaDato: 'La ficha original no publica precio para este modelo.',
  },
  {
    slug: 'mediterranea-179',
    nombre: 'Mediterránea 179',
    m2: 179.22,
    uf: null,
    dormitorios: 4,
    banos: 5,
    pisos: 2,
    estilo: 'Mediterránea',
    material: 'Albañilería reforzada',
    resumen: '107,18 m² en el primer piso y 72,07 m² en el segundo, con sala de estar.',
    descripcion:
      'Modelo de estilo mediterráneo de 179 m² con 4 dormitorios, 5 baños y sala de ' +
      'estar. Vivienda de albañilería reforzada con sistema térmico de envolvente EIFS. ' +
      'Superficie construida: 107,18 m² en el primer piso y 72,07 m² en el segundo.',
    destacados: ['Sala de estar independiente', 'Superficie detallada por piso', 'Envolvente térmica EIFS'],
    terminaciones: [...TERMINACIONES_BASE, 'Baño de servicio'],
    adicionales: ['Quincho con parrilla', 'Caldera'],
    galeria: ['g1', 'g2', 'g3', 'g4'],
    plantas: ['planta'],
    notaDato: 'La ficha original no publica precio para este modelo.',
  },
  {
    slug: 'mediterranea-179-1piso',
    nombre: 'Mediterránea 179 · 1 piso',
    m2: 179,
    uf: null,
    dormitorios: 3,
    banos: 4,
    pisos: 1,
    estilo: 'Mediterránea',
    material: 'Albañilería reforzada',
    resumen: 'La misma superficie del 179, resuelta en un solo nivel.',
    descripcion:
      'Nuestro modelo 179 de estilo mediterráneo en un solo piso cuenta con 3 ' +
      'dormitorios, 4 baños y sala de estar. Vivienda de albañilería reforzada.',
    destacados: ['Todo en un nivel', 'Sala de estar independiente', 'Albañilería reforzada'],
    terminaciones: [...TERMINACIONES_BASE, 'Baño de servicio'],
    adicionales: ['Quincho con parrilla', 'Caldera'],
    galeria: ['g1', 'g2', 'g3'],
    plantas: ['planta'],
    notaDato:
      'La ficha original rotula este modelo como 159 m² en su distintivo de precio y ' +
      'como 179 m² en el título. Publicamos 179 y dejamos el precio a consultar.',
  },
];

/** Adjunta las rutas de imagen ya resueltas por Vite. */
export const modelos = MODELOS.map((m) => ({
  ...m,
  hero: img(m.slug, 'hero'),
  // El archivo base va primero con su ancho real: sin él, el navegador no
  // puede elegir la imagen grande y una pantalla retina recibe la reducida.
  heroSrcSet: `${img(m.slug, 'hero')} 1920w, ${variantes(m.slug, 'hero', [1200, 760])}`,
  galeriaImgs: m.galeria.map((g, i) => ({
    src: img(m.slug, g),
    srcSet: `${img(m.slug, g)} 1600w, ${variantes(m.slug, g, [900])}`,
    alt: `${m.nombre} · imagen ${i + 1} de ${m.galeria.length}`,
  })),
  plantasImgs: m.plantas.map((p, i) => ({
    src: img(m.slug, p),
    ancho: medida(`modelos/${m.slug}/${p}`)[0],
    alto: medida(`modelos/${m.slug}/${p}`)[1],
    alt:
      m.plantas.length > 1
        ? `Planta del modelo ${m.nombre}, nivel ${i + 1}`
        : `Planta del modelo ${m.nombre}`,
  })),
}));

export const porSlug = (slug) => modelos.find((m) => m.slug === slug);

/** Rangos reales del catálogo, calculados y no escritos a mano. */
export const RANGOS = {
  m2Min: Math.min(...MODELOS.map((m) => m.m2)),
  m2Max: Math.max(...MODELOS.map((m) => m.m2)),
  ufMin: Math.min(...MODELOS.filter((m) => m.uf).map((m) => m.uf)),
  dormMin: Math.min(...MODELOS.map((m) => m.dormitorios)),
  dormMax: Math.max(...MODELOS.map((m) => m.dormitorios)),
};
