import { Boton, Icono } from '../ui';
import { FOTOS, PROYECTO } from '../../data/proyecto';
import { RESUMEN } from '../../data/sitios';
import { RANGOS } from '../../data/modelos';
import { m2Corto } from '../../utils/formato';
import s from './Hero.module.css';

export function Hero() {
  return (
    <section className={`${s.hero} enOscuro`}>
      <img
        src={FOTOS.portal.src}
        srcSet={FOTOS.portal.srcSet}
        sizes="100vw"
        alt="Portal de acceso de Reserva Las Rastras sobre Av. Las Rastras, Talca"
        className={s.foto}
        fetchPriority="high"
        decoding="async"
      />
      <div className={s.velo} />

      <div className={s.contenido}>
        <p className={`versalita ${s.versalita}`}>
          {PROYECTO.bajada} · {PROYECTO.comuna}
        </p>

        {/*
          Sin <br>: al ocultarlo en móvil las palabras quedarían pegadas. Dos
          spans en bloque con un espacio real entre ellos hacen lo mismo y se
          reflotan bien al pasar a una sola línea.
        */}
        <h1 className={s.titular}>
          <span className={s.linea}>Un barrio pensado</span>{' '}
          <span className={s.linea}>antes de ser construido</span>
        </h1>

        <p className={s.bajada}>{PROYECTO.resumen}</p>

        <div className={s.acciones}>
          <Boton a="/modelos" variante="primario" tamano="grande" icono="flecha">
            Ver los modelos
          </Boton>
          <Boton a="/master-plan" variante="contornoClaro" tamano="grande">
            Sitios disponibles
          </Boton>
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
            <dd className={`${s.cifraValor} tabular`}>{RANGOS.m2Min}–{RANGOS.m2Max} <span className={s.unidad}>m²</span></dd>
          </div>
        </dl>
      </div>

      <a href="#siguiente" className={s.bajar} aria-label="Ir al contenido">
        <Icono nombre="abajo" tamano={20} />
      </a>
    </section>
  );
}
