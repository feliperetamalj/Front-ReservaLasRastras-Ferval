/**
 * Arquitectos y constructoras autorizados para proyectar y construir dentro
 * del barrio.
 *
 * Origen: reservalasrastras.cl/partners, leído el 2026-09-08.
 *
 * Decisión deliberada sobre datos personales: el sitio original publica el
 * celular particular y el correo de Gmail de cada profesional. Aquí se listan
 * los nombres y la especialidad, y se conservan solo los datos de contacto
 * corporativos (sitio web y correo de empresa). Los celulares personales los
 * entrega la sala de ventas a quien los pida. Republicarlos en un sitio nuevo
 * es una decisión del cliente, no nuestra, y desde diciembre de 2026 queda
 * cubierta por la Ley 21.719.
 */

export const PARTNERS = [
  {
    categoria: 'Arquitectura',
    descripcion:
      'Profesionales autorizados para proyectar viviendas dentro del barrio, en línea con la ' +
      'normativa interna del loteo.',
    estudios: [
      { nombre: 'Iván Campos', rol: 'Arquitecto' },
      { nombre: 'Claudio Opazo', rol: 'Arquitecto' },
      {
        nombre: 'Estudio 111 Arquitectos Ltda.',
        rol: 'Oficina de arquitectura',
        contacto: 'María Paz Cabezas',
        sitio: 'https://www.e111a.cl',
        sitioTexto: 'e111a.cl',
      },
      { nombre: 'Enzo Sartori', rol: 'Arquitecto' },
    ],
  },
  {
    categoria: 'Arquitectura y construcción',
    descripcion:
      'Constructoras con obra ejecutada en el barrio, que toman el proyecto de principio a fin.',
    estudios: [
      {
        nombre: 'Constructora Aránguiz SPA',
        rol: 'Constructora',
        contacto: 'Juan Aránguiz Orrego',
        email: 'jaranguiz@constructoraaranguiz.cl',
      },
      {
        nombre: 'Constructora Sylco',
        rol: 'Constructora',
        contacto: 'Sebastián Leiva Frías · Juan Cristóbal Sánchez Quinteros',
      },
    ],
  },
];
