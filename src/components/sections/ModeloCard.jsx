import { Link } from 'react-router-dom';
import { Etiqueta, Icono } from '../ui';
import { m2, uf } from '../../utils/formato';
import s from './ModeloCard.module.css';

/**
 * Tarjeta de un modelo de casa. Toda la superficie es el enlace.
 *
 * `nivel` existe porque la misma tarjeta se usa bajo un h2 de sección (donde
 * su título es h3) y directamente bajo el h1 de la página de modelos (donde
 * tiene que ser h2). Fijarlo en h3 dejaba un salto 1→3 en esa página.
 */
export function ModeloCard({ modelo, prioridad = false, nivel = 3 }) {
  const Titulo = `h${nivel}`;
  return (
    <article className={s.tarjeta}>
      <div className={s.marco}>
        <img
          src={modelo.hero}
          srcSet={modelo.heroSrcSet}
          sizes="(min-width: 1020px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={`Fachada del modelo ${modelo.nombre}`}
          className={s.foto}
          loading={prioridad ? 'eager' : 'lazy'}
          decoding="async"
          width="1200"
          height="675"
        />
        <Etiqueta tono="oscuro" className={s.estilo}>
          {modelo.estilo}
        </Etiqueta>
      </div>

      <div className={s.cuerpo}>
        <Titulo className={s.nombre}>
          {/* El enlace se estira sobre toda la tarjeta, pero el nombre sigue
              siendo el texto accesible del enlace. */}
          <Link to={`/modelos/${modelo.slug}`} className={s.enlace}>
            {modelo.nombre}
          </Link>
        </Titulo>

        <p className={s.resumen}>{modelo.resumen}</p>

        <ul className={s.specs}>
          <li className={s.spec}>
            <Icono nombre="superficie" tamano={17} className={s.iconoSpec} />
            <span className="tabular">{m2(modelo.m2)}</span>
          </li>
          <li className={s.spec}>
            <Icono nombre="cama" tamano={17} className={s.iconoSpec} />
            <span className="tabular">{modelo.dormitorios}</span>
            <span className={s.rotuloSpec}>dorm.</span>
          </li>
          <li className={s.spec}>
            <Icono nombre="bano" tamano={17} className={s.iconoSpec} />
            <span className="tabular">{modelo.banos}</span>
            <span className={s.rotuloSpec}>baños</span>
          </li>
          <li className={s.spec}>
            <Icono nombre="niveles" tamano={17} className={s.iconoSpec} />
            <span className="tabular">{modelo.pisos}</span>
            <span className={s.rotuloSpec}>{modelo.pisos === 1 ? 'piso' : 'pisos'}</span>
          </li>
        </ul>

        <div className={s.pie}>
          <p className={`${s.precio} tabular`}>{uf(modelo.uf)}</p>
          <span className={s.ver} aria-hidden="true">
            Ver ficha
            <Icono nombre="flecha" tamano={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
