import { Boton } from '../ui';
import { FOTOS, PROYECTO } from '../../data/proyecto';
import { RESUMEN } from '../../data/sitios';
import { RANGOS } from '../../data/modelos';
import { m2Corto } from '../../utils/formato';
import { whatsAppDirecto } from '../../utils/contacto';
import s from './Hero.module.css';

/**
 * Portada. La foto real del acceso es la protagonista: se ve a plena luz y el
 * texto vive abajo, sobre la parte oscura de la imagen, en vez de apagar toda
 * la foto con un velo para poder leer encima.
 */
export function Hero() {
  return (
    <section className={`${s.hero} enOscuro`} aria-labelledby="titulo-portada">
      <picture className={s.media}>
        {/* Bajo 640 px, la versión vertical: el portal queda arriba y el pasto abajo, bajo el texto. */}
        <source
          media="(max-width: 640px)"
          srcSet={FOTOS.portadaMovil.srcSet}
          sizes="100vw"
          width={FOTOS.portadaMovil.ancho}
          height={FOTOS.portadaMovil.alto}
        />
        <img
          src={FOTOS.portada.src}
          srcSet={FOTOS.portada.srcSet}
          sizes="100vw"
          width={FOTOS.portada.ancho}
          height={FOTOS.portada.alto}
          alt="Portal de acceso de Reserva Las Rastras, en Talca"
          className={s.foto}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className={s.velo} aria-hidden="true" />

      <div className={s.contenido}>
        <div className={s.cabeza}>
          <p className={`versalita ${s.versalita}`}>
            {PROYECTO.bajada} · {PROYECTO.comuna}
          </p>

          {/*
            Sin <br>: al ocultarlo en móvil las palabras quedarían pegadas. Dos
            spans en bloque con un espacio real entre ellos hacen lo mismo y se
            reflotan bien al pasar a una sola línea.
          */}
          <h1 id="titulo-portada" className={s.titular}>
            <span className={s.linea}>Un barrio pensado</span>{' '}
            <span className={`${s.linea} ${s.acento}`}>antes de ser construido</span>
          </h1>
        </div>

        <div className={s.cuerpo}>
          <p className={s.bajada}>{PROYECTO.resumen}</p>

          <div className={s.acciones}>
            <Boton a="/master-plan" variante="primario" tamano="grande">
              Sitios disponibles
            </Boton>
            <Boton
              href={whatsAppDirecto('agendar una visita a Reserva Las Rastras')}
              variante="contornoClaro"
              tamano="grande"
            >
              Agendar visita
            </Boton>
          </div>
        </div>

        <dl className={s.cifras}>
          <div className={s.cifra}>
            <dt className={s.cifraRotulo}>Sitios disponibles</dt>
            <dd className={`${s.cifraValor} tabular`}>{RESUMEN.disponibles}</dd>
          </div>
          <div className={s.cifra}>
            <dt className={s.cifraRotulo}>Superficie de sitio</dt>
            <dd className={`${s.cifraValor} tabular`}>
              {m2Corto(RESUMEN.m2Min)}–{m2Corto(RESUMEN.m2Max)} <span className={s.unidad}>m²</span>
            </dd>
          </div>
          <div className={s.cifra}>
            <dt className={s.cifraRotulo}>Modelos de casa</dt>
            <dd className={`${s.cifraValor} tabular`}>
              {RANGOS.m2Min}–{m2Corto(RANGOS.m2Max)} <span className={s.unidad}>m²</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
