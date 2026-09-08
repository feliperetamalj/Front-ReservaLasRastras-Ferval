import { useEffect } from 'react';

/**
 * Bloquea el desplazamiento del fondo mientras hay un panel abierto,
 * compensando el ancho de la barra para que la página no salte.
 */
export function useBloqueoScroll(activo) {
  useEffect(() => {
    if (!activo) return undefined;

    const { body } = document;
    const anchoBarra = window.innerWidth - document.documentElement.clientWidth;
    const overflowPrevio = body.style.overflow;
    const paddingPrevio = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (anchoBarra > 0) body.style.paddingRight = `${anchoBarra}px`;

    return () => {
      body.style.overflow = overflowPrevio;
      body.style.paddingRight = paddingPrevio;
    };
  }, [activo]);
}
