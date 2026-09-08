import { Contenedor } from './Contenedor';
import { Reveal } from './Reveal';
import s from './Seccion.module.css';

/**
 * Bloque de página con su ritmo vertical, su fondo y su encabezado.
 * El encabezado siempre trae una versalita, que es el recurso tipográfico
 * heredado del "Barrio Residencial" espaciado del logotipo.
 */
export function Seccion({
  id,
  versalita,
  titulo,
  bajada,
  fondo = 'papel',
  ancho = 'normal',
  compacta = false,
  cabeceraCentrada = false,
  acciones,
  children,
  className = '',
}) {
  const tieneCabecera = versalita || titulo || bajada;

  return (
    <section
      id={id}
      className={`${s.seccion} ${s[fondo]} ${compacta ? s.compacta : ''} ${
        fondo === 'tinta' ? 'enOscuro' : ''
      } ${className}`}
    >
      <Contenedor ancho={ancho}>
        {tieneCabecera && (
          <Reveal className={`${s.cabecera} ${cabeceraCentrada ? s.centrada : ''}`}>
            <div className={s.cabeceraTexto}>
              {versalita && <p className={`versalita ${s.versalita}`}>{versalita}</p>}
              {titulo && <h2 className={s.titulo}>{titulo}</h2>}
              {bajada && <p className={s.bajada}>{bajada}</p>}
            </div>
            {acciones && <div className={s.acciones}>{acciones}</div>}
          </Reveal>
        )}
        {children}
      </Contenedor>
    </section>
  );
}
