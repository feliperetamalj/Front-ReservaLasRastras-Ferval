/**
 * Metadatos de cada ruta: título, descripción, canonical y Open Graph.
 *
 * Los usa el prerender (scripts/prerender.mjs), que escribe un HTML por ruta
 * con su propio <head>, y el componente Metadatos, que los actualiza al
 * navegar dentro del sitio. Las cifras se calculan de los datos, como en las
 * páginas: ninguna se escribe a mano.
 */
import { CORPORATIVO, CONTACTO, PROYECTO } from './proyecto';
import { RESUMEN } from './sitios';
import { RANGOS, modelos } from './modelos';
import { enPalabras, m2Corto, plural } from '../utils/formato';

/** Dominio público del proyecto: canonical y URLs absolutas de Open Graph. */
export const SITIO_URL = 'https://reservalasrastras.cl';

const MARCA = PROYECTO.nombre;
const CANTIDAD_MODELOS = enPalabras(modelos.length);

const PAGINAS = {
  '/': {
    titulo: `${MARCA} · Barrio residencial en ${PROYECTO.comuna}`,
    descripcion: `${RESUMEN.disponibles} sitios urbanizados desde ${m2Corto(RESUMEN.m2Min)} m² y ${CANTIDAD_MODELOS} modelos de casa en el sector de mayor plusvalía de ${PROYECTO.comuna}. Acceso controlado, microbarrios y red eléctrica subterránea.`,
  },
  '/modelos': {
    titulo: `Modelos de casa · ${MARCA}`,
    descripcion: `${CANTIDAD_MODELOS[0].toUpperCase()}${CANTIDAD_MODELOS.slice(1)} modelos de casa, de ${RANGOS.m2Min} a ${m2Corto(RANGOS.m2Max)} m² y de ${RANGOS.dormMin} a ${RANGOS.dormMax} dormitorios, que se construyen sobre el sitio que elijas en ${MARCA}.`,
  },
  '/master-plan': {
    titulo: `Sitios disponibles · Master plan · ${MARCA}`,
    descripcion: `${RESUMEN.disponibles} de ${RESUMEN.total} sitios disponibles, de ${m2Corto(RESUMEN.m2Min)} a ${m2Corto(RESUMEN.m2Max)} m², en ${enPalabras(RESUMEN.sectores)} sectores. Busca por sector y superficie en el plano interactivo.`,
  },
  '/el-barrio': {
    titulo: `El barrio · ${MARCA}`,
    descripcion: `Por qué vivir en ${MARCA}: un barrio urbanizado en el sector nororiente de ${PROYECTO.comuna}, cerca de comercio, salud, educación y entretenimiento.`,
  },
  '/partners': {
    titulo: `Partners · ${MARCA}`,
    descripcion: `Arquitectos y constructoras con obra ejecutada dentro de ${MARCA}, que conocen la normativa interna del loteo.`,
  },
  '/contacto': {
    titulo: `Contacto · ${MARCA}`,
    descripcion: `Sala de ventas ${CONTACTO.direccion}, ${CONTACTO.ciudad}. WhatsApp ${CONTACTO.telefono}. Superficies, precios vigentes y disponibilidad real de sitios.`,
  },
  '/agendar': {
    titulo: `Agenda tu visita · ${MARCA}`,
    descripcion: `Elige día y hora para visitar la sala de ventas de ${MARCA}: te mostramos el barrio, los sitios disponibles y las casas.`,
  },
  '/privacidad': {
    titulo: `Política de privacidad · ${MARCA}`,
    descripcion: `Qué datos recibe el sitio de ${MARCA}, para qué se usan y cómo pedir que los corrijamos o los borremos.`,
  },
  // Enlace personal del correo de confirmación: no se indexa.
  '/agendar/gestionar': {
    titulo: `Tu visita · ${MARCA}`,
    descripcion: 'Cancela tu visita o borra tus datos.',
    indexar: false,
  },
};

for (const m of modelos) {
  PAGINAS[`/modelos/${m.slug}`] = {
    titulo: `Casa ${m.nombre} · ${MARCA}`,
    descripcion: `Casa ${m.nombre} en ${MARCA}: ${m.m2} m², ${plural(m.dormitorios, 'dormitorio', 'dormitorios')}, ${plural(m.banos, 'baño', 'baños')} y ${plural(m.pisos, 'piso', 'pisos')}, construida sobre el sitio que elijas.`,
  };
}

const NO_ENCONTRADA = {
  titulo: `Página no encontrada · ${MARCA}`,
  descripcion: `Esta página no existe en el sitio de ${MARCA}.`,
  indexar: false,
};

/** Todas las rutas que se prerenderizan. */
export const RUTAS = Object.keys(PAGINAS);

/** Las rutas que van al sitemap. */
export const RUTAS_INDEXABLES = RUTAS.filter((r) => PAGINAS[r].indexar !== false);

/** El <head> de una ruta. Una ruta desconocida recibe el de la página 404. */
export function cabeza(ruta) {
  const pagina = PAGINAS[ruta] ?? NO_ENCONTRADA;
  return {
    ...pagina,
    indexar: pagina.indexar !== false,
    // Una página que no se indexa no declara canonical: serían señales contrarias.
    canonical: pagina.indexar === false ? null : `${SITIO_URL}${ruta}`,
    imagen: `${SITIO_URL}/og-image.jpg`,
  };
}

/**
 * Datos estructurados de la portada: la inmobiliaria y el proyecto. Sin
 * precios: no hay ninguno confirmado para publicar como dato.
 */
export const DATOS_ESTRUCTURADOS = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITIO_URL}/#ferval`,
      name: CORPORATIVO.nombre,
      url: CORPORATIVO.sitio,
      telephone: CORPORATIVO.telefono,
      email: CORPORATIVO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CORPORATIVO.direccion,
        addressLocality: PROYECTO.comuna,
        addressRegion: PROYECTO.region,
        addressCountry: 'CL',
      },
    },
    {
      '@type': 'Residence',
      '@id': `${SITIO_URL}/#proyecto`,
      name: MARCA,
      description: PROYECTO.resumen,
      url: `${SITIO_URL}/`,
      image: `${SITIO_URL}/og-image.jpg`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACTO.direccion,
        addressLocality: PROYECTO.comuna,
        addressRegion: PROYECTO.region,
        addressCountry: 'CL',
      },
      containedInPlace: { '@type': 'City', name: PROYECTO.comuna },
    },
  ],
};
