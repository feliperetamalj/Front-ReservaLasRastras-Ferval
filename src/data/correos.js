/**
 * Correos de la agenda, con la marca del sitio.
 *
 * El HTML de correo no es el de una página: Gmail y Outlook ignoran las hojas
 * de estilo, las variables CSS, flexbox y grid. Por eso todo va en tablas, con
 * estilos en línea y los colores escritos tal cual (son los de tokens.css).
 * Las imágenes se piden al sitio publicado (public/email/) con URL absoluta.
 *
 * Reciben los valores ya escapados para HTML (lo hacen las funciones de
 * `api/`); las fechas y horas las arma el servidor. Cada correo trae además
 * su versión en texto plano, que leen algunos clientes y los filtros de spam.
 */
import { ATENCION, CONTACTO, CORPORATIVO } from './contacto.js';

const C = {
  tinta: '#1e120d',
  grafito: '#434040',
  tenue: '#5f5a58',
  oro: '#c7a626',
  oroTexto: '#82680a',
  oroClaro: '#f6d85d',
  papel: '#faf7f2',
  fondo: '#f2ede4',
  borde: '#e6dfd3',
  sobreTinta: '#e6dfd3',
  whatsapp: '#1a8a4c',
};
const SERIF = "Cinzel, Georgia, 'Times New Roman', serif";
const SANS = "Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const HORARIO = `${DIAS[ATENCION.dias[0]].replace(/^./, (c) => c.toUpperCase())} a ${
  DIAS[ATENCION.dias.at(-1)]
}, ${ATENCION.tramos.map(([a, b]) => `${a} a ${b}`).join(' y ')}`;

/** Botón que funciona en todos los clientes: una celda con fondo y el enlace adentro. */
const boton = (href, texto, { fondo = C.oro, color = C.tinta } = {}) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td bgcolor="${fondo}" style="border-radius:6px;">
      <a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:15px;font-weight:600;color:${color};text-decoration:none;border-radius:6px;">${texto}</a>
    </td>
  </tr></table>`;

/** Ficha con filete dorado: rótulo en versalita y valor debajo. */
const ficha = (filas) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.papel};border-left:3px solid ${C.oro};border-radius:4px;">
    ${filas
      .filter(([, valor]) => valor)
      .map(
        ([rotulo, valor]) => `
    <tr><td style="padding:14px 20px 0;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${C.oroTexto};">${rotulo}</td></tr>
    <tr><td style="padding:4px 20px 0;font-family:${SANS};font-size:16px;line-height:1.5;color:${C.tinta};">${valor}</td></tr>`,
      )
      .join('')}
    <tr><td style="padding:0 0 14px;font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>`;

const parrafo = (texto, { tamano = 16, color = C.grafito, arriba = 16 } = {}) =>
  `<p style="margin:${arriba}px 0 0;font-family:${SANS};font-size:${tamano}px;line-height:1.6;color:${color};">${texto}</p>`;

/** El marco común: cabecera con el logo, foto opcional, cuerpo blanco y pie oscuro. */
function marco({ sitio, preheader, foto, antetitulo, titulo, cuerpo }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background:${C.fondo};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.fondo};">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.fondo}">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;">
    <tr><td align="center" bgcolor="${C.tinta}" style="padding:28px 24px;">
      <a href="${sitio}/"><img src="${sitio}/email/logo.png" width="190" alt="Reserva Las Rastras · Barrio Residencial" style="display:block;width:190px;max-width:100%;height:auto;border:0;"></a>
    </td></tr>
    ${
      foto
        ? `<tr><td><img src="${sitio}/email/portada.jpg" width="600" alt="Portal de acceso de Reserva Las Rastras" style="display:block;width:100%;height:auto;border:0;"></td></tr>`
        : ''
    }
    <tr><td style="padding:40px 40px 36px;">
      <p style="margin:0;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.oroTexto};">${antetitulo}</p>
      <h1 style="margin:10px 0 0;font-family:${SERIF};font-size:28px;line-height:1.25;font-weight:400;color:${C.tinta};">${titulo}</h1>
      ${cuerpo}
    </td></tr>
    <tr><td bgcolor="${C.tinta}" style="padding:28px 40px;">
      <p style="margin:0;font-family:${SERIF};font-size:15px;letter-spacing:1px;color:#ffffff;">${CONTACTO.sala}</p>
      <p style="margin:8px 0 0;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.sobreTinta};">
        ${CONTACTO.direccion}, ${CONTACTO.ciudad}<br>
        ${HORARIO}<br>
        WhatsApp <a href="https://wa.me/${CONTACTO.whatsapp}" style="color:${C.oroClaro};text-decoration:none;">${CONTACTO.telefono}</a>
      </p>
      <p style="margin:18px 0 0;padding-top:16px;border-top:1px solid #3a3130;font-family:${SANS};font-size:12px;line-height:1.6;color:#a49c95;">
        ${CORPORATIVO.nombre} · <a href="${sitio}/" style="color:#a49c95;">Sitio web</a> · <a href="${sitio}/privacidad" style="color:#a49c95;">Política de privacidad</a>
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/** Al visitante: la solicitud quedó registrada. */
export const correoVisitante = ({ sitio, nombre, fecha, hora, enlaceGestion }) => ({
  asunto: `Tu visita a Reserva Las Rastras · ${fecha}, ${hora}`,
  html: marco({
    sitio,
    foto: true,
    preheader: `Recibimos tu solicitud para el ${fecha} a las ${hora}. Un ejecutivo te confirmará por WhatsApp.`,
    antetitulo: 'Solicitud recibida',
    titulo: `Te esperamos el ${fecha}`,
    cuerpo: `
      ${parrafo(`Hola ${nombre}, recibimos tu solicitud de visita. <strong style="color:${C.tinta};">Un ejecutivo te confirmará por WhatsApp</strong>; no tienes que hacer nada más.`)}
      <div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
      ${ficha([
        ['Día', fecha],
        ['Hora', `${hora} hrs · la visita dura cerca de una hora`],
        ['Lugar', `${CONTACTO.sala}<br><span style="color:${C.tenue};font-size:14px;">${CONTACTO.direccion}, ${CONTACTO.ciudad}</span>`],
      ])}
      <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
      ${boton(CONTACTO.mapa, 'Cómo llegar')}
      ${parrafo('El archivo adjunto agrega la visita a tu calendario.', { tamano: 14, color: C.tenue, arriba: 14 })}
      <div style="height:28px;line-height:28px;font-size:0;border-bottom:1px solid ${C.borde};">&nbsp;</div>
      ${parrafo(
        `¿Cambio de planes? <a href="${enlaceGestion}" style="color:${C.oroTexto};font-weight:600;">Cancela tu visita o borra tus datos</a>. Es inmediato.`,
        { tamano: 14, arriba: 24 },
      )}`,
  }),
  texto: [
    `Hola ${nombre}:`,
    `Recibimos tu solicitud de visita a Reserva Las Rastras para el ${fecha} a las ${hora}. Un ejecutivo te confirmará por WhatsApp.`,
    `${CONTACTO.sala}\n${CONTACTO.direccion}, ${CONTACTO.ciudad}\nCómo llegar: ${CONTACTO.mapa}`,
    `¿Cambio de planes? Cancela tu visita o borra tus datos: ${enlaceGestion}`,
    `${CORPORATIVO.nombre} · WhatsApp ${CONTACTO.telefono}`,
  ].join('\n\n'),
});

/** A la sala de ventas: una solicitud nueva, con todo para confirmarla. */
export const correoSala = ({ sitio, nombre, telefono, email, fecha, fechaCorta, hora, interes, comentario, marketing, enlaceWhatsApp }) => ({
  asunto: `Nueva visita · ${fechaCorta} ${hora}${interes ? ` · ${interes}` : ''}`,
  html: marco({
    sitio,
    preheader: `${nombre} pidió visitar la sala el ${fecha} a las ${hora}.`,
    antetitulo: 'Nueva solicitud de visita',
    titulo: `${fecha}, ${hora} hrs`,
    cuerpo: `
      ${parrafo('Llegó una solicitud desde el sitio. Confírmala por WhatsApp con el mensaje ya escrito:')}
      <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
      ${boton(enlaceWhatsApp, 'Confirmar por WhatsApp', { fondo: C.whatsapp, color: '#ffffff' })}
      <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
      ${ficha([
        ['Nombre', nombre],
        ['Teléfono', telefono],
        ['Correo', email],
        ['Le interesa', interes || 'Aún no lo sabe'],
        ['Comentario', comentario],
        ['Novedades', marketing ? 'Sí, aceptó recibirlas' : 'No'],
      ])}
      ${parrafo('La solicitud queda como <strong>solicitada</strong>. Cuando la confirmes, cámbiala a <strong>confirmada</strong> en Supabase (ver docs/agenda.md).', { tamano: 13, color: C.tenue, arriba: 24 })}`,
  }),
  texto: [
    `Nueva solicitud de visita: ${fecha}, ${hora} hrs.`,
    [
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      email && `Correo: ${email}`,
      `Le interesa: ${interes || 'Aún no lo sabe'}`,
      comentario && `Comentario: ${comentario}`,
      `Novedades: ${marketing ? 'sí' : 'no'}`,
    ]
      .filter(Boolean)
      .join('\n'),
    `Confirmar por WhatsApp: ${enlaceWhatsApp}`,
  ].join('\n\n'),
});

/** A la sala: la persona canceló o borró sus datos desde el enlace del correo. */
export const correoCancelacion = ({ sitio, fecha, hora, borrado }) => ({
  asunto: `Visita cancelada · ${fecha} ${hora}`,
  html: marco({
    sitio,
    preheader: `Se liberó el bloque del ${fecha} a las ${hora}.`,
    antetitulo: 'Visita cancelada',
    titulo: `${fecha}, ${hora} hrs`,
    cuerpo: `
      ${parrafo('La persona canceló la visita desde el enlace de su correo de confirmación. El bloque quedó libre en la agenda.')}
      ${borrado ? parrafo('Además pidió borrar sus datos: la solicitud ya no está en la base.') : ''}`,
  }),
  texto: `Se canceló la visita del ${fecha} a las ${hora}. El bloque quedó libre.${
    borrado ? ' La persona pidió además borrar sus datos.' : ''
  }`,
});
