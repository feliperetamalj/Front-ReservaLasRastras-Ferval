/**
 * El formulario no tiene backend: compone el mensaje y lo entrega a WhatsApp
 * o al cliente de correo. Sin servidor, sin costo y sin datos personales
 * viajando a un tercero.
 */
import { CONTACTO, PROYECTO } from '../data/proyecto';

/** Arma el texto que se envía, con el contexto de dónde salió la consulta. */
export function componerMensaje({ nombre, telefono, email, interes, mensaje }) {
  const lineas = [
    `Hola, me interesa ${interes || PROYECTO.nombre}.`,
    '',
    nombre && `Nombre: ${nombre}`,
    telefono && `Teléfono: ${telefono}`,
    email && `Correo: ${email}`,
    mensaje && '',
    mensaje && mensaje,
  ];
  return lineas.filter(Boolean).join('\n');
}

export const enlaceWhatsApp = (texto) =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

export const enlaceCorreo = (texto, asunto) =>
  `mailto:${CONTACTO.email}?subject=${encodeURIComponent(
    asunto || `Consulta · ${PROYECTO.nombre}`,
  )}&body=${encodeURIComponent(texto)}`;

/** Consulta rápida sin pasar por el formulario. */
export const whatsAppDirecto = (interes) =>
  enlaceWhatsApp(
    `Hola, me interesa ${interes || PROYECTO.nombre} y quisiera más información.`,
  );
