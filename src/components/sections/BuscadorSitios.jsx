import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boton, Etiqueta, Icono } from '../ui';
import { MapaSitios } from './MapaSitios';
import { porSlug } from '../../data/modelos';
import {
  ESTADOS,
  FECHA_DISPONIBILIDAD,
  MACROLOTES,
  POR_SECTOR,
  RESUMEN,
  SITIOS,
} from '../../data/sitios';
import { fechaLarga, m2Corto } from '../../utils/formato';
import { enlaceWhatsApp } from '../../utils/contacto';
import s from './BuscadorSitios.module.css';

/* Tramos de superficie con los que la gente realmente pregunta. */
const TRAMOS = [
  { id: 'todos', texto: 'Cualquier superficie', min: 0, max: Infinity },
  { id: 'chico', texto: 'Hasta 550 m²', min: 0, max: 550 },
  { id: 'medio', texto: '550 – 700 m²', min: 550, max: 700 },
  { id: 'grande', texto: 'Más de 700 m²', min: 700, max: Infinity },
];

const INICIAL = { sector: 'todos', tramo: 'todos', soloDisponibles: true };

/** Cuántos sitios hay en cada estado, para la simbología del plano. */
const CUENTA_POR_ESTADO = {
  disponible: RESUMEN.disponibles,
  reservado: RESUMEN.reservados,
  vendido: RESUMEN.vendidos,
};

const VISTAS = [
  { id: 'plano', texto: 'Plano', icono: 'vistaPlano' },
  { id: 'lista', texto: 'Lista', icono: 'lista' },
];

export function BuscadorSitios() {
  const [filtros, setFiltros] = useState(INICIAL);
  const [vista, setVista] = useState('plano');

  /*
    Un solo criterio para las dos vistas. En la lista decide qué se muestra;
    en el plano, qué se resalta. Memorizado porque el plano lo usa para
    decidir cuáles de sus 184 marcadores se repintan.
  */
  const coincide = useCallback(
    (sitio) => {
      const tramo = TRAMOS.find((t) => t.id === filtros.tramo);
      return (
        (filtros.sector === 'todos' || sitio.sector === filtros.sector) &&
        sitio.m2 >= tramo.min &&
        sitio.m2 < tramo.max &&
        (!filtros.soloDisponibles || sitio.estado === 'disponible')
      );
    },
    [filtros],
  );

  const resultados = useMemo(() => SITIOS.filter(coincide), [coincide]);
  // Los macrolotes no están en el plano: solo aparecen en la lista, con los mismos filtros.
  const macrolotes = useMemo(() => MACROLOTES.filter(coincide), [coincide]);

  const cambiar = (clave, valor) => setFiltros((f) => ({ ...f, [clave]: valor }));
  const limpiar = () => setFiltros(INICIAL);
  const hayFiltros = filtros.sector !== 'todos' || filtros.tramo !== 'todos';

  return (
    <div className={s.buscador}>
      <div className={s.controles}>
        <fieldset className={s.grupo}>
          <legend className={`versalita ${s.leyenda}`}>Sector</legend>
          {/* Las pastillas se reflotan; nunca quedan recortadas en una fila. */}
          <div className={s.pastillas}>
            <button
              type="button"
              className={`${s.pastilla} ${filtros.sector === 'todos' ? s.activa : ''}`}
              onClick={() => cambiar('sector', 'todos')}
              aria-pressed={filtros.sector === 'todos'}
            >
              Todos
              <span className={`${s.cuenta} tabular`}>{RESUMEN.disponibles}</span>
            </button>
            {POR_SECTOR.map((sec) => (
              <button
                key={sec.sector}
                type="button"
                className={`${s.pastilla} ${filtros.sector === sec.sector ? s.activa : ''}`}
                onClick={() => cambiar('sector', sec.sector)}
                aria-pressed={filtros.sector === sec.sector}
                aria-label={`Sector ${sec.sector}: ${sec.disponibles} ${
                  sec.disponibles === 1 ? 'sitio disponible' : 'sitios disponibles'
                } de ${sec.total}`}
              >
                Sector {sec.sector}
                <span className={`${s.cuenta} tabular`}>{sec.disponibles}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className={s.finos}>
          <div className={s.grupoSelect}>
            <label className={`versalita ${s.leyenda}`} htmlFor="tramo">
              Superficie
            </label>
            <select
              id="tramo"
              className={s.select}
              value={filtros.tramo}
              onChange={(e) => cambiar('tramo', e.target.value)}
            >
              {TRAMOS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.texto}
                </option>
              ))}
            </select>
          </div>

          <label className={s.interruptor}>
            <input
              type="checkbox"
              className={s.casilla}
              checked={filtros.soloDisponibles}
              onChange={(e) => cambiar('soloDisponibles', e.target.checked)}
            />
            <span>Solo disponibles</span>
          </label>
        </div>
      </div>

      <div className={s.barraResultados}>
        <p className={s.cuentaResultados} role="status">
          <strong className="tabular">{resultados.length}</strong>{' '}
          {resultados.length === 1 ? 'sitio' : 'sitios'}
          {vista === 'lista' &&
            macrolotes.length > 0 &&
            ` y ${macrolotes.length} ${macrolotes.length === 1 ? 'macrolote' : 'macrolotes'}`}
          {hayFiltros && ' con estos filtros'}
        </p>

        {hayFiltros && (
          <button type="button" className={s.limpiar} onClick={limpiar}>
            <Icono nombre="cerrar" tamano={14} />
            Quitar filtros
          </button>
        )}

        <div className={s.vistas} role="group" aria-label="Cómo ver los sitios">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`${s.vista} ${vista === v.id ? s.vistaActiva : ''}`}
              onClick={() => setVista(v.id)}
              aria-pressed={vista === v.id}
            >
              <Icono nombre={v.icono} tamano={17} />
              {v.texto}
            </button>
          ))}
        </div>
      </div>

      {vista === 'plano' ? (
        <>
          <ul className={s.simbologia} aria-label="Simbología del plano">
            {Object.entries(ESTADOS).map(([estado, texto]) => (
              <li key={estado} className={s.simbolo}>
                <span className={s.muestra} data-estado={estado} aria-hidden="true" />
                {texto}
                <span className={`${s.simboloCuenta} tabular`}>{CUENTA_POR_ESTADO[estado]}</span>
              </li>
            ))}
          </ul>
          <MapaSitios sitios={SITIOS} coincide={coincide} />
          {resultados.length === 0 && (
            <p className={s.avisoVacio}>
              Ningún sitio coincide con estos filtros: en el plano todos quedan atenuados.{' '}
              <button type="button" className={s.enlaceBoton} onClick={limpiar}>
                Quitar filtros
              </button>
            </p>
          )}
        </>
      ) : resultados.length + macrolotes.length > 0 ? (
        <>
          <ul className={s.grilla}>
            {resultados.map((sitio) => {
              const modelo = sitio.modelo ? porSlug(sitio.modelo) : null;
              return (
                <li key={sitio.id} className={`${s.sitio} ${s[sitio.estado]}`}>
                  <div className={s.sitioCabecera}>
                    <span className={s.sitioId}>{sitio.id}</span>
                    <Etiqueta tono={sitio.estado}>{ESTADOS[sitio.estado]}</Etiqueta>
                  </div>
                  <p className={`${s.sitioM2} tabular`}>
                    {m2Corto(sitio.m2)} <span className={s.sitioUnidad}>m²</span>
                  </p>
                  {modelo && (
                    <Link to={`/modelos/${modelo.slug}`} className={s.sitioModelo}>
                      Casa modelo {modelo.nombre}
                    </Link>
                  )}
                  {sitio.estado !== 'vendido' && (
                    <a
                      className={s.consultar}
                      href={enlaceWhatsApp(
                        sitio.estado === 'reservado'
                          ? `Hola, el sitio ${sitio.id} de Reserva Las Rastras aparece reservado. ¿Me avisan si se libera?`
                          : `Hola, me interesa el sitio ${sitio.id} de Reserva Las Rastras (${m2Corto(
                              sitio.m2,
                            )} m²). ¿Sigue disponible?`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sitio.estado === 'reservado' ? 'Preguntar' : 'Consultar'}
                      <Icono nombre="flecha" tamano={14} />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {macrolotes.length > 0 && (
            <div className={s.macrolotes}>
              <h3 className={`versalita ${s.leyenda}`}>Macrolotes</h3>
              <p className={s.macrolotesTexto}>
                Terrenos de mayor superficie que no forman parte del plano de sitios del loteo.
              </p>
              <ul className={s.grilla}>
                {macrolotes.map((lote) => (
                  <li key={lote.id} className={`${s.sitio} ${s.macrolote}`}>
                    <div className={s.sitioCabecera}>
                      <span className={s.sitioId}>{lote.id}</span>
                      <Etiqueta tono="macrolote">Macrolote</Etiqueta>
                    </div>
                    <p className={`${s.sitioM2} tabular`}>
                      {m2Corto(lote.m2)} <span className={s.sitioUnidad}>m²</span>
                    </p>
                    <a
                      className={s.consultar}
                      href={enlaceWhatsApp(
                        `Hola, me interesa el macrolote ${lote.id} de Reserva Las Rastras (${m2Corto(
                          lote.m2,
                        )} m²). ¿Me pueden dar más información?`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consultar
                      <Icono nombre="flecha" tamano={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className={s.vacio}>
          <Icono nombre="lupa" tamano={30} className={s.iconoVacio} />
          <h3 className={s.tituloVacio}>Ningún sitio con esos filtros</h3>
          <p className={s.textoVacio}>
            {filtros.soloDisponibles
              ? 'Prueba con otro sector o incluye los sitios reservados y vendidos para ver el loteo completo.'
              : 'Prueba ampliando el rango de superficie o cambiando de sector.'}
          </p>
          <Boton variante="contorno" tamano="medio" onClick={limpiar}>
            Ver todos los sitios
          </Boton>
        </div>
      )}

      <p className={s.aviso}>
        Disponibilidad al {fechaLarga(FECHA_DISPONIBILIDAD)}, según el listado publicado por el
        proyecto. Confírmala con la sala de ventas antes de reservar.
      </p>
    </div>
  );
}
