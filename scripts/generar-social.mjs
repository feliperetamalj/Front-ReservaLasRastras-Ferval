/**
 * Genera el favicon PNG, el ícono de iOS y la imagen Open Graph.
 *
 * La imagen OG compone el logotipo real del proyecto sobre la fotografía del
 * portal de acceso. No se dibuja texto con `sharp`: no aplica el @font-face
 * embebido en un SVG y el resultado sale en la tipografía del sistema, que
 * arruina la identidad. El logotipo encima la resuelve mejor.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const FONDO = 'src/assets/proyecto/portal.webp';
const LOGO = 'src/assets/brand/logo-reserva.svg';

// --- Favicon e ícono de iOS, desde el isotipo -----------------------------
const favicon = await readFile('public/favicon.svg');
for (const [tamano, salida] of [
  [180, 'public/apple-touch-icon.png'],
  [512, 'public/icon-512.png'],
]) {
  await sharp(favicon, { density: 400 }).resize(tamano, tamano).png().toFile(salida);
}

// --- Imagen Open Graph ----------------------------------------------------
const ANCHO = 1200;
const ALTO = 630;

const fondo = await sharp(FONDO)
  .resize(ANCHO, ALTO, { fit: 'cover', position: 'attention' })
  .toBuffer();

// Velo para que el logotipo claro despegue de la fotografía.
const velo = Buffer.from(
  `<svg width="${ANCHO}" height="${ALTO}">
     <defs>
       <linearGradient id="v" x1="0" y1="1" x2="0" y2="0">
         <stop offset="0" stop-color="#140c08" stop-opacity="0.92"/>
         <stop offset="0.55" stop-color="#140c08" stop-opacity="0.55"/>
         <stop offset="1" stop-color="#140c08" stop-opacity="0.22"/>
       </linearGradient>
     </defs>
     <rect width="${ANCHO}" height="${ALTO}" fill="url(#v)"/>
     <rect x="0" y="${ALTO - 8}" width="${ANCHO}" height="8" fill="#c7a626"/>
   </svg>`,
);

/*
  Para el fondo oscuro se recolorean las clases del propio SVG, no se invierte
  la imagen: `negate` convierte el dorado en azul, que es su complementario, y
  se pierde la marca. Recolorear es exacto.

  cls-1 es el texto "RESERVA LAS RASTRAS" (#434040, ilegible sobre tinta),
  cls-2 es "Barrio Residencial" y cls-5 es el anillo oscuro del isotipo.
*/
const svgOriginal = await readFile(LOGO, 'utf8');
const svgClaro = svgOriginal
  .replace('.cls-1{fill:#434040;}', '.cls-1{fill:#ffffff;}')
  .replace('.cls-2{fill:#a78f2d;}', '.cls-2{fill:#c7a626;}')
  .replace('.cls-5{fill:#1e120d;}', '.cls-5{fill:#f6d85d;}');

const logo = await sharp(Buffer.from(svgClaro), { density: 300 })
  .resize({ width: 620 })
  .png()
  .toBuffer();

const { height: altoLogo } = await sharp(logo).metadata();

await sharp(fondo)
  .composite([
    { input: velo, top: 0, left: 0 },
    { input: logo, top: Math.round((ALTO - altoLogo) / 2), left: 78 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('favicon.svg · apple-touch-icon.png · icon-512.png · og-image.jpg');
