import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Etiqueta, Icono } from '../ui';
import { porSlug } from '../../data/modelos';
import { ESTADOS } from '../../data/sitios';
import { m2 } from '../../utils/formato';
import { enlaceWhatsApp } from '../../utils/contacto';
import s from './FichaSitio.module.css';

/** Mensaje de WhatsApp según el estado: no se pregunta lo mismo por un sitio reservado. */
const mensaje = (sitio) =>
  sitio.estado === 'reservado'
    ? `Hola, el sitio ${sitio.id} de Reserva Las Rastras (${m2(sitio.m2)}) aparece reservado. ¿Me avisan si se libera?`
    : `Hola, me interesa el sitio ${sitio.id} de Reserva Las Rastras (${m2(sitio.m2)}). ¿Sigue disponible?`;

/**
 * Ficha flotante de un sitio. Nace del marcador que la abrió: su punto de
 * origen para la animación es la flecha, así que crece desde el sitio y vuelve
 * a él.
 */
export const FichaSitio = forwardRef(function FichaSitio(
  { sitio, fijado, posicion, alCerrar, ...resto },
  ref,
) {
  const modelo = sitio.modelo ? porSlug(sitio.modelo) : null;

  return (
    <div
      ref={ref}
      id="ficha-sitio"
      className={`${s.ficha} ${posicion ? s[posicion.lado] : s.midiendo}`}
      style={
        posicion
          ? { left: posicion.left, top: posicion.top, '--flecha': `${posicion.flecha}px` }
          : undefined
      }
      data-ficha
      {...resto}
    >
      <span className={s.flecha} aria-hidden="true" />

      <div className={s.cabecera}>
        <p className={`versalita ${s.sector}`}>Sector {sitio.sector}</p>
        <div className={s.tituloFila}>
          <p className={s.titulo}>Sitio {sitio.id}</p>
          <Etiqueta tono={sitio.estado}>{ESTADOS[sitio.estado]}</Etiqueta>
        </div>
      </div>

      <dl className={s.datos}>
        <dt className={s.rotulo}>Superficie</dt>
        <dd className={`${s.valor} tabular`}>{m2(sitio.m2)}</dd>
      </dl>

      {modelo && (
        <Link to={`/modelos/${modelo.slug}`} className={s.modelo}>
          <img
            src={modelo.hero}
            srcSet={modelo.heroSrcSet}
            sizes="64px"
            alt=""
            className={s.miniatura}
            loading="lazy"
            decoding="async"
          />
          <span className={s.modeloTexto}>
            <span className={s.modeloRotulo}>Casa modelo</span>
            <span className={s.modeloNombre}>{modelo.nombre}</span>
          </span>
          <Icono nombre="flecha" tamano={16} className={s.modeloFlecha} />
        </Link>
      )}

      {sitio.estado === 'vendido' ? (
        <p className={s.nota}>Este sitio ya fue vendido.</p>
      ) : (
        <a
          className={s.consultar}
          href={enlaceWhatsApp(mensaje(sitio))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icono nombre="whatsapp" tamano={17} />
          {sitio.estado === 'reservado' ? 'Preguntar si se libera' : 'Consultar por este sitio'}
        </a>
      )}

      {fijado && (
        <button type="button" className={s.cerrar} onClick={alCerrar} aria-label="Cerrar ficha">
          <Icono nombre="cerrar" tamano={16} />
        </button>
      )}
    </div>
  );
});
