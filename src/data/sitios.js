/**
 * Los sitios del loteo: superficie, estado y posición en el plano.
 *
 * Estados: tabla de reservalasrastras.cl/master-plan.html publicada el
 * 2026-10-07 (el sitio nuevo de Ferval). Superficies y posiciones: el plano
 * interactivo del sitio anterior, leído el 2026-09-24.
 *
 * Criterios de la actualización de octubre (acordados con Felipe):
 * - Los estados son los del listado de octubre.
 * - Donde las superficies difieren en más de 1 m² se mantiene la anterior y
 *   la del listado queda en `nota`, hasta que la sala de ventas confirme. El
 *   sector D del listado parece corrido una fila (D22–D24 traen las
 *   superficies de D20–D22, y D20 repite la de D18).
 * - Diferencias menores a 1 m² toman la cifra del listado.
 * - Los 22 sitios que ya no aparecen en el listado dejan de ofrecerse:
 *   pasan a `reservado` con `nota` (B5 sigue `vendido`). No se borran porque
 *   su círculo sigue impreso en el plano y quedaría a la vista sin marcador.
 *
 * `nota` es interna: no se muestra en el sitio.
 *
 * Posición (`x`, `y`): centro del círculo del sitio en el plano, como fracción
 * del ancho y del alto de la imagen (0–1). No es la coordenada cruda del sitio
 * original: esa marcaba la esquina superior izquierda de su ícono, unos 12 px
 * arriba y a la izquierda del círculo. Estos centros se midieron detectando
 * cada círculo en la imagen —aparecen los 184, con un desfase constante y sin
 * casos fuera de patrón—. A18, A19 y D1 no tenían coordenadas en el original;
 * se ubicaron a partir de sus vecinos y se confirmaron igual, midiendo su
 * círculo en el plano. La imagen de octubre es la misma de septiembre,
 * recomprimida: las posiciones siguen valiendo.
 *
 * `casa`: casa construida con la que se vende el sitio, con el texto que
 * publica el listado de octubre. `slugModelo` enlaza a la ficha del modelo
 * solo cuando coincide sin ambigüedad con el catálogo: "Mediterránea 308 m²"
 * es la Mediterránea 310 (la contradicción 308/310 está en el README), y
 * "Mediterránea 182 m²" y "Mediterránea 179 m² 2 pisos" son las del mismo
 * nombre. Mediterránea 140/176/180 y las casas sin superficie no tienen
 * modelo en el catálogo y van sin enlace.
 *
 * El listado llama "Casa Chilena" a casas que el catálogo, el brochure 2026 y
 * el sitio anterior llaman Colonial: G2 y G4 se mostraban con la foto de la
 * Colonial 150, y G3 y G32 con la de la Colonial 192 (que el listado anota
 * como "190 m² 2 pisos"). Aquí van con el nombre Colonial; "Colonial 140 m²"
 * (E4–E8) no está en el catálogo y va sin enlace.
 */

/** Fecha del listado del que salen los estados. Se muestra junto al buscador. */
export const FECHA_DISPONIBILIDAD = '2026-10-07';

/** Imagen del plano sobre la que están medidas las posiciones. */
export const PLANO = { ancho: 1600, alto: 4590 };

export const SECTORES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const ESTADOS = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

/** Los sitios del plano: cada uno tiene su círculo en la imagen del loteo. */
export const SITIOS = [
  { id: 'A1', sector: 'A', m2: 510.22, estado: 'vendido', x: 0.3147, y: 0.5448, casa: null },
  { id: 'A2', sector: 'A', m2: 507.34, estado: 'vendido', x: 0.3656, y: 0.5447, casa: null },
  { id: 'A3', sector: 'A', m2: 608.36, estado: 'disponible', x: 0.4253, y: 0.5447, casa: null },
  { id: 'A4', sector: 'A', m2: 1076.98, estado: 'disponible', x: 0.3973, y: 0.5141, casa: null },
  { id: 'A5', sector: 'A', m2: 985.27, estado: 'disponible', x: 0.3944, y: 0.4796, casa: null },
  { id: 'A6', sector: 'A', m2: 578.59, estado: 'disponible', x: 0.3994, y: 0.4534, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'A7', sector: 'A', m2: 650.54, estado: 'disponible', x: 0.4161, y: 0.4364, casa: null },
  { id: 'A8', sector: 'A', m2: 493.51, estado: 'vendido', x: 0.3307, y: 0.4364, casa: null },
  { id: 'A9', sector: 'A', m2: 446.82, estado: 'vendido', x: 0.3236, y: 0.4538, casa: null },
  { id: 'A10', sector: 'A', m2: 448.93, estado: 'vendido', x: 0.3222, y: 0.4709, casa: null },
  { id: 'A11', sector: 'A', m2: 448.75, estado: 'vendido', x: 0.3223, y: 0.4879, casa: null },
  { id: 'A12', sector: 'A', m2: 447.49, estado: 'vendido', x: 0.3232, y: 0.5055, casa: null },
  { id: 'A13', sector: 'A', m2: 450.61, estado: 'vendido', x: 0.3231, y: 0.5221, casa: null },
  { id: 'A14', sector: 'A', m2: 505.3, estado: 'vendido', x: 0.1387, y: 0.5491, casa: null },
  { id: 'A15', sector: 'A', m2: 489.82, estado: 'vendido', x: 0.1382, y: 0.5327, casa: null },
  { id: 'A16', sector: 'A', m2: 508.54, estado: 'vendido', x: 0.1384, y: 0.5151, casa: null },
  { id: 'A17', sector: 'A', m2: 496.32, estado: 'vendido', x: 0.1389, y: 0.4977, casa: null },
  { id: 'A18', sector: 'A', m2: 477.05, estado: 'vendido', x: 0.1387, y: 0.4802, casa: null },
  { id: 'A19', sector: 'A', m2: 461.31, estado: 'vendido', x: 0.1388, y: 0.4637, casa: null },
  { id: 'A20', sector: 'A', m2: 495.3, estado: 'vendido', x: 0.1387, y: 0.445, casa: null },
  { id: 'A21', sector: 'A', m2: 504.8, estado: 'disponible', x: 0.1388, y: 0.4261, casa: null },
  { id: 'A22', sector: 'A', m2: 794.34, estado: 'disponible', x: 0.1384, y: 0.4041, casa: null },
  { id: 'A23', sector: 'A', m2: 495.24, estado: 'disponible', x: 0.2098, y: 0.404, casa: null },
  { id: 'A24', sector: 'A', m2: 480.28, estado: 'vendido', x: 0.2622, y: 0.4039, casa: null },
  { id: 'A25', sector: 'A', m2: 475.82, estado: 'vendido', x: 0.31, y: 0.4041, casa: null },
  { id: 'A26', sector: 'A', m2: 474.79, estado: 'vendido', x: 0.3608, y: 0.4042, casa: null },
  { id: 'A27', sector: 'A', m2: 475.02, estado: 'disponible', x: 0.4106, y: 0.4041, casa: null },
  { id: 'A28', sector: 'A', m2: 685.58, estado: 'disponible', x: 0.4657, y: 0.403, casa: null },
  { id: 'B1', sector: 'B', m2: 663.77, estado: 'disponible', x: 0.4746, y: 0.3817, casa: null },
  { id: 'B2', sector: 'B', m2: 712.91, estado: 'disponible', x: 0.4885, y: 0.3612, casa: null },
  { id: 'B3', sector: 'B', m2: 723.15, estado: 'disponible', x: 0.495, y: 0.3399, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'B4', sector: 'B', m2: 709.04, estado: 'vendido', x: 0.4944, y: 0.3169, casa: null },
  { id: 'B5', sector: 'B', m2: 719.54, estado: 'vendido', x: 0.4856, y: 0.2956, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'B6', sector: 'B', m2: 475.6, estado: 'vendido', x: 0.414, y: 0.3023, casa: null },
  { id: 'B7', sector: 'B', m2: 473.51, estado: 'vendido', x: 0.4172, y: 0.3201, casa: null },
  { id: 'B8', sector: 'B', m2: 472.15, estado: 'vendido', x: 0.417, y: 0.338, casa: null },
  { id: 'B9', sector: 'B', m2: 448.92, estado: 'vendido', x: 0.417, y: 0.3551, casa: null },
  { id: 'B10', sector: 'B', m2: 549.51, estado: 'disponible', x: 0.4094, y: 0.3809, casa: null },
  { id: 'B11', sector: 'B', m2: 447.48, estado: 'vendido', x: 0.3586, y: 0.3808, casa: null },
  { id: 'B12', sector: 'B', m2: 473.8, estado: 'vendido', x: 0.309, y: 0.3809, casa: null },
  { id: 'B13', sector: 'B', m2: 468.0, estado: 'vendido', x: 0.2599, y: 0.3809, casa: null },
  { id: 'B14', sector: 'B', m2: 557.9, estado: 'reservado', x: 0.2076, y: 0.3809, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'B15', sector: 'B', m2: 766.89, estado: 'disponible', x: 0.1386, y: 0.3808, casa: null },
  { id: 'B16', sector: 'B', m2: 541.86, estado: 'disponible', x: 0.1385, y: 0.3605, casa: null },
  { id: 'B17', sector: 'B', m2: 516.23, estado: 'disponible', x: 0.1392, y: 0.3432, casa: { texto: 'Casa Mediterránea 179 m² 2 pisos', slugModelo: 'mediterranea-179' } },
  { id: 'B18', sector: 'B', m2: 517.02, estado: 'disponible', x: 0.1401, y: 0.3255, casa: null },
  { id: 'B19', sector: 'B', m2: 528.63, estado: 'vendido', x: 0.1406, y: 0.3074, casa: { texto: 'Casa Mediterránea', slugModelo: null } },
  { id: 'B20', sector: 'B', m2: 542.47, estado: 'disponible', x: 0.1402, y: 0.2887, casa: null },
  { id: 'B21', sector: 'B', m2: 556.58, estado: 'disponible', x: 0.1404, y: 0.2704, casa: null },
  { id: 'B22', sector: 'B', m2: 606.26, estado: 'disponible', x: 0.1398, y: 0.2522, casa: null },
  { id: 'B23', sector: 'B', m2: 861.66, estado: 'disponible', x: 0.1435, y: 0.2275, casa: null },
  { id: 'B24', sector: 'B', m2: 580.73, estado: 'disponible', x: 0.213, y: 0.2275, casa: null },
  { id: 'B25', sector: 'B', m2: 584.81, estado: 'disponible', x: 0.2663, y: 0.2275, casa: null },
  { id: 'B26', sector: 'B', m2: 649.75, estado: 'disponible', x: 0.3395, y: 0.2194, casa: null },
  { id: 'B27', sector: 'B', m2: 493.07, estado: 'disponible', x: 0.3546, y: 0.2347, casa: null },
  { id: 'B28', sector: 'B', m2: 467.7, estado: 'vendido', x: 0.3672, y: 0.2508, casa: null },
  { id: 'B29', sector: 'B', m2: 464.26, estado: 'vendido', x: 0.3881, y: 0.2658, casa: null },
  { id: 'B30', sector: 'B', m2: 683.81, estado: 'disponible', x: 0.4582, y: 0.2542, casa: null },
  { id: 'B31', sector: 'B', m2: 558.5, estado: 'vendido', x: 0.4338, y: 0.2345, casa: null },
  { id: 'B32', sector: 'B', m2: 484.88, estado: 'vendido', x: 0.4186, y: 0.2157, casa: null },
  { id: 'B33', sector: 'B', m2: 460.43, estado: 'vendido', x: 0.4079, y: 0.1979, casa: null },
  { id: 'B34', sector: 'B', m2: 620.0, estado: 'disponible', x: 0.3319, y: 0.1978, casa: null },
  { id: 'B35', sector: 'B', m2: 500.48, estado: 'vendido', x: 0.276, y: 0.1979, casa: null },
  { id: 'B36', sector: 'B', m2: 514.35, estado: 'disponible', x: 0.2266, y: 0.1979, casa: null },
  { id: 'B37', sector: 'B', m2: 525.74, estado: 'disponible', x: 0.1756, y: 0.1979, casa: null },
  { id: 'B38', sector: 'B', m2: 546.27, estado: 'disponible', x: 0.1278, y: 0.1979, casa: null },
  { id: 'C1', sector: 'C', m2: 691.83, estado: 'disponible', x: 0.1531, y: 0.162, casa: null },
  { id: 'C2', sector: 'C', m2: 652.27, estado: 'disponible', x: 0.1528, y: 0.1454, casa: null },
  { id: 'C3', sector: 'C', m2: 639.36, estado: 'disponible', x: 0.1529, y: 0.129, casa: null },
  { id: 'C4', sector: 'C', m2: 611.25, estado: 'disponible', x: 0.1527, y: 0.1136, casa: null },
  { id: 'C5', sector: 'C', m2: 554.62, estado: 'disponible', x: 0.1427, y: 0.0963, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'C6', sector: 'C', m2: 710.56, estado: 'disponible', x: 0.1521, y: 0.0785, casa: null },
  { id: 'C7', sector: 'C', m2: 615.66, estado: 'disponible', x: 0.2283, y: 0.0774, casa: null },
  { id: 'C8', sector: 'C', m2: 761.99, estado: 'vendido', x: 0.2871, y: 0.0776, casa: { texto: 'Casa Mediterránea', slugModelo: null } },
  { id: 'C9', sector: 'C', m2: 671.72, estado: 'disponible', x: 0.2814, y: 0.1148, casa: null },
  { id: 'C10', sector: 'C', m2: 668.84, estado: 'disponible', x: 0.2851, y: 0.1314, casa: null },
  { id: 'C11', sector: 'C', m2: 660.32, estado: 'disponible', x: 0.2867, y: 0.1477, casa: null },
  { id: 'C12', sector: 'C', m2: 661.77, estado: 'disponible', x: 0.2901, y: 0.1647, casa: null },
  { id: 'D1', sector: 'D', m2: 819.84, estado: 'reservado', x: 0.6552, y: 0.7499, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D2', sector: 'D', m2: 1232.14, estado: 'reservado', x: 0.6552, y: 0.7248, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D3', sector: 'D', m2: 661.61, estado: 'reservado', x: 0.6554, y: 0.6991, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D4', sector: 'D', m2: 866.8, estado: 'reservado', x: 0.761, y: 0.7478, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D5', sector: 'D', m2: 701.04, estado: 'reservado', x: 0.8481, y: 0.7499, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D6', sector: 'D', m2: 496.93, estado: 'reservado', x: 0.8619, y: 0.7324, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D7', sector: 'D', m2: 527.67, estado: 'reservado', x: 0.862, y: 0.7149, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D8', sector: 'D', m2: 555.7, estado: 'reservado', x: 0.8598, y: 0.698, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D9', sector: 'D', m2: 568.38, estado: 'reservado', x: 0.8581, y: 0.6812, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D10', sector: 'D', m2: 531.99, estado: 'reservado', x: 0.8572, y: 0.6637, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D11', sector: 'D', m2: 808.22, estado: 'reservado', x: 0.8709, y: 0.6374, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D12', sector: 'D', m2: 527.36, estado: 'reservado', x: 0.808, y: 0.6362, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D13', sector: 'D', m2: 528.78, estado: 'vendido', x: 0.7562, y: 0.6348, casa: null },
  { id: 'D14', sector: 'D', m2: 547.85, estado: 'reservado', x: 0.701, y: 0.6347, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D15', sector: 'D', m2: 713.33, estado: 'reservado', x: 0.6448, y: 0.6348, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D16', sector: 'D', m2: 468.03, estado: 'reservado', x: 0.6409, y: 0.664, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D17', sector: 'D', m2: 637.93, estado: 'reservado', x: 0.573, y: 0.6524, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D18', sector: 'D', m2: 655.5, estado: 'disponible', x: 0.5747, y: 0.6302, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'D19', sector: 'D', m2: 676.84, estado: 'reservado', x: 0.5748, y: 0.608, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'D20', sector: 'D', m2: 451.59, estado: 'disponible', x: 0.6375, y: 0.6093, casa: { texto: 'Casa Mediterránea 140 m²', slugModelo: null }, nota: "El listado del 2026-10-07 publica 655,5 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'D21', sector: 'D', m2: 460.31, estado: 'disponible', x: 0.6838, y: 0.6093, casa: { texto: 'Casa Mediterránea 140 m²', slugModelo: null }, nota: "El listado del 2026-10-07 publica 676,84 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'D22', sector: 'D', m2: 461.87, estado: 'disponible', x: 0.7296, y: 0.6093, casa: { texto: 'Casa Mediterránea 140 m²', slugModelo: null }, nota: "El listado del 2026-10-07 publica 451,59 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'D23', sector: 'D', m2: 456.82, estado: 'disponible', x: 0.7756, y: 0.6092, casa: { texto: 'Casa Mediterránea 140 m²', slugModelo: null }, nota: "El listado del 2026-10-07 publica 460,31 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'D24', sector: 'D', m2: 454.72, estado: 'disponible', x: 0.8221, y: 0.6101, casa: { texto: 'Casa Mediterránea 140 m²', slugModelo: null }, nota: "El listado del 2026-10-07 publica 461,87 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'D25', sector: 'D', m2: 530.32, estado: 'reservado', x: 0.8709, y: 0.6101, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'E1', sector: 'E', m2: 1280.24, estado: 'disponible', x: 0.5542, y: 0.5071, casa: null },
  { id: 'E2', sector: 'E', m2: 1056.64, estado: 'disponible', x: 0.5712, y: 0.54, casa: null },
  { id: 'E3', sector: 'E', m2: 917.12, estado: 'disponible', x: 0.5783, y: 0.5697, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'E4', sector: 'E', m2: 473.64, estado: 'disponible', x: 0.649, y: 0.5712, casa: { texto: 'Casa Colonial 140 m²', slugModelo: null } },
  { id: 'E5', sector: 'E', m2: 477.95, estado: 'disponible', x: 0.7014, y: 0.5711, casa: { texto: 'Casa Colonial 140 m²', slugModelo: null } },
  { id: 'E6', sector: 'E', m2: 473.49, estado: 'disponible', x: 0.7547, y: 0.5711, casa: { texto: 'Casa Colonial 140 m²', slugModelo: null } },
  { id: 'E7', sector: 'E', m2: 474.15, estado: 'disponible', x: 0.8063, y: 0.5711, casa: { texto: 'Casa Colonial 140 m²', slugModelo: null } },
  { id: 'E8', sector: 'E', m2: 670.54, estado: 'disponible', x: 0.8661, y: 0.5709, casa: { texto: 'Casa Colonial 140 m²', slugModelo: null } },
  { id: 'E9', sector: 'E', m2: 861.86, estado: 'vendido', x: 0.6443, y: 0.5058, casa: null, nota: "El listado del 2026-10-07 publica 719,54 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'E10', sector: 'E', m2: 942.13, estado: 'vendido', x: 0.6561, y: 0.54, casa: null },
  { id: 'E11', sector: 'E', m2: 625.72, estado: 'vendido', x: 0.7239, y: 0.547, casa: { texto: 'Casa Colonial', slugModelo: null } },
  { id: 'E12', sector: 'E', m2: 632.35, estado: 'disponible', x: 0.7944, y: 0.5473, casa: null },
  { id: 'E13', sector: 'E', m2: 817.12, estado: 'disponible', x: 0.8638, y: 0.542, casa: null },
  { id: 'E14', sector: 'E', m2: 512.08, estado: 'disponible', x: 0.8639, y: 0.5211, casa: null },
  { id: 'E15', sector: 'E', m2: 522.54, estado: 'reservado', x: 0.864, y: 0.5043, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'E16', sector: 'E', m2: 518.03, estado: 'reservado', x: 0.8639, y: 0.4865, casa: null, nota: "No figura en el listado publicado el 2026-10-07; confirmar." },
  { id: 'E17', sector: 'E', m2: 517.1, estado: 'vendido', x: 0.8639, y: 0.4693, casa: null },
  { id: 'E18', sector: 'E', m2: 514.65, estado: 'disponible', x: 0.8636, y: 0.452, casa: null },
  { id: 'E19', sector: 'E', m2: 520.74, estado: 'disponible', x: 0.8633, y: 0.4347, casa: null },
  { id: 'E20', sector: 'E', m2: 471.75, estado: 'disponible', x: 0.8638, y: 0.418, casa: null },
  { id: 'E21', sector: 'E', m2: 702.35, estado: 'disponible', x: 0.864, y: 0.4, casa: null },
  { id: 'E22', sector: 'E', m2: 755.94, estado: 'disponible', x: 0.7634, y: 0.4158, casa: null },
  { id: 'E23', sector: 'E', m2: 980.68, estado: 'disponible', x: 0.6961, y: 0.4183, casa: null },
  { id: 'E24', sector: 'E', m2: 541.05, estado: 'vendido', x: 0.6785, y: 0.4397, casa: null },
  { id: 'E25', sector: 'E', m2: 844.27, estado: 'vendido', x: 0.6593, y: 0.459, casa: null },
  { id: 'E26', sector: 'E', m2: 749.88, estado: 'disponible', x: 0.5612, y: 0.4598, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'E27', sector: 'E', m2: 626.57, estado: 'disponible', x: 0.5856, y: 0.4418, casa: null },
  { id: 'E28', sector: 'E', m2: 605.41, estado: 'disponible', x: 0.6101, y: 0.4202, casa: { texto: 'Casa Mediterránea 308 m²', slugModelo: 'mediterranea-310' } },
  { id: 'E29', sector: 'E', m2: 591.24, estado: 'disponible', x: 0.6209, y: 0.4017, casa: null },
  { id: 'E30', sector: 'E', m2: 670.67, estado: 'disponible', x: 0.6375, y: 0.3811, casa: null },
  { id: 'F1', sector: 'F', m2: 698.48, estado: 'disponible', x: 0.7003, y: 0.3863, casa: null },
  { id: 'F2', sector: 'F', m2: 824.44, estado: 'disponible', x: 0.7649, y: 0.3857, casa: null },
  { id: 'F3', sector: 'F', m2: 668.09, estado: 'disponible', x: 0.8483, y: 0.3835, casa: null },
  { id: 'F4', sector: 'F', m2: 446.69, estado: 'disponible', x: 0.8664, y: 0.3663, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'F5', sector: 'F', m2: 460.71, estado: 'disponible', x: 0.8666, y: 0.3492, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'F6', sector: 'F', m2: 471.93, estado: 'disponible', x: 0.8653, y: 0.3322, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'F7', sector: 'F', m2: 482.08, estado: 'disponible', x: 0.8601, y: 0.3139, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'F8', sector: 'F', m2: 493.94, estado: 'disponible', x: 0.8564, y: 0.2967, casa: null },
  { id: 'F9', sector: 'F', m2: 588.89, estado: 'disponible', x: 0.8562, y: 0.2785, casa: null },
  { id: 'F10', sector: 'F', m2: 486.28, estado: 'vendido', x: 0.7554, y: 0.2805, casa: null },
  { id: 'F11', sector: 'F', m2: 449.09, estado: 'disponible', x: 0.7579, y: 0.2972, casa: null },
  { id: 'F12', sector: 'F', m2: 447.0, estado: 'disponible', x: 0.7616, y: 0.3138, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'F13', sector: 'F', m2: 447.54, estado: 'disponible', x: 0.7641, y: 0.3322, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'F14', sector: 'F', m2: 439.26, estado: 'disponible', x: 0.7672, y: 0.3507, casa: { texto: 'Casa Mediterránea 140 m² 2 pisos', slugModelo: null } },
  { id: 'G1', sector: 'G', m2: 594.66, estado: 'disponible', x: 0.5419, y: 0.1565, casa: null },
  { id: 'G2', sector: 'G', m2: 602.01, estado: 'vendido', x: 0.5458, y: 0.1752, casa: { texto: 'Casa Colonial 150 m²', slugModelo: 'colonial-150' } },
  { id: 'G3', sector: 'G', m2: 662.14, estado: 'disponible', x: 0.5528, y: 0.1954, casa: { texto: 'Casa Colonial 192 m² 2 pisos', slugModelo: 'colonial-192' } },
  { id: 'G4', sector: 'G', m2: 573.66, estado: 'disponible', x: 0.5712, y: 0.2134, casa: { texto: 'Casa Colonial 150 m²', slugModelo: 'colonial-150' } },
  { id: 'G5', sector: 'G', m2: 645.34, estado: 'disponible', x: 0.6234, y: 0.1564, casa: null },
  { id: 'G6', sector: 'G', m2: 642.74, estado: 'vendido', x: 0.6235, y: 0.1751, casa: null },
  { id: 'G7', sector: 'G', m2: 671.63, estado: 'disponible', x: 0.6392, y: 0.1938, casa: null },
  { id: 'G8', sector: 'G', m2: 694.69, estado: 'disponible', x: 0.6587, y: 0.2135, casa: null },
  { id: 'G9', sector: 'G', m2: 591.0, estado: 'vendido', x: 0.728, y: 0.2134, casa: null },
  { id: 'G10', sector: 'G', m2: 592.16, estado: 'disponible', x: 0.7816, y: 0.2135, casa: null },
  { id: 'G11', sector: 'G', m2: 675.39, estado: 'disponible', x: 0.8574, y: 0.2137, casa: { texto: 'Casa Mediterránea 182 m²', slugModelo: 'mediterranea-182' } },
  { id: 'G12', sector: 'G', m2: 583.04, estado: 'disponible', x: 0.8619, y: 0.1923, casa: { texto: 'Casa Mediterránea 176 m²', slugModelo: null } },
  { id: 'G13', sector: 'G', m2: 763.73, estado: 'vendido', x: 0.852, y: 0.1736, casa: null, nota: "El listado del 2026-10-07 publica 736,73 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'G14', sector: 'G', m2: 712.81, estado: 'vendido', x: 0.8523, y: 0.1539, casa: { texto: 'Casa Colonial', slugModelo: null } },
  { id: 'G15', sector: 'G', m2: 699.13, estado: 'disponible', x: 0.8524, y: 0.135, casa: null },
  { id: 'G16', sector: 'G', m2: 688.53, estado: 'disponible', x: 0.8516, y: 0.114, casa: null },
  { id: 'G17', sector: 'G', m2: 661.32, estado: 'vendido', x: 0.8521, y: 0.0956, casa: { texto: 'Casa Mediterránea', slugModelo: null } },
  { id: 'G18', sector: 'G', m2: 683.09, estado: 'disponible', x: 0.8515, y: 0.0757, casa: null },
  { id: 'G19', sector: 'G', m2: 662.26, estado: 'disponible', x: 0.852, y: 0.0557, casa: { texto: 'Casa Mediterránea 180 m²', slugModelo: null } },
  { id: 'G20', sector: 'G', m2: 746.04, estado: 'disponible', x: 0.8517, y: 0.0367, casa: null },
  { id: 'G21', sector: 'G', m2: 603.75, estado: 'disponible', x: 0.77, y: 0.0426, casa: null },
  { id: 'G22', sector: 'G', m2: 670.55, estado: 'vendido', x: 0.714, y: 0.0501, casa: { texto: 'Casa Mediterránea', slugModelo: null } },
  { id: 'G23', sector: 'G', m2: 775.84, estado: 'disponible', x: 0.6579, y: 0.0531, casa: { texto: 'Casa Mediterránea 179 m²', slugModelo: null } },
  { id: 'G24', sector: 'G', m2: 592.48, estado: 'vendido', x: 0.6667, y: 0.0811, casa: null },
  { id: 'G25', sector: 'G', m2: 616.2, estado: 'vendido', x: 0.6622, y: 0.0991, casa: null, nota: "El listado del 2026-10-07 publica 614,02 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'G26', sector: 'G', m2: 535.57, estado: 'vendido', x: 0.648, y: 0.1182, casa: null },
  { id: 'G27', sector: 'G', m2: 655.75, estado: 'disponible', x: 0.5681, y: 0.1152, casa: null },
  { id: 'G28', sector: 'G', m2: 682.71, estado: 'disponible', x: 0.5744, y: 0.0963, casa: null },
  { id: 'G29', sector: 'G', m2: 700.98, estado: 'disponible', x: 0.5811, y: 0.0754, casa: null },
  { id: 'G30', sector: 'G', m2: 756.11, estado: 'disponible', x: 0.5843, y: 0.0542, casa: null },
  { id: 'G31', sector: 'G', m2: 568.03, estado: 'disponible', x: 0.6151, y: 0.2498, casa: null },
  { id: 'G32', sector: 'G', m2: 615.22, estado: 'vendido', x: 0.5923, y: 0.232, casa: { texto: 'Casa Colonial 192 m² 2 pisos', slugModelo: 'colonial-192' } },
  { id: 'G33', sector: 'G', m2: 743.57, estado: 'disponible', x: 0.6714, y: 0.2354, casa: null },
  { id: 'G34', sector: 'G', m2: 646.48, estado: 'vendido', x: 0.7266, y: 0.2378, casa: null },
  { id: 'G35', sector: 'G', m2: 628.12, estado: 'vendido', x: 0.7753, y: 0.2378, casa: null, nota: "El listado del 2026-10-07 publica 626,92 m²; se mantiene la cifra anterior hasta confirmar." },
  { id: 'G36', sector: 'G', m2: 608.81, estado: 'disponible', x: 0.8237, y: 0.238, casa: null },
  { id: 'G37', sector: 'G', m2: 586.0, estado: 'disponible', x: 0.8755, y: 0.2378, casa: null },
];

/**
 * Macrolotes: terrenos que el listado de octubre publica junto a los sitios,
 * pero que no son sitios residenciales del loteo. D26 (7.674 m²) no tiene
 * círculo en el plano, y H1 (4,4 ha) está en un sector H que el plano no
 * muestra. Van solo en la vista de lista y quedan fuera del rango de
 * superficies y de los recuentos de sitios.
 */
export const MACROLOTES = [
  { id: 'D26', sector: 'D', m2: 7673.94, estado: 'disponible', tipo: 'macrolote' },
  { id: 'H1', sector: 'H', m2: 43854.08, estado: 'disponible', tipo: 'macrolote' },
];

const disponibles = SITIOS.filter((s) => s.estado === 'disponible');

/** Cifras derivadas: se calculan, no se escriben a mano. */
export const RESUMEN = {
  total: SITIOS.length,
  disponibles: disponibles.length,
  reservados: SITIOS.filter((s) => s.estado === 'reservado').length,
  vendidos: SITIOS.filter((s) => s.estado === 'vendido').length,
  sectores: SECTORES.length,
  m2Min: Math.min(...disponibles.map((s) => s.m2)),
  m2Max: Math.max(...disponibles.map((s) => s.m2)),
  macrolotes: MACROLOTES.length,
  disponiblesConCasa: disponibles.filter((s) => s.casa).length,
};

/** Disponibles por sector, para las pastillas del filtro. */
export const POR_SECTOR = SECTORES.map((sector) => {
  const delSector = SITIOS.filter((s) => s.sector === sector);
  const libres = delSector.filter((s) => s.estado === 'disponible');
  return {
    sector,
    disponibles: libres.length,
    total: delSector.length,
    m2Min: libres.length ? Math.min(...libres.map((s) => s.m2)) : null,
    m2Max: libres.length ? Math.max(...libres.map((s) => s.m2)) : null,
  };
});
