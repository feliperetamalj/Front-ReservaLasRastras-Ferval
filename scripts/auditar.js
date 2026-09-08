/**
 * Auditoría de accesibilidad y estructura, para ejecutar en el navegador.
 *
 * Por qué existe: el panel de navegador no es de fiar para verificar páginas
 * largas. Devuelve capturas rancias o en blanco y el desplazamiento se
 * reinicia entre llamadas. Consultar el DOM sí es determinista: mide lo que
 * de verdad hay renderizado, sin depender de que se pinte un fotograma.
 *
 * Uso: pégalo entero en la consola del navegador, o pásalo como cuerpo de una
 * ejecución de JavaScript desde las herramientas del navegador.
 *
 * Devuelve un objeto con los hallazgos. Un resultado limpio tiene
 * `problemas: []` y `cls: 0`.
 */

(() => {
  const problemas = [];

  // --- Imágenes sin texto alternativo ------------------------------------
  // alt="" es válido y correcto para imágenes decorativas; lo que falla es
  // no declarar el atributo, porque el lector de pantalla lee la URL.
  const sinAlt = [...document.images].filter((i) => !i.hasAttribute('alt'));
  if (sinAlt.length) {
    problemas.push(`${sinAlt.length} imagen(es) sin atributo alt: ` +
      sinAlt.slice(0, 4).map((i) => i.currentSrc.split('/').pop()).join(', '));
  }

  // --- Controles sin nombre accesible ------------------------------------
  // Un botón que solo contiene un icono no dice nada a quien no lo ve.
  const sinNombre = [...document.querySelectorAll('button, a[href]')].filter((el) => {
    const texto = (el.innerText || '').trim();
    return !texto &&
      !el.getAttribute('aria-label') &&
      !el.getAttribute('aria-labelledby') &&
      !el.querySelector('.sr-only, [class*="sr-only"]') &&
      !el.querySelector('img[alt]:not([alt=""])');
  });
  if (sinNombre.length) {
    problemas.push(`${sinNombre.length} control(es) sin nombre accesible: ` +
      sinNombre.slice(0, 4).map((e) => `${e.tagName}.${String(e.className).slice(0, 20)}`).join(' | '));
  }

  // --- Un solo h1 por página ---------------------------------------------
  const h1 = document.querySelectorAll('h1').length;
  if (h1 !== 1) problemas.push(`hay ${h1} elementos h1; debería haber exactamente 1`);

  // --- Jerarquía de encabezados sin saltos -------------------------------
  const niveles = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
  const saltos = [];
  for (let i = 1; i < niveles.length; i++) {
    if (niveles[i] - niveles[i - 1] > 1) saltos.push(`${niveles[i - 1]}→${niveles[i]}`);
  }
  if (saltos.length) problemas.push(`saltos de nivel en encabezados: ${saltos.join(', ')}`);

  // --- Idioma declarado ---------------------------------------------------
  if (!document.documentElement.lang) problemas.push('falta el atributo lang en <html>');

  // --- Objetivos táctiles -------------------------------------------------
  // Dos umbrales distintos, porque confundirlos genera ruido:
  //   · 24px es el mínimo obligatorio (WCAG 2.5.8, nivel AA). Incumplirlo
  //     es un fallo real.
  //   · 44px es el tamaño cómodo recomendado (nivel AAA y guías de iOS).
  //     Quedarse entre 24 y 44 es aceptable, pero conviene saberlo.
  // Los enlaces en línea dentro de un párrafo están exentos y se filtran.
  const medir = (el) => {
    const r = el.getBoundingClientRect();
    return { r, etiqueta: `${el.tagName}.${String(el.className).slice(0, 20)} ${Math.round(r.width)}x${Math.round(r.height)}` };
  };
  const candidatos = [...document.querySelectorAll('button, a[href], input, select, textarea')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      return !(getComputedStyle(el).display === 'inline' &&
        el.closest('p, li, address, figcaption'));
    });

  const bajoMinimo = candidatos
    .filter((el) => { const { r } = medir(el); return r.height < 24 || r.width < 24; })
    .map((el) => medir(el).etiqueta);
  if (bajoMinimo.length) {
    problemas.push(`${bajoMinimo.length} objetivo(s) bajo el mínimo de 24px: ` +
      bajoMinimo.slice(0, 4).join(' | '));
  }

  const chicos = candidatos
    .filter((el) => {
      const { r } = medir(el);
      return r.height >= 24 && r.width >= 24 && (r.height < 44 || r.width < 44);
    })
    .map((el) => medir(el).etiqueta);

  // --- Desplazamiento acumulado de diseño (CLS) ---------------------------
  let cls = 0;
  try {
    new PerformanceObserver((lista) => {
      for (const e of lista.getEntries()) if (!e.hadRecentInput) cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* el navegador no lo soporta */ }

  // --- Imágenes sin espacio reservado ------------------------------------
  // Sin proporción ni alto declarados, la imagen empuja el contenido al
  // cargar. Es la causa habitual de un CLS alto.
  const sinReserva = [...document.images].filter((img) => {
    const cs = getComputedStyle(img);
    if (cs.position === 'absolute' || cs.position === 'fixed') return false;
    const padre = img.parentElement ? getComputedStyle(img.parentElement) : null;
    const tieneProporcion = cs.aspectRatio !== 'auto' ||
      (padre && padre.aspectRatio !== 'auto');
    const tieneAlto = cs.height !== 'auto' && parseFloat(cs.height) > 0;
    return !tieneProporcion && !tieneAlto;
  }).map((i) => i.currentSrc.split('/').pop());
  if (sinReserva.length) {
    problemas.push(`${sinReserva.length} imagen(es) sin proporción reservada: ` +
      sinReserva.slice(0, 4).join(', '));
  }

  // --- Enlaces rotos a rutas internas ------------------------------------
  const anclas = [...document.querySelectorAll('a[href^="#"]')]
    .map((a) => a.getAttribute('href'))
    .filter((h) => h.length > 1 && !document.querySelector(h));
  if (anclas.length) problemas.push(`anclas sin destino: ${[...new Set(anclas)].join(', ')}`);

  return {
    problemas: problemas.length ? problemas : ['ninguno'],
    // Cumplen el mínimo AA pero no llegan a los 44px cómodos. Informativo,
    // no un fallo: decide caso a caso si vale la pena agrandarlos.
    bajoLos44px: chicos.length ? chicos.slice(0, 10) : 'ninguno',
    cls: Number(cls.toFixed(4)),
    resumen: {
      imagenes: document.images.length,
      enlaces: document.querySelectorAll('a[href]').length,
      encabezados: niveles.length,
      idioma: document.documentElement.lang || '(sin declarar)',
      altoPagina: document.documentElement.scrollHeight,
    },
  };
})();
