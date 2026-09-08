import { Contenedor, Icono } from '../ui';
import { Formulario } from './Formulario';
import { CONTACTO, HORARIO } from '../../data/proyecto';
import s from './BloqueContacto.module.css';

/** Cierre de página: formulario a la izquierda, datos de la sala a la derecha. */
export function BloqueContacto({
  id = 'contacto',
  interes,
  titulo = 'Conversemos sobre tu casa',
  bajada = 'Déjanos tus datos y una ejecutiva te contacta. O escríbenos directo por WhatsApp, que suele ser más rápido.',
}) {
  return (
    <section id={id} className={`${s.bloque} enOscuro`}>
      <Contenedor>
        <div className={s.grilla}>
          <div className={s.columnaForm}>
            <p className={`versalita ${s.versalita}`}>Contacto</p>
            <h2 className={s.titulo}>{titulo}</h2>
            <p className={s.bajada}>{bajada}</p>
            <Formulario interes={interes} tono="oscuro" />
          </div>

          <aside className={s.columnaDatos}>
            <h3 className={`versalita ${s.tituloAside}`}>Sala de ventas</h3>

            <ul className={s.datos}>
              <li className={s.dato}>
                <Icono nombre="pin" tamano={20} className={s.icono} />
                <span>
                  {CONTACTO.direccion}
                  <br />
                  {CONTACTO.ciudad}
                </span>
              </li>
              <li className={s.dato}>
                <Icono nombre="telefono" tamano={20} className={s.icono} />
                <a href={`tel:${CONTACTO.telefonoLink}`} className={`${s.enlace} tabular`}>
                  {CONTACTO.telefono}
                </a>
              </li>
              <li className={s.dato}>
                <Icono nombre="correo" tamano={20} className={s.icono} />
                <a href={`mailto:${CONTACTO.email}`} className={s.enlace}>
                  {CONTACTO.email}
                </a>
              </li>
            </ul>

            <h3 className={`versalita ${s.tituloAside}`}>
              <Icono nombre="reloj" tamano={16} className={s.iconoReloj} />
              Horario de atención
            </h3>
            <ul className={s.horario}>
              {HORARIO.map((h) => (
                <li key={h.dias} className={s.fila}>
                  <span>{h.dias}</span>
                  <span className={`${s.horas} tabular`}>{h.horas}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Contenedor>
    </section>
  );
}
