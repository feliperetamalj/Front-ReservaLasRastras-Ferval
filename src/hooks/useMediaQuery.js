import { useEffect, useState } from 'react';

/** Suscribe a una media query y devuelve si se cumple. */
export function useMediaQuery(consulta) {
  const [coincide, setCoincide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches,
  );

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
