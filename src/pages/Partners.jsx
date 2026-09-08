import { Contenedor, Icono, Reveal, Seccion } from '../components/ui';
import { BloqueContacto } from '../components/sections';
import { Encabezado } from './Encabezado';
import { PARTNERS } from '../data/partners';
import { CONTACTO } from '../data/proyecto';
import s from './Partners.module.css';

export function Partners() {
  return (
    <>
      <Encabezado
        versalita="Partners"
        titulo="Quiénes construyen aquí"
        bajada="Arquitectos y constructoras con obra ejecutada dentro del barrio, que conocen la normativa interna del loteo y sus estándares de terminación."
      />

      {PARTNERS.map((grupo, i) => (
        <Seccion
          key={grupo.categoria}
          fondo={i % 2 === 0 ? 'papel' : 'alterno'}
          versalita={grupo.categoria}
          titulo={grupo.categoria === 'Arquitectura' ? 'Proyecto' : 'Proyecto y obra'}
          bajada={grupo.descripcion}
        >
          <ul className={s.grilla}>
            {grupo.estudios.map((e, j) => (
              <Reveal como="li" key={e.nombre} retraso={j * 60} className={s.tarjeta}>
                <h3 className={s.nombre}>{e.nombre}</h3>
                <p className={s.rol}>{e.rol}</p>

                {e.contacto && (
                  <p className={s.contacto}>
                    <span className={s.rotulo}>Contacto</span>
                    {e.contacto}
                  </p>
                )}

                {(e.sitio || e.email) && (
                  <div className={s.enlaces}>
                    {e.sitio && (
                      <a
                        href={e.sitio}
                        className={s.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icono nombre="flecha" tamano={15} />
                        {e.sitioTexto}
                      </a>
                    )}
                    {e.email && (
                      <a href={`mailto:${e.email}`} className={s.enlace}>
                        <Icono nombre="correo" tamano={15} />
                        {e.email}
                      </a>
                    )}
                  </div>
                )}
              </Reveal>
            ))}
          </ul>
        </Seccion>
      ))}

      <Seccion fondo="blanco" compacta>
        <Contenedor ancho="texto" className={s.aviso}>
          <Icono nombre="telefono" tamano={24} className={s.iconoAviso} />
          <h2 className={s.avisoTitulo}>¿Necesitas el contacto directo?</h2>
          <p className={s.avisoTexto}>
            Los teléfonos particulares de cada profesional los entrega la sala de ventas. Escríbenos
            a <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a> o llama al{' '}
            <a href={`tel:${CONTACTO.telefonoLink}`} className="tabular">
              {CONTACTO.telefono}
            </a>{' '}
            y te ponemos en contacto.
          </p>
        </Contenedor>
      </Seccion>

      <BloqueContacto
        interes="construir en Reserva Las Rastras"
        titulo="¿Vas a construir en el barrio?"
        bajada="Te enviamos la normativa interna del loteo y te ponemos en contacto con los partners que trabajan aquí."
      />
    </>
  );
}
