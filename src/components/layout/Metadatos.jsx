import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cabeza } from '../../data/seo';

/** Busca la etiqueta del <head>; si no está (en desarrollo no hay prerender), la crea. */
function etiqueta(selector, crear) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(crear.tag);
    Object.entries(crear.atributos).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

const meta = (atributo, nombre, valor) =>
  etiqueta(`meta[${atributo}="${nombre}"]`, { tag: 'meta', atributos: { [atributo]: nombre } }).setAttribute(
    'content',
    valor,
  );

/**
 * Mantiene el <head> al día al navegar dentro del sitio. La primera carga ya
 * llega con el <head> correcto desde el prerender; esto cubre los cambios de
 * ruta sin recargar, para la pestaña, el historial y quien comparta la URL.
 */
export function Metadatos() {
  const { pathname } = useLocation();

  useEffect(() => {
    const c = cabeza(pathname);
    document.title = c.titulo;
    meta('name', 'description', c.descripcion);
    meta('name', 'robots', c.indexar ? 'index, follow' : 'noindex');
    meta('property', 'og:title', c.titulo);
    meta('property', 'og:description', c.descripcion);
    meta('property', 'og:image', c.imagen);
    if (c.canonical) {
      etiqueta('link[rel="canonical"]', { tag: 'link', atributos: { rel: 'canonical' } }).setAttribute('href', c.canonical);
      meta('property', 'og:url', c.canonical);
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
    }
  }, [pathname]);

  return null;
}
