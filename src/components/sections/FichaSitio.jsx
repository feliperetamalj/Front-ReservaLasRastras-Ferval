import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Etiqueta, Icono } from '../ui';
import { porSlug } from '../../data/modelos';
import { ESTADOS } from '../../data/sitios';
import { casaCorta, m2 } from '../../utils/formato';
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
  const { casa } = sitio;
  const modelo = casa?.slugModelo ? porSlug(casa.slugModelo) : null;
  const rotuloCasa = sitio.estado === 'vendido' ? 'Casa construida' : 'Se vende con casa';

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

      {/* El texto de la casa es el del listado; el enlace, solo si el modelo es inequívoco. */}
      {casa &&
        (modelo ? (
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
              <span className={s.modeloRotulo}>{rotuloCasa}</span>
              <span className={s.modeloNombre}>{casaCorta(casa.texto)}</span>
              <span className={s.modeloRotulo}>Ver el modelo {modelo.nombre}</span>
            </span>
            <Icono nombre="flecha" tamano={16} className={s.modeloFlecha} />
          </Link>
        ) : (
          <div className={s.modelo}>
            <span className={`${s.miniatura} ${s.iconoCasa}`}>
              <Icono nombre="casa" tamano={22} />
            </span>
            <span className={s.modeloTexto}>
              <span className={s.modeloRotulo}>{rotuloCasa}</span>
              <span className={s.modeloNombre}>{casaCorta(casa.texto)}</span>
            </span>
          </div>
        ))}

      {sitio.estado === 'disponible' && (
        <Link to={`/agendar?sitio=${sitio.id}`} className={s.consultar}>
          <Icono nombre="calendario" tamano={17} />
          Agendar visita
        </Link>
      )}

      {sitio.estado === 'vendido' ? (
        <p className={s.nota}>Este sitio ya fue vendido.</p>
      ) : (
        <a
          // Con la agenda como acción principal, WhatsApp pasa a segundo plano.
          className={`${s.consultar} ${sitio.estado === 'disponible' ? s.secundario : ''}`}
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
