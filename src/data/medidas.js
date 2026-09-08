/**
 * Medidas intrínsecas de cada imagen, en píxeles.
 *
 * Generado por scripts/preparar-imagenes.mjs — no editar a mano.
 * Sirve para que cada <img> declare width y height y el navegador reserve el
 * espacio antes de descargar el archivo.
 */

export const MEDIDAS = {
  'modelos/colonial-150/g1': [1280, 800],
  'modelos/colonial-150/g2': [1280, 800],
  'modelos/colonial-150/g3': [1280, 800],
  'modelos/colonial-150/g4': [1280, 800],
  'modelos/colonial-150/g5': [1280, 800],
  'modelos/colonial-150/g6': [1280, 800],
  'modelos/colonial-150/hero': [1920, 1080],
  'modelos/colonial-150/planta': [1500, 570],
  'modelos/colonial-192/g1': [1280, 800],
  'modelos/colonial-192/g2': [1280, 800],
  'modelos/colonial-192/g3': [1280, 800],
  'modelos/colonial-192/g4': [1280, 800],
  'modelos/colonial-192/g5': [1280, 800],
  'modelos/colonial-192/g6': [1280, 800],
  'modelos/colonial-192/hero': [1920, 1080],
  'modelos/colonial-192/planta': [1500, 749],
  'modelos/colonial-192/planta-2': [1500, 1286],
  'modelos/mediterranea-179-1piso/g1': [1600, 900],
  'modelos/mediterranea-179-1piso/g2': [1600, 900],
  'modelos/mediterranea-179-1piso/g3': [1600, 900],
  'modelos/mediterranea-179-1piso/hero': [1920, 1080],
  'modelos/mediterranea-179-1piso/planta': [945, 915],
  'modelos/mediterranea-179/g1': [1600, 900],
  'modelos/mediterranea-179/g2': [1600, 900],
  'modelos/mediterranea-179/g3': [1600, 900],
  'modelos/mediterranea-179/g4': [1600, 900],
  'modelos/mediterranea-179/hero': [1920, 1080],
  'modelos/mediterranea-179/planta': [1467, 886],
  'modelos/mediterranea-182/g1': [1600, 900],
  'modelos/mediterranea-182/g2': [1600, 900],
  'modelos/mediterranea-182/g3': [1600, 900],
  'modelos/mediterranea-182/hero': [1920, 1080],
  'modelos/mediterranea-182/planta': [876, 862],
  'modelos/mediterranea-310/g1': [1600, 900],
  'modelos/mediterranea-310/g2': [1600, 900],
  'modelos/mediterranea-310/g3': [1600, 900],
  'modelos/mediterranea-310/hero': [1920, 1080],
  'modelos/mediterranea-310/planta': [1026, 876],
  'proyecto/areas-verdes': [1600, 900],
  'proyecto/avenida': [1600, 900],
  'proyecto/calle': [1600, 900],
  'proyecto/elevacion': [1600, 982],
  'proyecto/emplazamiento': [1600, 1014],
  'proyecto/master-plan': [1600, 4590],
  'proyecto/plaza': [1600, 900],
  'proyecto/portal': [1920, 1080],
};

export const medida = (clave) => MEDIDAS[clave] ?? [];
