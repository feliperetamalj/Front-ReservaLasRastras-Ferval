import { useCallback, useEffect, useRef, useState } from 'react';
import { Icono } from '../ui';
import { Visor } from './Visor';
import { useMovimientoReducido } from '../../hooks';
import s from './Carrusel.module.css';

/**
 * Carrusel de fotografías.
 *
 * El desplazamiento lo hace el navegador, no JavaScript: una pista con
 * `overflow-x: auto` y `scroll-snap`. Eso entrega gratis el seguimiento 1:1 del
 * dedo, la inercia real del sistema, la interrupción a media animación y el
 * teclado — exactamente lo que costaría reimplementar con física propia, y
 * mejor hecho. JavaScript solo lee la posición para saber qué diapositiva está
 * al centro y mueve la pista cuando se pulsan los controles.
 */
export function Carrusel({ imagenes, etiqueta = 'Galería del barrio' }) {
  const pista = useRef(null);
  const [activa, setActiva] = useState(0);
  const [indiceVisor, setIndiceVisor] = useState(null);
  const movimientoReducido = useMovimientoReducido();

  /**
   * Distancia, en píxeles, entre el centro de una diapositiva y el de la pista.
   *
   * Se mide con `getBoundingClientRect`, no con `offsetLeft`: este último se
   * cuenta desde el ancestro posicionado más cercano, que no tiene por qué ser
   * la pista. Cuando no lo es, todas las medidas quedan corridas por la misma
   * cantidad y el carrusel salta a la diapositiva vecina. Las medidas relativas
   * a la pista no dependen de dónde esté ese ancestro.
   */
  const desviacion = (hijo, nodo) => {
    const pistaRect = nodo.getBoundingClientRect();
    const hijoRect = hijo.getBoundingClientRect();
    return hijoRect.left + hijoRect.width / 2 - (pistaRect.left + pistaRect.width / 2);
  };

  /** Lee del DOM cuál es la diapositiva más cercana al centro de la pista. */
  const medir = useCallback(() => {
    const nodo = pista.current;
    if (!nodo) return;
    let mejor = 0;
    let menorDistancia = Infinity;
    [...nodo.children].forEach((hijo, i) => {
      const distancia = Math.abs(desviacion(hijo, nodo));
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        mejor = i;
      }
    });
    setActiva(mejor);
  }, []);

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo) return undefined;

    /*
      Se mide directo en el oyente, sin envolverlo en requestAnimationFrame.
      Son cinco lecturas de rect y ninguna escritura, así que no hay
      reflujo que amortiguar; envolverlo solo añadía un modo de fallo — si
      rAF está suspendido, el indicador se congela aunque la pista sí se
      esté moviendo.
    */
    medir();
    nodo.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      nodo.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, [medir]);

  /** Centra una diapositiva en la pista, desplazando por diferencia. */
  const irA = useCallback(
    (i) => {
      const nodo = pista.current;
      const destino = nodo?.children[i];
      if (!nodo || !destino) return;
      nodo.scrollBy({
        left: desviacion(destino, nodo),
        behavior: movimientoReducido ? 'instant' : 'smooth',
      });
    },
    [movimientoReducido],
  );

  const mover = (paso) => irA(Math.min(Math.max(activa + paso, 0), imagenes.length - 1));

  if (!imagenes?.length) return null;

  return (
    <div className={s.carrusel}>
      <div
        className={s.pista}
        ref={pista}
        role="group"
        aria-roledescription="carrusel"
        aria-label={etiqueta}
        tabIndex={0}
      >
        {imagenes.map((img, i) => (
          <figure
            className={s.diapositiva}
            key={img.src}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${imagenes.length}`}
          >
            <button
              type="button"
              className={s.marco}
              onClick={() => setIndiceVisor(i)}
              aria-label={`Ampliar: ${img.alt}`}
              /* Las diapositivas fuera de pantalla no reciben el tabulador:
                 se llega a ellas con los controles, no tabulando a ciegas. */
              tabIndex={i === activa ? 0 : -1}
            >
              <img
                src={img.src}
                srcSet={img.srcSet}
                sizes="(min-width: 1020px) 68vw, 92vw"
                alt={img.alt}
                className={s.foto}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className={s.lupa} aria-hidden="true">
                <Icono nombre="expandir" tamano={18} />
              </span>
            </button>
            <figcaption className={s.pie}>{img.alt}</figcaption>
          </figure>
        ))}
      </div>

      {/*
        Los puntos mapean la posición y van a la izquierda; las dos flechas son
        un par y se mantienen juntas a la derecha, con el contador al medio.
        Separarlas —una a cada extremo— rompe la relación entre dos controles
        que hacen lo mismo en sentidos opuestos.
      */}
      <div className={s.controles}>
        <div className={s.puntos}>
          {imagenes.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`${s.punto} ${i === activa ? s.puntoActivo : ''}`}
              onClick={() => irA(i)}
              aria-label={`Ir a la foto ${i + 1} de ${imagenes.length}`}
              aria-current={i === activa ? 'true' : undefined}
            >
              <span className={s.marca} aria-hidden="true" />
            </button>
          ))}
        </div>

        <p className={`${s.contador} tabular`} aria-live="polite">
          {activa + 1} / {imagenes.length}
        </p>

        <div className={s.flechas}>
          <button
            type="button"
            className={s.flecha}
            onClick={() => mover(-1)}
            disabled={activa === 0}
            aria-label="Foto anterior"
          >
            <Icono nombre="flechaIzq" tamano={20} />
          </button>
          <button
            type="button"
            className={s.flecha}
            onClick={() => mover(1)}
            disabled={activa === imagenes.length - 1}
            aria-label="Foto siguiente"
          >
            <Icono nombre="flecha" tamano={20} />
          </button>
        </div>
      </div>

      <Visor
        imagenes={imagenes}
        indice={indiceVisor}
        alCambiar={setIndiceVisor}
        alCerrar={() => {
          // Al cerrar, la pista queda donde el visor dejó al usuario.
          if (indiceVisor !== null) irA(indiceVisor);
          setIndiceVisor(null);
        }}
      />
    </div>
  );
}
