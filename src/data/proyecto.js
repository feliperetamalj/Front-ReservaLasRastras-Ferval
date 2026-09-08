/**
 * Datos del proyecto y de la empresa.
 *
 * Extraídos de reservalasrastras.cl y del sitio de la inmobiliaria
 * (fervali.cl), leídos el 2026-09-08.
 */

const IMAGENES = import.meta.glob('../assets/proyecto/*.webp', {
  eager: true,
  import: 'default',
});

import { medida } from './medidas';

const img = (nombre) => IMAGENES[`../assets/proyecto/${nombre}.webp`];
const dim = (nombre) => {
  const [ancho, alto] = medida(`proyecto/${nombre}`);
  return { ancho, alto };
};
const variante = (nombre, ancho) => IMAGENES[`../assets/proyecto/${nombre}-${ancho}.webp`];

export const PROYECTO = {
  nombre: 'Reserva Las Rastras',
  bajada: 'Barrio Residencial',
  comuna: 'Talca',
  region: 'Región del Maule',
  desarrollador: 'Inmobiliaria Ferval',

  titular: 'Un barrio pensado antes de ser construido',
  resumen:
    'Sitios completamente urbanizados y seis modelos de casa en el sector de mayor ' +
    'plusvalía de Talca, con acceso controlado, microbarrios y red eléctrica subterránea.',

  // El sitio original publica este valor referencial de suelo en su portada.
  precioSueloUF: 5.2,
};

/** Lo que distingue al proyecto, tal como lo enumera la promoción. */
export const ATRIBUTOS = [
  {
    titulo: 'Acceso directo desde Av. Las Rastras',
    detalle:
      'Portal de acceso propio sobre la avenida, sin pasar por calles interiores de otros barrios.',
    icono: 'portal',
  },
  {
    titulo: 'Diseño de microbarrios',
    detalle:
      'El loteo se organiza en seis sectores conectados por avenidas amplias, no en una única grilla continua.',
    icono: 'plano',
  },
  {
    titulo: 'Red eléctrica subterránea',
    detalle: 'Sin postes ni tendido a la vista en todo el barrio.',
    icono: 'rayo',
  },
  {
    titulo: 'Sitios 100 % urbanizados',
    detalle: 'Entregados con todas las redes conectadas y listos para construir.',
    icono: 'sitio',
  },
  {
    titulo: 'Amplios sectores de áreas verdes',
    detalle: 'Plazas y paisajismo integrados al recorrido del barrio, no como relleno de esquinas.',
    icono: 'arbol',
  },
  {
    titulo: 'Estacionamientos de visita',
    detalle: 'Espacios previstos dentro del loteo para quienes llegan de afuera.',
    icono: 'auto',
  },
];

/** Servicios del entorno, según la promoción del proyecto. */
export const ENTORNO = [
  'Supermercado',
  'Jardín infantil',
  'Bancos',
  'Farmacias',
  'Áreas de servicios',
  'Centro comercial',
  'Colegios y universidades',
];

/** Las razones que el propio proyecto publica para invertir en el sector. */
export const RAZONES = [
  {
    titulo: 'El lugar para crecer en familia',
    texto:
      'Portal de acceso, áreas verdes y equipamiento de juegos en un entorno pensado para la vida familiar.',
  },
  {
    titulo: 'Alta plusvalía',
    texto:
      'El sector oriente de Talca se ha consolidado como epicentro comercial de la ciudad, con supermercados, ' +
      'centro comercial, casino, colegios, universidades y servicios a pocos minutos.',
  },
  {
    titulo: 'Campo y ciudad a la vez',
    texto:
      'A veinte minutos del centro de Talca, con el espacio y la tranquilidad de la vida de campo y toda la ' +
      'conectividad de lo urbano.',
  },
];

export const CONTACTO = {
  // El sitio del proyecto no publica teléfono propio; este es el comercial de
  // la inmobiliaria que lo desarrolla.
  telefono: '+56 71 2 234830',
  telefonoLink: '+56712234830',
  whatsapp: '56712234830',
  email: 'contacto@fervali.cl',
  direccion: 'Avda. 30 Oriente, Edificio Las Rastras III, Piso 1, Local E',
  ciudad: 'Talca, Región del Maule',
  instagram: 'https://www.instagram.com/reservalasrastras',
  facebook: 'https://www.facebook.com/reservalasrastras/',
  sitioInmobiliaria: 'https://fervali.cl',
};

/**
 * Horario de la sala de ventas.
 *
 * El sitio original publica cuatro horarios distintos en cuatro páginas. Este
 * es el que aparece siete veces (portada y las seis fichas de modelo); los
 * otros tres aparecen una vez cada uno. Conviene confirmarlo con la sala de
 * ventas antes de publicar.
 */
export const HORARIO = [
  { dias: 'Lunes a viernes', horas: '10:00 – 13:00 y 14:00 – 18:30' },
  { dias: 'Sábado', horas: '10:00 – 15:00' },
  { dias: 'Domingo', horas: 'Cerrado' },
];

/**
 * Imágenes del proyecto, ya resueltas por Vite.
 *
 * El srcSet tiene que incluir también el archivo base con su ancho real: si
 * solo se listan las variantes reducidas, el navegador nunca puede elegir la
 * grande y una pantalla de 1440 px o cualquier retina recibe una imagen
 * ampliada.
 */
const ANCHO_BASE = { portal: 1920, avenida: 1920, 'areas-verdes': 1920, plaza: 1920, calle: 1920, elevacion: 1600 };

const conVariantes = (nombre, anchos) =>
  [`${img(nombre)} ${ANCHO_BASE[nombre]}w`, ...anchos.map((a) => `${variante(nombre, a)} ${a}w`)].join(', ');

export const FOTOS = {
  portal: { src: img('portal'), srcSet: conVariantes('portal', [1200, 760]) },
  avenida: { src: img('avenida'), srcSet: conVariantes('avenida', [900]) },
  areasVerdes: { src: img('areas-verdes'), srcSet: conVariantes('areas-verdes', [900]) },
  plaza: { src: img('plaza'), srcSet: conVariantes('plaza', [900]) },
  calle: { src: img('calle'), srcSet: conVariantes('calle', [900]) },
  elevacion: { src: img('elevacion'), srcSet: conVariantes('elevacion', [900]) },
  masterPlan: { src: img('master-plan'), ...dim('master-plan') },
  emplazamiento: { src: img('emplazamiento'), ...dim('emplazamiento') },
};

/** Recorrido en imágenes del barrio construido. */
export const GALERIA_BARRIO = [
  { ...FOTOS.portal, alt: 'Portal de acceso de Reserva Las Rastras sobre Av. Las Rastras' },
  { ...FOTOS.avenida, alt: 'Avenida interior del barrio con paisajismo y arbolado' },
  { ...FOTOS.areasVerdes, alt: 'Área verde del barrio con juegos y equipamiento' },
  { ...FOTOS.plaza, alt: 'Plaza interior del barrio' },
  { ...FOTOS.calle, alt: 'Fachada de una vivienda del barrio desde la calle' },
];
