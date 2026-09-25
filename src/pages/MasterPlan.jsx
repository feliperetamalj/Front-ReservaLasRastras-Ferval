import { Contenedor } from '../components/ui';
import { BloqueContacto, BuscadorSitios } from '../components/sections';
import { Encabezado } from './Encabezado';
import { PROYECTO } from '../data/proyecto';
import { RESUMEN } from '../data/sitios';
import { enPalabras, m2Corto } from '../utils/formato';
import s from './MasterPlan.module.css';

/** 5.2 -> "5,2": las cifras van en convención chilena también dentro de una frase. */
const ufSuelo = new Intl.NumberFormat('es-CL').format(PROYECTO.precioSueloUF);

export function MasterPlan() {
  return (
    <>
      <Encabezado
        versalita="Master plan"
        titulo="Elige tu sitio"
        bajada={`${RESUMEN.disponibles} de ${RESUMEN.total} sitios siguen disponibles, entre ${m2Corto(
          RESUMEN.m2Min,
        )} y ${m2Corto(RESUMEN.m2Max)} m², repartidos en ${enPalabras(
          RESUMEN.sectores,
        )} sectores. Pasa el cursor o toca cada sitio del plano para ver su superficie y su estado.`}
      />

      <section className={s.buscadorSeccion} aria-labelledby="titulo-buscador">
        <Contenedor>
          <h2 id="titulo-buscador" className="soloLector">
            Buscador de sitios
          </h2>
          <BuscadorSitios />
          <p className={s.nota}>
            Todos los sitios se entregan 100 % urbanizados. Valor referencial del suelo publicado
            por el proyecto: UF {ufSuelo} por m²; el precio de cada sitio lo confirma la sala de
            ventas.
          </p>
        </Contenedor>
      </section>

      <BloqueContacto
        interes="un sitio en Reserva Las Rastras"
        titulo="¿Te interesa un sitio en particular?"
        bajada="Dinos cuál y te confirmamos disponibilidad, superficie exacta y condiciones de compra."
      />
    </>
  );
}
