import { Anillos, Contenedor } from '../components/ui';
import s from './Encabezado.module.css';

/** Encabezado común de las páginas interiores. */
export function Encabezado({ versalita, titulo, bajada, children }) {
  return (
    <header className={s.encabezado}>
      <Anillos variante="claro" className={s.marcaAgua} />
      <Contenedor>
        <div className={s.texto}>
          {versalita && <p className={`versalita ${s.versalita}`}>{versalita}</p>}
          <h1 className={s.titulo}>{titulo}</h1>
          {bajada && <p className={s.bajada}>{bajada}</p>}
          {children}
        </div>
      </Contenedor>
    </header>
  );
}
