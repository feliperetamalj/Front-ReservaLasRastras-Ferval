import { Contenedor, Reveal, Seccion } from '../components/ui';
import { BloqueContacto, BuscadorSitios } from '../components/sections';
import { Encabezado } from './Encabezado';
import { FOTOS, PROYECTO } from '../data/proyecto';
import { RESUMEN } from '../data/sitios';
import { m2Corto } from '../utils/formato';
import s from './MasterPlan.module.css';

export function MasterPlan() {
  return (
    <>
      <Encabezado
        versalita="Master plan"
        titulo="Elige tu sitio"
        bajada={`${RESUMEN.disponibles} de ${RESUMEN.total} sitios siguen disponibles, entre ${m2Corto(
          RESUMEN.m2Min,
        )} y ${m2Corto(RESUMEN.m2Max)} m², repartidos en seis sectores. Todos entregados 100 % urbanizados.`}
      />

      <section className={s.buscadorSeccion}>
        <Contenedor>
          <BuscadorSitios />
        </Contenedor>
      </section>

      <Seccion
        fondo="alterno"
        versalita="Plano del loteo"
        titulo="Cómo se organiza el barrio"
        bajada={`Seis sectores conectados por avenidas amplias, con el portal de acceso sobre Av. Las Rastras. El precio referencial del suelo es de UF ${PROYECTO.precioSueloUF} por m².`}
      >
        <Reveal className={s.plano}>
          <img
            src={FOTOS.masterPlan.src}
            alt="Master plan de Reserva Las Rastras con la numeración de los sitios por sector"
            width={FOTOS.masterPlan.ancho}
            height={FOTOS.masterPlan.alto}
            loading="lazy"
            decoding="async"
            className={s.planoImg}
          />
        </Reveal>
      </Seccion>

      <BloqueContacto
        interes="un sitio en Reserva Las Rastras"
        titulo="¿Te interesa un sitio en particular?"
        bajada="Dinos cuál y te confirmamos disponibilidad, superficie exacta y condiciones de compra."
      />
    </>
  );
}
