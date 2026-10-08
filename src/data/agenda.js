/**
 * Agenda de visitas a la sala de ventas: reglas y textos.
 *
 * Lo importan la página /agendar y las funciones de `api/`, que corren en
 * Node sin Vite: este archivo y los que importa no pueden traer imágenes.
 *
 * Los textos de consentimiento son los que se muestran y los que se guardan
 * con cada solicitud (Art. 12 de la Ley 19.628: el responsable debe poder
 * probar qué aceptó la persona). Si cambian, sube `POLITICA.version`.
 */
import { CONTACTO, CORPORATIVO } from './contacto.js';

export const AGENDA = {
  zona: 'America/Santiago',
  /** Cuántos días hacia adelante se ofrecen, contando hoy. */
  diasVentana: 21,
  /** Una visita no se puede pedir con menos anticipación que esta. */
  anticipacionMinutos: 120,
  /** Lo que dura una visita: también es el largo de cada bloque. */
  duracionMinutos: 60,
  /** Meses que se guardan los datos después de la fecha de la visita. */
  retencionMeses: 12,
};

export const TEXTOS = {
  aviso: `Usaremos tu nombre, teléfono y, si lo dejas, tu correo, solo para coordinar esta visita. Los trata ${CORPORATIVO.nombre} y los borramos ${AGENDA.retencionMeses} meses después de la visita. Puedes pedir que los eliminemos cuando quieras.`,
  consentimiento: `Acepto que ${CORPORATIVO.nombre} use mis datos para coordinar mi visita, según la Política de privacidad.`,
  marketing: 'Quiero recibir novedades de Reserva Las Rastras.',
  confirmacion: 'Un ejecutivo te confirmará por WhatsApp.',
};

/** El evento que se agrega al calendario del visitante. */
export const EVENTO = {
  resumen: 'Visita a Reserva Las Rastras',
  lugar: `${CONTACTO.sala}, ${CONTACTO.direccion}, ${CONTACTO.ciudad}`,
  descripcion: `${TEXTOS.confirmacion} Cómo llegar: ${CONTACTO.mapa}`,
};

/** Mensaje que la sala de ventas manda al visitante para confirmar. */
export const mensajeConfirmacion = ({ nombre, fecha, hora }) =>
  `Hola ${nombre}, te escribimos de la sala de ventas de Reserva Las Rastras para confirmar tu visita del ${fecha} a las ${hora}. ¿Nos confirmas que vienes?`;

/** Mensaje de respaldo cuando la agenda no responde: el pedido sigue por WhatsApp. */
export const mensajeRespaldo = ({ nombre, telefono, fecha, hora, interes, comentario }) =>
  [
    `Hola, quiero agendar una visita a Reserva Las Rastras${fecha ? ` el ${fecha}${hora ? ` a las ${hora}` : ''}` : ''}.`,
    [
      nombre && `Nombre: ${nombre}`,
      telefono && `Teléfono: ${telefono}`,
      interes && `Me interesa: ${interes}`,
    ]
      .filter(Boolean)
      .join('\n'),
    comentario?.trim(),
  ]
    .filter(Boolean)
    .join('\n\n');

/*
  Correos. Reciben los valores ya formateados y ya escapados para HTML: las
  funciones de `api/` se encargan de eso, aquí solo está la redacción.
*/

export const correoSala = ({ nombre, telefono, email, fecha, fechaCorta, hora, interes, comentario, marketing, enlaceWhatsApp }) => ({
  asunto: `Nueva visita · ${fechaCorta} ${hora}${interes ? ` · ${interes}` : ''}`,
  html: `
    <p>Llegó una solicitud de visita desde el sitio.</p>
    <table cellpadding="4" style="border-collapse:collapse">
      <tr><td><b>Día</b></td><td>${fecha}, ${hora}</td></tr>
      <tr><td><b>Nombre</b></td><td>${nombre}</td></tr>
      <tr><td><b>Teléfono</b></td><td>${telefono}</td></tr>
      ${email ? `<tr><td><b>Correo</b></td><td>${email}</td></tr>` : ''}
      <tr><td><b>Le interesa</b></td><td>${interes || 'Aún no lo sabe'}</td></tr>
      ${comentario ? `<tr><td><b>Comentario</b></td><td>${comentario}</td></tr>` : ''}
      <tr><td><b>Novedades</b></td><td>${marketing ? 'Sí, aceptó recibirlas' : 'No'}</td></tr>
    </table>
    <p><a href="${enlaceWhatsApp}" style="display:inline-block;padding:10px 16px;background:#1a8a4c;color:#fff;text-decoration:none;border-radius:6px">Confirmar por WhatsApp</a></p>
    <p style="color:#666;font-size:13px">La solicitud queda en estado "solicitada". Cámbiala a "confirmada" en Supabase cuando la confirmes (ver docs/agenda.md).</p>
  `,
});

export const correoVisitante = ({ nombre, fecha, hora, enlaceGestion }) => ({
  asunto: `Tu visita a Reserva Las Rastras · ${fecha}, ${hora}`,
  html: `
    <p>Hola ${nombre}:</p>
    <p>Recibimos tu solicitud de visita para el <b>${fecha} a las ${hora}</b>. ${TEXTOS.confirmacion}</p>
    <p><b>${CONTACTO.sala}</b><br>${CONTACTO.direccion}, ${CONTACTO.ciudad}<br>
    <a href="${CONTACTO.mapa}">Ver en Google Maps</a></p>
    <p>Adjuntamos la visita para tu calendario.</p>
    <p>¿Cambio de planes? <a href="${enlaceGestion}">Cancela tu visita o borra tus datos</a>.</p>
    <p style="color:#666;font-size:13px">${CORPORATIVO.nombre} · ${CONTACTO.telefono}</p>
  `,
});

/** Aviso a la sala cuando la persona cancela o borra sus datos desde el correo. */
export const correoCancelacion = ({ fecha, hora, borrado }) => ({
  asunto: `Visita cancelada · ${fecha} ${hora}`,
  html: `
    <p>Se canceló la visita del <b>${fecha} a las ${hora}</b> desde el enlace del correo de confirmación. El bloque quedó libre en la agenda.</p>
    ${borrado ? '<p>La persona pidió además borrar sus datos: la solicitud ya no está en la base.</p>' : ''}
  `,
});
