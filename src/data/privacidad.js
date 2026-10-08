/**
 * Política de privacidad: la información permanente que exige el Art. 14 ter
 * de la Ley 19.628, modificada por la Ley 21.719 (vigente desde el 1 de
 * diciembre de 2026). Cada sección indica la letra que cubre.
 *
 * Es un borrador fundado en el texto de la ley, no asesoría legal: Ferval
 * debe revisarlo y completar los marcadores [COMPLETAR: …] antes de publicar.
 * La página los resalta para que no pasen inadvertidos.
 *
 * `POLITICA.version` se guarda con cada consentimiento de la agenda. Si cambia
 * el texto, sube la versión y la fecha.
 */
import { CORPORATIVO } from './contacto.js';

export const POLITICA = { version: '1.0', fecha: '2026-10-08' };

const CANAL = '[COMPLETAR: correo para solicitudes de privacidad, p. ej. contacto@fervali.cl]';

export const SECCIONES = [
  {
    id: 'responsable',
    letra: 'b',
    titulo: 'Quién es responsable de tus datos',
    parrafos: [
      `${CORPORATIVO.nombre} ([COMPLETAR: razón social]), RUT [COMPLETAR: RUT], representada por [COMPLETAR: representante legal], con domicilio en [COMPLETAR: domicilio legal]. Es quien decide para qué y cómo se usan los datos que se reciben en este sitio.`,
    ],
  },
  {
    id: 'canal',
    letra: 'c',
    titulo: 'Cómo hacer una solicitud',
    parrafos: [
      `Escríbenos a ${CANAL} o envía una carta a [COMPLETAR: domicilio postal, p. ej. ${CORPORATIVO.direccion}]. Cuéntanos qué quieres hacer con tus datos y danos un dato para encontrarlos, como el nombre y el teléfono con que pediste la visita. Es gratis.`,
    ],
  },
  {
    id: 'datos',
    letra: 'd',
    titulo: 'Qué datos tratamos',
    parrafos: [
      'Solo los de las personas que piden una visita a la sala de ventas desde este sitio:',
    ],
    lista: [
      'Nombre, teléfono y, si lo dejas, correo electrónico.',
      'El día y la hora de la visita, y el sitio o el modelo de casa que te interesa, si lo indicas.',
      'El comentario que quieras agregar.',
      'Para poder demostrar que aceptaste: el texto que aceptaste, la versión de esta política, la fecha y hora, y una huella cifrada de tu dirección IP (no la dirección en sí), que también sirve para frenar envíos abusivos.',
    ],
    cierre:
      'El formulario de la página de contacto no guarda nada: arma un mensaje con lo que escribes y lo abre en WhatsApp o en tu correo. Lo envías tú, y desde ahí rigen las condiciones de ese servicio.',
  },
  {
    id: 'finalidad',
    letra: 'd',
    titulo: 'Para qué los usamos y con qué base',
    parrafos: [
      'Para coordinar y confirmar la visita que pediste, con tu consentimiento, que das al marcar la casilla del formulario antes de enviarlo.',
      'Para enviarte novedades de Reserva Las Rastras, solo si marcas la casilla de novedades, que es aparte y opcional. Sin ella, tu visita se agenda igual.',
      'No los usamos para nada más.',
    ],
  },
  {
    id: 'destinatarios',
    letra: 'd',
    titulo: 'Quién más los recibe',
    parrafos: [
      `La sala de ventas de Reserva Las Rastras, de ${CORPORATIVO.nombre}. Además, tres proveedores los tratan por cuenta nuestra y solo para prestar su servicio:`,
    ],
    lista: [
      'Vercel Inc., que aloja este sitio.',
      'Supabase Inc., que guarda las solicitudes de visita.',
      'Resend, que envía los correos de confirmación.',
    ],
    cierre: 'No vendemos ni cedemos tus datos a nadie.',
  },
  {
    id: 'seguridad',
    letra: 'e',
    titulo: 'Cómo los protegemos',
    parrafos: [
      'Todo viaja cifrado (HTTPS). La base de datos no admite acceso público: solo el servidor del sitio la consulta, con una clave que nunca llega al navegador. Los registros técnicos no guardan datos personales, el acceso de la sala de ventas es restringido y los datos se borran pasado el plazo de conservación.',
    ],
  },
  {
    id: 'derechos',
    letra: 'f',
    titulo: 'Tus derechos',
    parrafos: [
      'Puedes pedir acceso a tus datos, que los corrijamos, que los eliminemos, oponerte a que los usemos, pedir que los bloqueemos o recibirlos en un formato que puedas llevar a otro lado (portabilidad).',
      'Respondemos dentro de 30 días corridos desde que recibimos la solicitud. Si hiciera falta más tiempo, el plazo se puede extender una sola vez por otros 30 días, y te avisaremos.',
    ],
  },
  {
    id: 'reclamo',
    letra: 'g',
    titulo: 'Si no te respondemos',
    parrafos: [
      'Si no respondemos a tiempo o rechazamos tu solicitud, puedes reclamar ante la Agencia de Protección de Datos Personales.',
    ],
  },
  {
    id: 'transferencias',
    letra: 'h',
    titulo: 'Datos fuera de Chile',
    parrafos: [
      'Supabase guarda las solicitudes en servidores de São Paulo, Brasil. Vercel y Resend procesan datos en Estados Unidos.',
      '[COMPLETAR: si esos países tienen un nivel adecuado de protección según la Agencia y, si no, las garantías que se usan; p. ej., las cláusulas contractuales de los acuerdos de tratamiento de datos (DPA) de cada proveedor. Confirmar con asesoría legal.]',
    ],
  },
  {
    id: 'conservacion',
    letra: 'i',
    titulo: 'Cuánto tiempo los guardamos',
    parrafos: [
      'Hasta 12 meses después de la fecha de la visita; luego se eliminan solos. Si cancelas o pides que los borremos, se eliminan antes.',
    ],
  },
  {
    id: 'fuente',
    letra: 'j',
    titulo: 'De dónde salen',
    parrafos: ['Nos los das tú, directamente, en el formulario. No los obtenemos de otras fuentes.'],
  },
  {
    id: 'retiro',
    letra: 'k',
    titulo: 'Retirar tu consentimiento',
    parrafos: [
      `Cuando quieras, desde el enlace "Borrar mis datos" del correo de confirmación o escribiendo a ${CANAL}. Retirarlo no afecta lo que se hizo antes con tus datos.`,
    ],
  },
  {
    id: 'automatizadas',
    letra: 'l',
    titulo: 'Decisiones automatizadas',
    parrafos: ['No tomamos decisiones automatizadas sobre ti ni elaboramos perfiles.'],
  },
  {
    id: 'navegacion',
    titulo: 'Cookies y servicios externos',
    parrafos: [
      'Este sitio no usa cookies ni herramientas de analítica. Las tipografías se cargan desde Google Fonts, que recibe la dirección IP de tu navegador para entregarlas. Los enlaces a WhatsApp y a Google Maps solo te llevan a esos servicios si haces clic.',
      'Si algún día se agrega analítica, esta política se actualizará antes.',
    ],
  },
  {
    id: 'cambios',
    titulo: 'Cambios a esta política',
    parrafos: [
      'Cada cambio se publica aquí con una versión y una fecha nuevas. Si cambia la finalidad para la que usamos tus datos, te pediremos un consentimiento nuevo.',
    ],
  },
];
