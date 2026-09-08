import { useEffect, useRef, useState } from 'react';

/** Margen inferior, en píxeles, que el elemento debe superar para revelarse. */
const MARGEN_INFERIOR = 60;

/*
  Red de seguridad compartida.

  IntersectionObserver es el mecanismo principal, pero hay contextos que lo
  suspenden sin avisar (pestañas que nunca se pintan, navegadores incrustados,
  paneles de vista previa). Si eso ocurre, el contenido se queda en opacidad 0
  y la página parece rota: un fallo mucho peor que perder la animación.

  Un único oyente de scroll, pasivo y compartido por todos los elementos
  pendientes, cubre ese caso. Se desconecta solo cuando ya no queda ninguno,
  así que en el camino normal —donde el observador sí funciona— no queda
  trabajo por fotograma.
*/
const pendientes = new Set();
let oyenteActivo = false;

function revisarPendientes() {
  for (const revisar of [...pendientes]) revisar();
  if (pendientes.size === 0) {
    window.removeEventListener('scroll', revisarPendientes);
    oyenteActivo = false;
  }
}

function agregarPendiente(revisar) {
  pendientes.add(revisar);
  if (!oyenteActivo) {
    window.addEventListener('scroll', revisarPendientes, { passive: true });
    oyenteActivo = true;
  }
}

function quitarPendiente(revisar) {
  pendientes.delete(revisar);
  if (pendientes.size === 0 && oyenteActivo) {
    window.removeEventListener('scroll', revisarPendientes);
    oyenteActivo = false;
  }
}

/**
 * Revela un elemento cuando entra en pantalla.
 *
 * Lo que ya está en pantalla al montar se revela de inmediato, sin esperar al
 * observador: un revelado es una mejora, no un requisito para ver la página.
 *
 * El umbral es 0 y el margen una cantidad fija de píxeles, no un porcentaje.
 * Con umbral 0.1 hacía falta que entrara el 10 % del bloque, y una tarjeta de
 * 555 px de alto asomada por el borde inferior no lo cumplía.
 */
export function useRevelado({ margen = `0px 0px -${MARGEN_INFERIOR}px 0px`, umbral = 0 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return undefined;

    const enPantalla = () => {
      const r = nodo.getBoundingClientRect();
      return r.top < window.innerHeight - MARGEN_INFERIOR && r.bottom > 0;
    };

    // Ya visible al montar, o sin soporte: se muestra y no hay nada que observar.
    if (enPantalla() || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    let terminado = false;
    const revelar = () => {
      if (terminado) return;
      terminado = true;
      setVisible(true);
      limpiar();
    };

    const revisar = () => {
      if (enPantalla()) revelar();
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) revelar();
      },
      { rootMargin: margen, threshold: umbral },
    );
    observador.observe(nodo);
    agregarPendiente(revisar);

    function limpiar() {
      observador.disconnect();
      quitarPendiente(revisar);
    }

    return limpiar;
  }, [margen, umbral]);

  return [ref, visible];
}
