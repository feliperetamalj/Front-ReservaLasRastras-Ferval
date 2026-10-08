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
