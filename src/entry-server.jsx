/**
 * Entrada para el prerender: cada ruta se renderiza a HTML en la compilación
 * (scripts/prerender.mjs) y el navegador la hidrata con main.jsx. Así Google,
 * WhatsApp y Facebook reciben el contenido real y no un <div> vacío.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

export { RUTAS, RUTAS_INDEXABLES, cabeza, DATOS_ESTRUCTURADOS, SITIO_URL } from './data/seo';

export const render = (url) =>
  renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
