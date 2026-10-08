import { Icono } from '../ui';
import { CONTACTO } from '../../data/proyecto';
import { whatsAppDirecto } from '../../utils/contacto';
import s from './WhatsAppFlotante.module.css';

/** Acceso directo al WhatsApp de la sala de ventas, siempre a mano. */
export function WhatsAppFlotante() {
  return (
    <a
      href={whatsAppDirecto()}
      className={s.flotante}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp a la sala de ventas, ${CONTACTO.telefono}`}
    >
      <Icono nombre="whatsapp" tamano={28} />
    </a>
  );
}
