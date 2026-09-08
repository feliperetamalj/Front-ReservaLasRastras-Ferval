import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router conserva la posición al cambiar de ruta, así que una ficha se
 * abriría a media altura. Esto lo corrige sin renderizar nada, respetando el
 * ancla cuando la URL trae una.
 */
export function IrArriba() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
