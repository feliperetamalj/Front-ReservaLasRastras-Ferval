import { useCallback, useEffect } from 'react';
import { Icono } from '../ui';
import { useBloqueoScroll } from '../../hooks';
import s from './Visor.module.css';

/**
 * Visor a pantalla completa, compartido por la rejilla y el carrusel.
 *
 * Navega en ciclo, cierra con Escape y bloquea el desplazamiento del fondo
 * mientras está abierto.
 */
export function Visor({ imagenes, indice, alCambiar, alCerrar }) {
  useBloqueoScroll(indice !== null);

  const mover = useCallback(
    (paso) => alCambiar((indice + paso + imagenes.length) % imagenes.length),
    [alCambiar, indice, imagenes.length],
  );

  useEffect(() => {
    if (indice === null) return undefined;
    const alPresionar = (e) => {
      if (e.key === 'Escape') alCerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [indice, alCerrar, mover]);

  if (indice === null) return null;

  return (
    <div className={`${s.visor} enOscuro`} role="dialog" aria-modal="true" aria-label="Visor de imágenes">
      {/* Clic en el fondo cierra. */}
      <button type="button" className={s.fondo} onClick={alCerrar} aria-label="Cerrar visor" />

      <img
        src={imagenes[indice].src}
        alt={imagenes[indice].alt}
        className={s.foto}
        decoding="async"
      />

      <button type="button" className={`${s.control} ${s.cerrar}`} onClick={alCerrar} aria-label="Cerrar">
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
  );
}
