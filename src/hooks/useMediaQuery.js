import { useEffect, useState } from 'react';

/**
 * Suscribe a una media query y devuelve si se cumple.
 *
 * Parte en `false` y lee la consulta al montar: el prerender no tiene
 * pantalla, y si el primer render del navegador diera otra cosa, la
 * hidratación no calzaría.
 */
export function useMediaQuery(consulta) {
  const [coincide, setCoincide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const alCambiar = (e) => setCoincide(e.matches);
    setCoincide(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, [consulta]);

  return coincide;
}

export const useMovimientoReducido = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
