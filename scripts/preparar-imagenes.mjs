/**
 * Convierte el material descargado del sitio original a WebP, en los tamaños
 * en que efectivamente se pinta cada imagen.
 *
 * Los archivos de origen conservan la ruta de WordPress en el nombre
 * (2024/06/179-galeria.jpg -> 2024_06_179-galeria.jpg) porque en uploads es
 * habitual que dos meses distintos tengan un "01.jpg" que no es la misma foto.
 *
 *   node scripts/preparar-imagenes.mjs <carpeta-con-los-originales>
 */
import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ORIGEN = process.argv[2];
if (!ORIGEN) {
  console.error('Falta la carpeta de origen.');
  process.exit(1);
}

const DESTINO = path.resolve('src/assets');

/** Ancho en que se pinta cada rol, más la variante para pantallas angostas. */
const ANCHOS = {
  hero: [1920, 1200, 760],
  tarjeta: [1200, 640],
  galeria: [1600, 900],
  planta: [1500],
  plano: [1600],
};

/** origen -> [carpeta/nombre destino, rol] */
const MAPA = [
  // --- Proyecto -----------------------------------------------------------
  ['2022_05_P2.png', 'proyecto/portal', 'hero'],
  ['2022_05_P1.png', 'proyecto/avenida', 'galeria'],
  ['2022_05_P3.png', 'proyecto/areas-verdes', 'galeria'],
  ['2022_05_P4-1.png', 'proyecto/plaza', 'galeria'],
  ['2023_01_FINAL1.png', 'proyecto/calle', 'galeria'],
  ['2023_01_EMPLAZAMIENTO.jpg', 'proyecto/emplazamiento', 'plano'],
  ['2026_07_loteo-agosto2026.jpg', 'proyecto/master-plan', 'plano'],
  ['2024_06_ELEVACION-A.png', 'proyecto/elevacion', 'galeria'],

  // --- Colonial 150 -------------------------------------------------------
  ['2026_06_150horizontal-1.jpg', 'modelos/colonial-150/hero', 'hero'],
  ['2021_10_01.jpg', 'modelos/colonial-150/g1', 'galeria'],
  ['2021_10_04.jpg', 'modelos/colonial-150/g2', 'galeria'],
  ['2021_10_07.jpg', 'modelos/colonial-150/g3', 'galeria'],
  ['2021_10_12.jpg', 'modelos/colonial-150/g4', 'galeria'],
  ['2021_10_17.jpg', 'modelos/colonial-150/g5', 'galeria'],
  ['2021_10_20.jpg', 'modelos/colonial-150/g6', 'galeria'],
  ['2021_10_PLANTA-150_01.png', 'modelos/colonial-150/planta', 'planta'],

  // --- Colonial 192 -------------------------------------------------------
  ['2026_06_192horizontal.jpg', 'modelos/colonial-192/hero', 'hero'],
  ['2021_10_01-1.jpg', 'modelos/colonial-192/g1', 'galeria'],
  ['2021_10_04-1.jpg', 'modelos/colonial-192/g2', 'galeria'],
  ['2021_10_07-1.jpg', 'modelos/colonial-192/g3', 'galeria'],
  ['2021_10_09-1.jpg', 'modelos/colonial-192/g4', 'galeria'],
  ['2021_10_11-1.jpg', 'modelos/colonial-192/g5', 'galeria'],
  ['2021_10_12-1.jpg', 'modelos/colonial-192/g6', 'galeria'],
  ['2021_10_PLANTA1_01.png', 'modelos/colonial-192/planta', 'planta'],
  ['2021_10_PLANTA2.png', 'modelos/colonial-192/planta-2', 'planta'],

  // --- Mediterránea 310 ---------------------------------------------------
  ['2026_06_310horizontal.jpg', 'modelos/mediterranea-310/hero', 'hero'],
  ['2024_06_283-galeria1.jpg', 'modelos/mediterranea-310/g1', 'galeria'],
  ['2024_06_283-galeria2.jpg', 'modelos/mediterranea-310/g2', 'galeria'],
  ['2024_06_283-galeria3.jpg', 'modelos/mediterranea-310/g3', 'galeria'],
  ['2024_06_planta283.jpg', 'modelos/mediterranea-310/planta', 'planta'],

  // --- Mediterránea 182 ---------------------------------------------------
  ['2025_03_horizontal-164m2.jpg', 'modelos/mediterranea-182/hero', 'hero'],
  ['2025_02_164-galeria.jpg', 'modelos/mediterranea-182/g1', 'galeria'],
  ['2025_02_164-galeria2.jpg', 'modelos/mediterranea-182/g2', 'galeria'],
  ['2025_02_164-galeria3.jpg', 'modelos/mediterranea-182/g3', 'galeria'],
  ['2024_06_1920x1080-planta164.jpg', 'modelos/mediterranea-182/planta', 'planta'],

  // --- Mediterránea 179 · 2 pisos ----------------------------------------
  ['2026_06_179-2pisos-horizontal.jpg', 'modelos/mediterranea-179/hero', 'hero'],
  ['2024_06_179-galeria.jpg', 'modelos/mediterranea-179/g1', 'galeria'],
  ['2024_06_179-galeria2.jpg', 'modelos/mediterranea-179/g2', 'galeria'],
  ['2024_06_179-galeria3.jpg', 'modelos/mediterranea-179/g3', 'galeria'],
  ['2024_06_179-galeria4.jpg', 'modelos/mediterranea-179/g4', 'galeria'],
  ['2024_06_1920x1080-planta179.jpg', 'modelos/mediterranea-179/planta', 'planta'],

  // --- Mediterránea 179 · 1 piso -----------------------------------------
  ['2026_06_179-1piso-horizontal-2.jpg', 'modelos/mediterranea-179-1piso/hero', 'hero'],
  ['2024_06_FRONT.jpg', 'modelos/mediterranea-179-1piso/g1', 'galeria'],
  ['2024_06_FINAL3.jpg', 'modelos/mediterranea-179-1piso/g2', 'galeria'],
  ['2024_06_1920x1080-159.jpg', 'modelos/mediterranea-179-1piso/g3', 'galeria'],
  ['2024_06_1920x1080-planta59.jpg', 'modelos/mediterranea-179-1piso/planta', 'planta'],
];

let hechos = 0;
let pesoOrigen = 0;
let pesoDestino = 0;
const faltantes = [];
/* Medidas intrínsecas del archivo principal de cada imagen. Se emiten a un
   módulo para que los componentes reserven la proporción y el navegador no
   desplace el contenido al cargar (CLS). */
const medidas = {};

for (const [archivo, destinoRel, rol] of MAPA) {
  const entrada = path.join(ORIGEN, archivo);
  if (!existsSync(entrada)) {
    faltantes.push(archivo);
    continue;
  }

  const salidaBase = path.join(DESTINO, destinoRel);
  await mkdir(path.dirname(salidaBase), { recursive: true });

  const original = sharp(entrada);
  const { width: anchoReal } = await original.metadata();
  pesoOrigen += (await original.stats(), (await import('node:fs')).statSync(entrada).size);

  for (const ancho of ANCHOS[rol]) {
    // No agrandamos: si el original es más chico, se usa tal cual.
    const objetivo = Math.min(ancho, anchoReal);
    const esPrincipal = ancho === ANCHOS[rol][0];
    const salida = esPrincipal ? `${salidaBase}.webp` : `${salidaBase}-${ancho}.webp`;

    await sharp(entrada)
      .resize({ width: objetivo, withoutEnlargement: true })
      .webp({ quality: rol === 'planta' || rol === 'plano' ? 88 : 80 })
      .toFile(salida);

    pesoDestino += (await import('node:fs')).statSync(salida).size;
    if (esPrincipal) {
      const meta = await sharp(salida).metadata();
      medidas[destinoRel] = [meta.width, meta.height];
    }
    hechos += 1;
  }
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`${hechos} archivos WebP generados desde ${MAPA.length} originales.`);
console.log(`Origen ${mb(pesoOrigen)} MB  ->  destino ${mb(pesoDestino)} MB`);
if (faltantes.length) {
  console.log(`\nNo se encontraron ${faltantes.length}:`);
  for (const f of faltantes) console.log('  ', f);
}

const carpetas = await readdir(DESTINO, { recursive: true });
console.log(`\n${carpetas.filter((f) => f.endsWith('.webp')).length} .webp en src/assets`);

// --- Módulo de medidas ----------------------------------------------------
const filas = Object.keys(medidas)
  .sort()
  .map((k) => `  '${k}': [${medidas[k].join(', ')}],`)
  .join('\n');

await writeFile(
  'src/data/medidas.js',
  `/**
 * Medidas intrínsecas de cada imagen, en píxeles.
 *
 * Generado por scripts/preparar-imagenes.mjs — no editar a mano.
 * Sirve para que cada <img> declare width y height y el navegador reserve el
 * espacio antes de descargar el archivo.
 */

export const MEDIDAS = {
${filas}
};

export const medida = (clave) => MEDIDAS[clave] ?? [];
`,
);
console.log(`medidas de ${Object.keys(medidas).length} imágenes en src/data/medidas.js`);
