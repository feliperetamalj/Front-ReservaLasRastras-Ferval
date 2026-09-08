import { useCallback, useEffect, useState } from 'react';
import { Icono } from '../ui';
import { useBloqueoScroll } from '../../hooks';
import s from './Galeria.module.css';

/** Galería en rejilla con visor a pantalla completa, navegable y cíclico. */
export function Galeria({ imagenes, columnas = 3 }) {
  const [indice, setIndice] = useState(null);
  const abierto = indice !== null;

  useBloqueoScroll(abierto);

  const cerrar = useCallback(() => setIndice(null), []);
  const mover = useCallback(
    (paso) => setIndice((i) => (i === null ? null : (i + paso + imagenes.length) % imagenes.length)),
    [imagenes.length],
  );

  useEffect(() => {
    if (!abierto) return undefined;
    const alPresionar = (e) => {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto, cerrar, mover]);

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

      {abierto && (
        <div
          className={`${s.visor} enOscuro`}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
        >
          {/* Clic en el fondo cierra; el contenido detiene la propagación. */}
          <button type="button" className={s.fondo} onClick={cerrar} aria-label="Cerrar visor" />

          <img
            src={imagenes[indice].src}
            alt={imagenes[indice].alt}
            className={s.fotoGrande}
            decoding="async"
          />

          <button type="button" className={`${s.control} ${s.cerrar}`} onClick={cerrar} aria-label="Cerrar">
            <Icono nombre="cerrar" tamano={22} />
          </button>

          {imagenes.length > 1 && (
            <>
              <button
                type="button"
                className={`${s.control} ${s.anterior}`}
                onClick={() => mover(-1)}
                aria-label="Imagen anterior"
              >
                <Icono nombre="flechaIzq" tamano={22} />
              </button>
              <button
                type="button"
                className={`${s.control} ${s.siguiente}`}
                onClick={() => mover(1)}
                aria-label="Imagen siguiente"
              >
                <Icono nombre="flecha" tamano={22} />
              </button>
              <p className={`${s.contador} tabular`}>
                {indice + 1} / {imagenes.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
