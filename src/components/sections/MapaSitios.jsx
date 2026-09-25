import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Icono } from '../ui';
import { FichaSitio } from './FichaSitio';
import { FOTOS } from '../../data/proyecto';
import { porSlug } from '../../data/modelos';
import { PLANO } from '../../data/sitios';
import { m2 } from '../../utils/formato';
import { useMovimientoReducido } from '../../hooks';
import s from './MapaSitios.module.css';

/*
  Escala del plano.

  `k` son píxeles de pantalla por píxel del plano original (1600 × 4590). En el
  plano cada sitio es un círculo de 45 px y los dos más apretados (C3 y C4)
  están a 70,7 px de centro a centro, así que lo que limita la precisión del
  toque es siempre el tamaño del círculo, nunca la separación.

  Con el círculo a 28 px se toca con el dedo sin errar: eso da K_LEGIBLE. En
  escritorio el plano ya cabe a esa escala; en un teléfono haría falta verlo a
  casi tres veces el ancho de la pantalla, así que ahí se parte viendo el
  barrio entero y el primer toque acerca sobre ese punto, como en un mapa.
*/
const DIAMETRO_PLANO = 45;
const DIAMETRO_COMODO = 28;
const K_LEGIBLE = DIAMETRO_COMODO / DIAMETRO_PLANO;
// Bajo 24 px (el mínimo de WCAG 2.5.8) un toque no distingue un sitio de su
// vecino: ahí tocar acerca en vez de elegir.
const K_TOCABLE = 24 / DIAMETRO_PLANO;
const K_MAX = 1.25; // más allá, la imagen de 1600 px se ve borrosa
const PASO_ZOOM = 1.5;

/**
 * Niveles fijos de zoom para los botones y las teclas.
 *
 * Multiplicar y dividir por un factor no es simétrico en cuanto hay un tope:
 * 0,62 → 0,93 → 1,25 (tope) y de vuelta 0,83 → 0,56, lejos de donde se
 * partió. Con niveles fijos, acercar y alejar el mismo número de veces
 * devuelve siempre al mismo lugar, y la escala inicial y la legible son
 * siempre una parada.
 */
function nivelesDeZoom(kTodo, kInicial) {
  const fijos = [kTodo, kInicial, K_LEGIBLE, K_LEGIBLE * PASO_ZOOM, K_MAX].filter(
    (v) => v >= kTodo - 1e-4 && v <= K_MAX + 1e-4,
  );
  const relleno = [];
  for (let v = kTodo * 1.6; v < K_LEGIBLE; v *= 1.6) relleno.push(v);
  // Un nivel de relleno demasiado cerca de uno fijo sería un paso que casi no se nota.
  const utiles = relleno.filter((v) => fijos.every((f) => Math.max(v, f) / Math.min(v, f) >= 1.25));
  return [...new Set([...fijos, ...utiles].map((v) => +v.toFixed(4)))].sort((a, b) => a - b);
}
const DIAMETRO_CON_NUMERO = 20; // bajo esto el número no cabe y el sitio es un punto

const SEPARACION_FICHA = 10;
const MARGEN_FICHA = 12;
const ESPERA_APERTURA = 90; // primera ficha por hover: evita destellos al cruzar el plano
const ESPERA_CIERRE = 160; // gracia para llevar el puntero del sitio a su ficha
const UMBRAL_ARRASTRE = 5; // px antes de decidir que un clic es en realidad un arrastre

const acotar = (v, min, max) => Math.min(Math.max(v, min), max);

/** Nombre accesible completo: el lector de pantalla recibe todo sin abrir la ficha. */
const nombreAccesible = (sitio) => {
  const modelo = sitio.modelo ? porSlug(sitio.modelo) : null;
  return (
    `Sitio ${sitio.id}, ${sitio.estado}, ${m2(sitio.m2)}` +
    (modelo ? `, con casa modelo ${modelo.nombre}` : '')
  );
};

/** Orden de lectura: por franjas de 60 px del plano y, dentro de cada una, de izquierda a derecha. */
const ordenLectura = (a, b) =>
  Math.round((a.y * PLANO.alto) / 60) - Math.round((b.y * PLANO.alto) / 60) || a.x - b.x;

const FLECHAS = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };

/**
 * El sitio más cercano en la dirección de la flecha. Se castiga el desvío
 * lateral para que "derecha" siga la fila en vez de saltar en diagonal.
 */
function vecinoEn(actual, [dx, dy], candidatos) {
  let mejor = null;
  let menor = Infinity;
  for (const o of candidatos) {
    if (o.id === actual.id) continue;
    const vx = (o.x - actual.x) * PLANO.ancho;
    const vy = (o.y - actual.y) * PLANO.alto;
    const avance = vx * dx + vy * dy;
    if (avance <= 8) continue;
    const puntaje = avance + Math.abs(vx * dy - vy * dx) * 2.2;
    if (puntaje < menor) {
      menor = puntaje;
      mejor = o;
    }
  }
  return mejor;
}

/** Un sitio del plano. Memorizado: al pasar el puntero solo se repintan dos. */
const Marcador = memo(function Marcador({ sitio, activo, enFoco, atenuado, registrar }) {
  return (
    <button
      ref={(nodo) => registrar(sitio.id, nodo)}
      type="button"
      className={`${s.marcador} ${activo ? s.activo : ''} ${atenuado ? s.atenuado : ''}`}
      style={{ left: `${sitio.x * 100}%`, top: `${sitio.y * 100}%` }}
      data-id={sitio.id}
      data-estado={sitio.estado}
      tabIndex={enFoco ? 0 : -1}
      aria-label={nombreAccesible(sitio)}
      aria-expanded={activo}
      aria-controls={activo ? 'ficha-sitio' : undefined}
    >
      <span className={s.numero} aria-hidden="true">
        {sitio.id}
      </span>
    </button>
  );
});

export function MapaSitios({ sitios, coincide }) {
  const marco = useRef(null);
  const ficha = useRef(null);
  const botones = useRef(new Map());
  const temporizador = useRef(0);
  const anclaPendiente = useRef(null);
  const zoomElegido = useRef(false);
  const arrastre = useRef(null);
  const deslizamiento = useRef(0);
  const ignorarClic = useRef(false);

  const [tamano, setTamano] = useState(null); // { ancho, alto } del marco
  const [k, setK] = useState(null);
  const [activo, setActivo] = useState(null);
  const [fijado, setFijado] = useState(false);
  const [foco, setFoco] = useState(null);
  const [posicion, setPosicion] = useState(null);
  const movimientoReducido = useMovimientoReducido();

  // Lecturas actuales para los oyentes nativos, que no ven el estado nuevo.
  const kActual = useRef(null);
  kActual.current = k;

  const porId = useMemo(() => new Map(sitios.map((x) => [x.id, x])), [sitios]);
  const ordenados = useMemo(() => [...sitios].sort(ordenLectura), [sitios]);
  // Las flechas visitan solo lo que coincide con los filtros. Si nada
  // coincide, recorren todo: el plano nunca queda sin salida para el teclado.
  const navegables = useMemo(() => {
    const coinciden = ordenados.filter(coincide);
    return coinciden.length ? coinciden : ordenados;
  }, [ordenados, coincide]);

  const registrar = useCallback((id, nodo) => {
    if (nodo) botones.current.set(id, nodo);
    else botones.current.delete(id);
  }, []);

  /* ------------------------------------------------------------------------
     Tamaño del marco y límites de zoom
     ---------------------------------------------------------------------- */
  useLayoutEffect(() => {
    const m = marco.current;
    const medir = () => setTamano({ ancho: m.clientWidth, alto: m.clientHeight });
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(m);
    return () => observador.disconnect();
  }, []);

  const limites = useMemo(() => {
    // Un marco sin medidas (oculto, o antes de su primer diseño) no define
    // escala: con k = 0 el plano y sus 184 sitios quedarían en nada.
    if (!tamano || tamano.ancho === 0 || tamano.alto === 0) return null;
    const kAncho = tamano.ancho / PLANO.ancho;
    // "Ver todo": el plano completo dentro del marco.
    const kTodo = Math.min(kAncho, tamano.alto / PLANO.alto);
    // Escritorio parte legible; si no cabe, se parte viendo el ancho completo.
    const kInicial = kAncho >= K_LEGIBLE ? K_LEGIBLE : kAncho;
    return { kTodo, kInicial, niveles: nivelesDeZoom(kTodo, kInicial) };
  }, [tamano]);

  useLayoutEffect(() => {
    if (!limites) return;
    setK((previo) =>
      previo === null || !zoomElegido.current
        ? limites.kInicial
        : acotar(previo, limites.kTodo, K_MAX),
    );
  }, [limites]);

  /** Margen con que el lienzo queda centrado cuando es más angosto que el marco. */
  const margenLienzo = (escala) =>
    Math.max(0, (marco.current.clientWidth - PLANO.ancho * escala) / 2);

  /**
   * Cambia la escala manteniendo fijo el punto del plano que está bajo `punto`
   * (coordenadas dentro del marco). Sin punto, se ancla al centro visible.
   * Es lo que hace que acercar se sienta como acercarse a algo, no como un
   * salto a otra parte del plano.
   */
  const aplicarZoom = useCallback(
    (kObjetivo, punto) => {
      const m = marco.current;
      const kAhora = kActual.current;
      if (!m || !limites || kAhora === null) return;
      const kNuevo = acotar(kObjetivo, limites.kTodo, K_MAX);
      if (Math.abs(kNuevo - kAhora) < 1e-4) return;
      const ax = punto?.x ?? m.clientWidth / 2;
      const ay = punto?.y ?? m.clientHeight / 2;
      anclaPendiente.current = {
        px: (m.scrollLeft + ax - margenLienzo(kAhora)) / kAhora,
        py: (m.scrollTop + ay) / kAhora,
        ax,
        ay,
      };
      zoomElegido.current = true;
      setK(kNuevo);
    },
    [limites],
  );

  // Tras cambiar la escala, se reubica el desplazamiento para respetar el ancla.
  useLayoutEffect(() => {
    const a = anclaPendiente.current;
    const m = marco.current;
    if (!a || !m || k === null) return;
    anclaPendiente.current = null;
    m.scrollLeft = a.px * k + margenLienzo(k) - a.ax;
    m.scrollTop = a.py * k - a.ay;
  }, [k]);

  /** Salta al nivel de zoom siguiente (+1) o anterior (−1). */
  const pasoZoom = useCallback(
    (direccion, punto) => {
      if (!limites || kActual.current === null) return;
      const kk = kActual.current;
      const { niveles } = limites;
      const destino =
        direccion > 0
          ? niveles.find((v) => v > kk + 1e-3) ?? niveles[niveles.length - 1]
          : [...niveles].reverse().find((v) => v < kk - 1e-3) ?? niveles[0];
      aplicarZoom(destino, punto);
    },
    [limites, aplicarZoom],
  );

  /** Posición de un sitio dentro del marco visible. */
  const puntoDe = (sitio) => {
    const m = marco.current;
    const kk = kActual.current;
    return {
      x: sitio.x * PLANO.ancho * kk + margenLienzo(kk) - m.scrollLeft,
      y: sitio.y * PLANO.alto * kk - m.scrollTop,
    };
  };

  /* ------------------------------------------------------------------------
     Apertura y cierre de la ficha
     ---------------------------------------------------------------------- */
  const cancelarEspera = () => clearTimeout(temporizador.current);

  const cerrar = useCallback(() => {
    clearTimeout(temporizador.current);
    setActivo(null);
    setFijado(false);
  }, []);

  const programarCierre = () => {
    cancelarEspera();
    temporizador.current = setTimeout(() => {
      setActivo(null);
      setFijado(false);
    }, ESPERA_CIERRE);
  };

  const fijar = (id) => {
    cancelarEspera();
    setActivo(id);
    setFijado(true);
    setFoco(id);
  };

  // El foco itinerante siempre apunta a un sitio que coincide con los filtros.
  useEffect(() => {
    if (!navegables.length) return;
    if (!foco || !navegables.some((x) => x.id === foco)) setFoco(navegables[0].id);
  }, [navegables, foco]);

  /* ------------------------------------------------------------------------
     Puntero: hover solo con mouse; tocar y hacer clic fijan la ficha
     ---------------------------------------------------------------------- */
  const sitioDelEvento = (e) => {
    const nodo = e.target.closest?.('[data-id]');
    return nodo ? porId.get(nodo.dataset.id) : null;
  };

  const alEntrar = (e) => {
    if (e.pointerType !== 'mouse' || arrastre.current?.movido) return;
    const sitio = sitioDelEvento(e);
    if (!sitio || fijado) return;
    cancelarEspera();
    // Con una ficha ya abierta, pasar al vecino es inmediato; la primera espera un instante.
    if (activo) setActivo(sitio.id);
    else temporizador.current = setTimeout(() => setActivo(sitio.id), ESPERA_APERTURA);
  };

  const alSalir = (e) => {
    if (e.pointerType !== 'mouse' || fijado) return;
    const hacia = e.relatedTarget;
    if (hacia && (ficha.current?.contains(hacia) || hacia.closest?.('[data-id]'))) return;
    programarCierre();
  };

  const alPulsarSitio = (e) => {
    const sitio = sitioDelEvento(e);
    if (!sitio) return;
    e.stopPropagation();
    if (ignorarClic.current) return;
    // Viendo el barrio entero el sitio es un punto: el toque primero acerca.
    if (kActual.current < K_TOCABLE - 1e-3) {
      aplicarZoom(K_LEGIBLE, puntoDe(sitio));
      fijar(sitio.id);
      return;
    }
    if (activo === sitio.id && fijado) cerrar();
    else fijar(sitio.id);
  };

  const alPulsarFondo = (e) => {
    if (ignorarClic.current || e.target.closest('[data-ficha]')) return;
    if (kActual.current < K_TOCABLE - 1e-3) {
      const r = marco.current.getBoundingClientRect();
      aplicarZoom(K_LEGIBLE, { x: e.clientX - r.left, y: e.clientY - r.top });
      return;
    }
    cerrar();
  };

  /* ------------------------------------------------------------------------
     Arrastrar para desplazar (mouse). El toque ya lo hace el navegador.
     El seguimiento es 1:1 y al soltar el plano sigue con la velocidad del
     gesto, frenando como el desplazamiento del sistema. Un nuevo clic corta el
     deslizamiento en seco: nunca se bloquea la entrada.
     ---------------------------------------------------------------------- */
  const detenerDeslizamiento = () => cancelAnimationFrame(deslizamiento.current);

  const alPresionarMarco = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    detenerDeslizamiento();
    if (e.target.closest('button, a, [data-ficha]')) return;
    const m = marco.current;
    arrastre.current = {
      x: e.clientX,
      y: e.clientY,
      izq: m.scrollLeft,
      arr: m.scrollTop,
      movido: false,
      id: e.pointerId,
      historial: [{ t: performance.now(), x: e.clientX, y: e.clientY }],
    };
  };

  const alMoverMarco = (e) => {
    const a = arrastre.current;
    if (!a || e.pointerId !== a.id) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    if (!a.movido) {
      if (Math.hypot(dx, dy) < UMBRAL_ARRASTRE) return;
      a.movido = true;
      marco.current.setPointerCapture(e.pointerId);
      marco.current.dataset.arrastrando = '';
    }
    marco.current.scrollLeft = a.izq - dx;
    marco.current.scrollTop = a.arr - dy;
    const ahora = performance.now();
    a.historial.push({ t: ahora, x: e.clientX, y: e.clientY });
    while (a.historial.length > 2 && ahora - a.historial[0].t > 100) a.historial.shift();
  };

  const alSoltarMarco = (e) => {
    const a = arrastre.current;
    if (!a || e.pointerId !== a.id) return;
    arrastre.current = null;
    if (!a.movido) return;
    delete marco.current.dataset.arrastrando;
    // El clic que sigue al soltar no debe cerrar la ficha ni acercar.
    ignorarClic.current = true;
    setTimeout(() => {
      ignorarClic.current = false;
    }, 0);

    if (movimientoReducido) return;
    const primero = a.historial[0];
    const ultimo = a.historial[a.historial.length - 1];
    const dt = Math.max(ultimo.t - primero.t, 1);
    let vx = (ultimo.x - primero.x) / dt; // px por ms
    let vy = (ultimo.y - primero.y) / dt;
    let previo = performance.now();
    const paso = (ahora) => {
      const t = Math.min(ahora - previo, 32);
      previo = ahora;
      marco.current.scrollLeft -= vx * t;
      marco.current.scrollTop -= vy * t;
      // Decaimiento exponencial por milisegundo, el de un desplazamiento normal.
      const f = 0.996 ** t;
      vx *= f;
      vy *= f;
      if (Math.hypot(vx, vy) > 0.02) deslizamiento.current = requestAnimationFrame(paso);
    };
    if (Math.hypot(vx, vy) > 0.1) deslizamiento.current = requestAnimationFrame(paso);
  };

  useEffect(() => () => detenerDeslizamiento(), []);

  /* ------------------------------------------------------------------------
     Rueda con Control (y el pellizco del trackpad, que llega así): zoom
     anclado al cursor. La rueda sola sigue desplazando, como en cualquier
     página. React registra `wheel` como pasivo, por eso va con un oyente nativo.
     ---------------------------------------------------------------------- */
  useEffect(() => {
    const m = marco.current;
    const alRodar = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = m.getBoundingClientRect();
      aplicarZoom(kActual.current * Math.exp(-e.deltaY * 0.0025), {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      });
    };
    m.addEventListener('wheel', alRodar, { passive: false });
    return () => m.removeEventListener('wheel', alRodar);
  }, [aplicarZoom]);

  /* ------------------------------------------------------------------------
     Teclado: el plano es una sola parada de tabulador. Dentro, las flechas
     mueven entre sitios por cercanía, Inicio y Fin van a los extremos, Intro
     fija la ficha, Escape la cierra y + / − acercan y alejan.
     ---------------------------------------------------------------------- */
  const enfocar = (id) => {
    setFoco(id);
    setActivo(id);
    setFijado(false);
    botones.current.get(id)?.focus();
  };

  const alTeclear = (e) => {
    const sitio = sitioDelEvento(e);
    if (!sitio) return;
    if (FLECHAS[e.key]) {
      e.preventDefault();
      const destino = vecinoEn(sitio, FLECHAS[e.key], navegables);
      if (destino) enfocar(destino.id);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const destino = e.key === 'Home' ? navegables[0] : navegables[navegables.length - 1];
      if (destino) enfocar(destino.id);
    } else if (e.key === 'Escape') {
      cerrar();
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      pasoZoom(1, puntoDe(sitio));
    } else if (e.key === '-') {
      e.preventDefault();
      pasoZoom(-1, puntoDe(sitio));
    }
  };

  const alEnfocar = (e) => {
    const sitio = sitioDelEvento(e);
    if (!sitio) return;
    cancelarEspera();
    setFoco(sitio.id);
    if (!fijado || activo !== sitio.id) {
      setActivo(sitio.id);
      setFijado(false);
    }
  };

  const alDesenfocar = (e) => {
    const hacia = e.relatedTarget;
    if (hacia && (ficha.current?.contains(hacia) || hacia.closest?.('[data-id]'))) return;
    if (!fijado) cerrar();
  };

  // Escape desde la ficha, y clic fuera del plano con la ficha fijada.
  useEffect(() => {
    if (!activo) return undefined;
    const alTecla = (e) => {
      if (e.key !== 'Escape') return;
      const id = activo;
      cerrar();
      if (ficha.current?.contains(document.activeElement)) botones.current.get(id)?.focus();
    };
    const alTocarFuera = (e) => {
      if (fijado && !marco.current.contains(e.target)) cerrar();
    };
    document.addEventListener('keydown', alTecla);
    document.addEventListener('pointerdown', alTocarFuera);
    return () => {
      document.removeEventListener('keydown', alTecla);
      document.removeEventListener('pointerdown', alTocarFuera);
    };
  }, [activo, fijado, cerrar]);

  /* ------------------------------------------------------------------------
     Ubicación de la ficha: sobre el sitio si cabe en lo visible, si no debajo;
     centrada en el sitio pero sin salirse del marco. Se calcula antes del
     pintado, con la ficha ya medida, así que nunca aparece en otro lugar y
     salta.
     ---------------------------------------------------------------------- */
  useLayoutEffect(() => {
    const m = marco.current;
    const f = ficha.current;
    const sitio = activo ? porId.get(activo) : null;
    if (!sitio || !f || !m || k === null) {
      setPosicion(null);
      return;
    }
    const cx = sitio.x * PLANO.ancho * k;
    const cy = sitio.y * PLANO.alto * k;
    const radio = (DIAMETRO_PLANO * k * 1.2) / 2;
    const ancho = f.offsetWidth;
    const alto = f.offsetHeight;
    // Ventana visible, en coordenadas del lienzo.
    const x0 = m.scrollLeft - margenLienzo(k);
    const y0 = m.scrollTop;
    const arriba = cy - radio - SEPARACION_FICHA - alto;
    const cabeArriba = arriba >= y0 + MARGEN_FICHA;
    const lado = cabeArriba || cy - y0 > m.clientHeight / 2 ? 'arriba' : 'abajo';
    const top = lado === 'arriba' ? arriba : cy + radio + SEPARACION_FICHA;
    const left = acotar(cx - ancho / 2, x0 + MARGEN_FICHA, x0 + m.clientWidth - ancho - MARGEN_FICHA);
    setPosicion({ left, top, lado, flecha: acotar(cx - left, 22, ancho - 22) });
  }, [activo, k, tamano, porId]);

  /* ------------------------------------------------------------------------ */

  const sitioActivo = activo ? porId.get(activo) : null;
  const muestraNumero = k !== null && DIAMETRO_PLANO * k >= DIAMETRO_CON_NUMERO;
  const alejado = k !== null && k < K_TOCABLE - 1e-3;
  const anchoFicha = tamano ? Math.min(288, tamano.ancho - 2 * MARGEN_FICHA) : 288;

  return (
    <div className={s.mapa}>
      <div className={s.zoom} role="group" aria-label="Zoom del plano">
        <button
          type="button"
          className={s.botonZoom}
          onClick={() => pasoZoom(1)}
          disabled={k !== null && k >= K_MAX - 1e-3}
          aria-label="Acercar"
        >
          <Icono nombre="mas" tamano={20} />
        </button>
        <button
          type="button"
          className={s.botonZoom}
          onClick={() => pasoZoom(-1)}
          disabled={!limites || (k !== null && k <= limites.kTodo + 1e-3)}
          aria-label="Alejar"
        >
          <Icono nombre="menos" tamano={20} />
        </button>
        <button
          type="button"
          className={s.botonZoom}
          onClick={() => limites && aplicarZoom(limites.kTodo)}
          disabled={!limites || (k !== null && k <= limites.kTodo + 1e-3)}
          aria-label="Ver el plano completo"
        >
          <Icono nombre="expandir" tamano={18} />
        </button>
      </div>

      <div
        ref={marco}
        className={s.marco}
        onClick={alPulsarFondo}
        onPointerDown={alPresionarMarco}
        onPointerMove={alMoverMarco}
        onPointerUp={alSoltarMarco}
        onPointerCancel={alSoltarMarco}
      >
        {k !== null && (
          <div
            className={s.lienzo}
            style={{ width: PLANO.ancho * k, '--k': k, '--ancho-ficha': `${anchoFicha}px` }}
            data-numeros={muestraNumero ? 'si' : 'no'}
          >
            <img
              src={FOTOS.masterPlan.src}
              width={PLANO.ancho}
              height={PLANO.alto}
              alt="Plano del loteo de Reserva Las Rastras con la numeración de cada sitio"
              className={s.plano}
              draggable={false}
              decoding="async"
            />

            <div
              className={s.capa}
              role="group"
              aria-label="Sitios del plano"
              aria-describedby="ayuda-plano"
              onPointerOver={alEntrar}
              onPointerOut={alSalir}
              onClick={alPulsarSitio}
              onKeyDown={alTeclear}
              onFocus={alEnfocar}
              onBlur={alDesenfocar}
            >
              {sitios.map((sitio) => (
                <Marcador
                  key={sitio.id}
                  sitio={sitio}
                  activo={activo === sitio.id}
                  enFoco={foco === sitio.id}
                  atenuado={!coincide(sitio)}
                  registrar={registrar}
                />
              ))}
            </div>

            {sitioActivo && (
              <FichaSitio
                ref={ficha}
                sitio={sitioActivo}
                fijado={fijado}
                posicion={posicion}
                alCerrar={cerrar}
                onPointerEnter={(e) => e.pointerType === 'mouse' && cancelarEspera()}
                onPointerLeave={(e) => e.pointerType === 'mouse' && !fijado && programarCierre()}
                onBlur={alDesenfocar}
              />
            )}
          </div>
        )}
      </div>

      {alejado && (
        <p className={s.pista} aria-hidden="true">
          Toca el plano para acercarte
        </p>
      )}

      <p id="ayuda-plano" className="soloLector">
        Usa las flechas para moverte entre sitios, Intro para fijar la ficha y Escape para
        cerrarla. Las teclas más y menos acercan y alejan el plano. Los sitios también están
        disponibles como lista.
      </p>
    </div>
  );
}
