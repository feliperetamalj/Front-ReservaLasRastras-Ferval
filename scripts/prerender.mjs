/**
 * Prerender: escribe un HTML por ruta con el contenido real y su propio
 * <head>, más la página 404 y el sitemap. Corre después de las dos
 * compilaciones de Vite (la del navegador en dist/ y la de servidor en
 * dist-server/); lo llama `npm run build`.
 *
 * dist/master-plan.html se sirve en /master-plan gracias a `cleanUrls` de
 * vercel.json, y dist/404.html es la respuesta 404 real de Vercel.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');
const servidor = join(raiz, 'dist-server');

const { render, RUTAS, RUTAS_INDEXABLES, cabeza, DATOS_ESTRUCTURADOS, SITIO_URL } = await import(
  pathToFileURL(join(servidor, 'entry-server.js')).href
);

const plantilla = readFileSync(join(dist, 'index.html'), 'utf8');
for (const marca of ['<title>', '<!--cabeza-->', '<div id="root"></div>']) {
  if (!plantilla.includes(marca)) throw new Error(`La plantilla dist/index.html ya no trae ${marca}`);
}

const atributo = (t) =>
  t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function pagina(ruta) {
  const c = cabeza(ruta);
  const etiquetas = [
    `<meta name="description" content="${atributo(c.descripcion)}" />`,
    !c.indexar && '<meta name="robots" content="noindex" />',
    c.canonical && `<link rel="canonical" href="${c.canonical}" />`,
    c.canonical && `<meta property="og:url" content="${c.canonical}" />`,
    `<meta property="og:title" content="${atributo(c.titulo)}" />`,
    `<meta property="og:description" content="${atributo(c.descripcion)}" />`,
    `<meta property="og:image" content="${c.imagen}" />`,
    ruta === '/' &&
      `<script type="application/ld+json">${JSON.stringify(DATOS_ESTRUCTURADOS).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ');

  return plantilla
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${atributo(c.titulo)}</title>`)
    .replace('<!--cabeza-->', etiquetas)
    .replace('<div id="root"></div>', `<div id="root">${render(ruta)}</div>`);
}

const escribir = (archivo, contenido) => {
  const destino = join(dist, archivo);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, contenido);
};

for (const ruta of RUTAS) escribir(ruta === '/' ? 'index.html' : `${ruta.slice(1)}.html`, pagina(ruta));
// Cualquier ruta que no existe cae en la página "no encontrada".
escribir('404.html', pagina('/404'));

escribir(
  'sitemap.xml',
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...RUTAS_INDEXABLES.map((r) => `  <url><loc>${SITIO_URL}${r}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n'),
);

rmSync(servidor, { recursive: true, force: true });
console.log(`Prerender: ${RUTAS.length} rutas, 404 y sitemap con ${RUTAS_INDEXABLES.length} URLs.`);
