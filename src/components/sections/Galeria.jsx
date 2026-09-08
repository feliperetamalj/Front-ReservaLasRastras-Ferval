import { useState } from 'react';
import { Icono } from '../ui';
import { Visor } from './Visor';
import s from './Galeria.module.css';

/** Galería en rejilla. Al pulsar una miniatura se abre el visor compartido. */
export function Galeria({ imagenes, columnas = 3 }) {
  const [indice, setIndice] = useState(null);

  if (!imagenes?.length) return null;

  return (
    <>
      <ul className={s.grilla} data-columnas={columnas}>
        {imagenes.map((img, i) => (
          <li key={img.src} className={s.celda}>
            <button
              type="button"
              className={s.disparador}
              onClick={() => setIndice(i)}
              aria-label={`Ampliar: ${img.alt}`}
            >
              <img
                src={img.src}
                srcSet={img.srcSet}
                sizes="(min-width: 1020px) 33vw, (min-width: 640px) 50vw, 100vw"
                alt={img.alt}
                className={s.foto}
                loading="lazy"
                decoding="async"
              />
              <span className={s.lupa} aria-hidden="true">
                <Icono nombre="expandir" tamano={18} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Visor
        imagenes={imagenes}
        indice={indice}
        alCambiar={setIndice}
        alCerrar={() => setIndice(null)}
      />
    </>
  );
}
