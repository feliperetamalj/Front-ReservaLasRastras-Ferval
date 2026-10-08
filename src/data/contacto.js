/**
 * Contacto de la sala de ventas, de la inmobiliaria y horario de atención.
 *
 * Datos puros, sin imágenes: los importan tanto el sitio como las funciones
 * de la agenda en `api/`, que corren en Node sin Vite.
 */

/**
 * Sala de ventas del proyecto. Datos del sitio nuevo de Ferval y del brochure
 * 2026 (octubre de 2026): ambos publican el mismo WhatsApp, la misma
 * dirección y el mismo horario.
 */
export const CONTACTO = {
  sala: 'Sala de ventas Alto Las Rastras',
  telefono: '+56 9 6642 4037',
  telefonoLink: '+56966424037',
  whatsapp: '56966424037',
  // La sala no publica correo propio: el correo es el de la inmobiliaria.
  email: 'contacto@fervali.cl',
  direccion: 'Alto Las Rastras · Camino Las Rastras, cruce Ruta 115-CH',
  ciudad: 'Talca, Región del Maule',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Camino%20Las%20Rastras%20cruce%20Ruta%20115-CH%2C%20Talca',
  instagram: 'https://www.instagram.com/reservalasrastras',
  facebook: 'https://www.facebook.com/reservalasrastras/',
};

/** La inmobiliaria que desarrolla el proyecto, como contacto corporativo. */
export const CORPORATIVO = {
  nombre: 'Inmobiliaria Ferval',
  telefono: '+56 71 2 234830',
  telefonoLink: '+56712234830',
  email: 'contacto@fervali.cl',
  direccion: 'Avda. 30 Oriente, Edificio Las Rastras III, Piso 1, Local E, Talca',
  sitio: 'https://fervali.cl',
};

/**
 * Atención de la sala de ventas: una sola fuente para el horario que se
 * muestra y para los bloques de la agenda de visitas.
 *
 * El sitio anterior publicaba cuatro horarios distintos en cuatro páginas. El
 * sitio nuevo y el brochure 2026 publican uno solo, igual en todas partes.
 * `dias` usa la numeración de JavaScript: 0 es domingo.
 */
export const ATENCION = {
  dias: [1, 2, 3, 4, 5, 6],
  tramos: [
    ['10:00', '13:00'],
    ['14:00', '18:00'],
  ],
};
