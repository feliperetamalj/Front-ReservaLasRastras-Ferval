import { useMemo, useState } from 'react';
import { Contenedor, Icono, Reveal } from '../components/ui';
import { BloqueContacto, ModeloCard } from '../components/sections';
import { Encabezado } from './Encabezado';
import { modelos, RANGOS } from '../data/modelos';
import { uf } from '../utils/formato';
import s from './Modelos.module.css';

const ESTILOS = ['Todos', 'Mediterránea', 'Colonial'];
const NIVELES = [
  { id: 'todos', texto: 'Todos' },
  { id: '1', texto: 'Un piso' },
  { id: '2', texto: 'Dos pisos' },
];

export function Modelos() {
  const [estilo, setEstilo] = useState('Todos');
  const [nivel, setNivel] = useState('todos');

  const resultados = useMemo(
    () =>
      modelos.filter(
        (m) =>
          (estilo === 'Todos' || m.estilo === estilo) &&
          (nivel === 'todos' || String(m.pisos) === nivel),
      ),
    [estilo, nivel],
  );

  const hayFiltros = estilo !== 'Todos' || nivel !== 'todos';
  const limpiar = () => {
    setEstilo('Todos');
    setNivel('todos');
  };

  return (
    <>
      <Encabezado
        versalita="Modelos de casa"
        titulo="Seis casas, dos lenguajes"
        bajada={`De ${RANGOS.m2Min} a ${RANGOS.m2Max} m², con ${RANGOS.dormMin} a ${RANGOS.dormMax} dormitorios, desde ${uf(RANGOS.ufMin)}. Todas se construyen dentro del barrio, sobre el sitio que elijas.`}
      />

      <section className={s.catalogo}>
        <Contenedor>
          <div className={s.filtros}>
            <div className={s.grupo}>
              <span className={`versalita ${s.leyenda}`}>Estilo</span>
              <div className={s.pastillas}>
                {ESTILOS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={`${s.pastilla} ${estilo === e ? s.activa : ''}`}
                    onClick={() => setEstilo(e)}
                    aria-pressed={estilo === e}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.grupo}>
              <span className={`versalita ${s.leyenda}`}>Niveles</span>
              <div className={s.pastillas}>
                {NIVELES.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`${s.pastilla} ${nivel === n.id ? s.activa : ''}`}
                    onClick={() => setNivel(n.id)}
                    aria-pressed={nivel === n.id}
                  >
                    {n.texto}
                  </button>
                ))}
              </div>
            </div>

            <p className={s.cuenta} role="status">
              <strong className="tabular">{resultados.length}</strong>{' '}
              {resultados.length === 1 ? 'modelo' : 'modelos'}
            </p>
          </div>

          {resultados.length > 0 ? (
            <div className={s.grilla}>
              {resultados.map((m, i) => (
                <Reveal key={m.slug} retraso={i * 60}>
                  <ModeloCard modelo={m} prioridad={i < 2} nivel={2} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className={s.vacio}>
              <Icono nombre="lupa" tamano={30} className={s.iconoVacio} />
              <h2 className={s.tituloVacio}>No hay modelos con esa combinación</h2>
              <p className={s.textoVacio}>
                No tenemos un modelo {estilo.toLowerCase()} de{' '}
                {nivel === '1' ? 'un piso' : 'dos pisos'}. Puedes ver los seis modelos y comparar.
              </p>
              <button type="button" className={s.limpiar} onClick={limpiar}>
                Ver los seis modelos
              </button>
            </div>
          )}

          {hayFiltros && resultados.length > 0 && (
            <button type="button" className={s.limpiarBajo} onClick={limpiar}>
              <Icono nombre="cerrar" tamano={14} />
              Quitar filtros
            </button>
          )}
        </Contenedor>
      </section>

      <BloqueContacto
        titulo="¿Cuál te acomoda más?"
        bajada="Cuéntanos cuántos dormitorios necesitas y en qué sector te gustaría, y te preparamos una cotización."
      />
    </>
  );
}
