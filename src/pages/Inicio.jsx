import { Link } from 'react-router-dom';
import { Boton, Contenedor, Reveal, Seccion } from '../components/ui';
import { Atributos, BloqueContacto, Carrusel, Hero, ModeloCard } from '../components/sections';
import { modelos, RANGOS } from '../data/modelos';
import { FOTOS, GALERIA_BARRIO, ENTORNO, PROYECTO } from '../data/proyecto';
import { RESUMEN } from '../data/sitios';
import { m2Corto, uf } from '../utils/formato';
import s from './Inicio.module.css';

/* Los tres modelos con precio publicado abren el catálogo; el resto va en la
   página de modelos. Primero lo que se puede cotizar. */
const DESTACADOS = [...modelos].sort((a, b) => (b.uf ? 1 : 0) - (a.uf ? 1 : 0)).slice(0, 3);

export function Inicio() {
  return (
    <>
      <Hero />

      <Atributos fondo="papel" />

      {/* Catálogo antes que discurso: quien llega quiere ver casas. */}
      <Seccion
        fondo="blanco"
        versalita="Modelos de casa"
        titulo="Seis casas, dos lenguajes"
        bajada={`Estilo mediterráneo y colonial, de ${RANGOS.m2Min} a ${RANGOS.m2Max} m², desde ${uf(RANGOS.ufMin)}.`}
        acciones={
          <Boton a="/modelos" variante="contorno" tamano="medio" icono="flecha">
            Ver los seis modelos
          </Boton>
        }
      >
        <div className={s.modelos}>
          {DESTACADOS.map((m, i) => (
            <Reveal key={m.slug} retraso={i * 80}>
              <ModeloCard modelo={m} prioridad={i === 0} />
            </Reveal>
          ))}
        </div>
      </Seccion>

      {/* Master plan */}
      <Seccion fondo="tinta" compacta>
        <div className={s.plano}>
          <Reveal className={s.planoTexto}>
            <p className="versalita">Master plan</p>
            <h2 className={s.planoTitulo}>
              {RESUMEN.disponibles} sitios urbanizados, de {m2Corto(RESUMEN.m2Min)} a{' '}
              {m2Corto(RESUMEN.m2Max)} m²
            </h2>
            <p className={s.planoBajada}>
              Seis sectores conectados por avenidas amplias. Puedes filtrar por sector y
              superficie, y ver cuáles siguen disponibles antes de venir a la sala de ventas.
            </p>
            <Boton a="/master-plan" variante="primario" tamano="grande" icono="flecha">
              Buscar un sitio
            </Boton>
          </Reveal>

          <Reveal className={s.planoFoto} retraso={100}>
            <Link to="/master-plan" className={s.planoEnlace}>
              <img
                src={FOTOS.emplazamiento.src}
                alt="Plano de emplazamiento de Reserva Las Rastras"
                width={FOTOS.emplazamiento.ancho}
                height={FOTOS.emplazamiento.alto}
                loading="lazy"
                decoding="async"
              />
            </Link>
          </Reveal>
        </div>
      </Seccion>

      {/* El barrio en imágenes */}
      <Seccion
        fondo="papel"
        versalita="El barrio"
        titulo="Construido, no proyectado"
        bajada="El portal, las avenidas y las áreas verdes ya existen. Estas son imágenes del barrio tal como se recorre hoy."
        acciones={
          <Boton a="/el-barrio" variante="enlace" icono="flecha">
            Por qué vivir aquí
          </Boton>
        }
      >
        <Carrusel imagenes={GALERIA_BARRIO} etiqueta="El barrio de Reserva Las Rastras" />
      </Seccion>

      {/* Entorno */}
      <Seccion fondo="alterno" compacta>
        <Contenedor ancho="texto" className={s.entorno}>
          <p className={`versalita ${s.entornoVersalita}`}>Ubicación</p>
          <h2 className={s.entornoTitulo}>
            En el sector de mayor plusvalía de {PROYECTO.comuna}
          </h2>
          <p className={s.entornoTexto}>
            Acceso directo desde Av. Las Rastras, a veinte minutos del centro de {PROYECTO.comuna} y
            a pocos metros del eje comercial del sector oriente.
          </p>
          <ul className={s.servicios}>
            {ENTORNO.map((e) => (
              <li key={e} className={s.servicio}>
                {e}
              </li>
            ))}
          </ul>
        </Contenedor>
      </Seccion>

      <BloqueContacto />
    </>
  );
}
