import { useMemo, useState } from 'react';
import { Boton, Etiqueta, Icono } from '../ui';
import { POR_SECTOR, RESUMEN, SITIOS } from '../../data/sitios';
import { m2Corto } from '../../utils/formato';
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

export function BuscadorSitios() {
  const [filtros, setFiltros] = useState(INICIAL);

  const resultados = useMemo(() => {
    const tramo = TRAMOS.find((t) => t.id === filtros.tramo);
    return SITIOS.filter(
      (sitio) =>
        (filtros.sector === 'todos' || sitio.sector === filtros.sector) &&
        sitio.m2 >= tramo.min &&
        sitio.m2 < tramo.max &&
        (!filtros.soloDisponibles || sitio.disponible),
    );
  }, [filtros]);

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
          {hayFiltros && ' con estos filtros'}
        </p>
        {hayFiltros && (
          <button type="button" className={s.limpiar} onClick={limpiar}>
            <Icono nombre="cerrar" tamano={14} />
            Quitar filtros
          </button>
        )}
      </div>

      {resultados.length > 0 ? (
        <ul className={s.grilla}>
          {resultados.map((sitio) => (
            <li key={sitio.id} className={`${s.sitio} ${sitio.disponible ? '' : s.noDisponible}`}>
              <div className={s.sitioCabecera}>
                <span className={s.sitioId}>{sitio.id}</span>
                <Etiqueta tono={sitio.disponible ? 'disponible' : 'vendido'}>
                  {sitio.disponible ? 'Disponible' : 'Vendido'}
                </Etiqueta>
              </div>
              <p className={`${s.sitioM2} tabular`}>
                {m2Corto(sitio.m2)} <span className={s.sitioUnidad}>m²</span>
              </p>
              {sitio.disponible && (
                <a
                  className={s.consultar}
                  href={enlaceWhatsApp(
                    `Hola, me interesa el sitio ${sitio.id} de Reserva Las Rastras (${m2Corto(
                      sitio.m2,
                    )} m²). ¿Sigue disponible?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar
                  <Icono nombre="flecha" tamano={14} />
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className={s.vacio}>
          <Icono nombre="lupa" tamano={30} className={s.iconoVacio} />
          <h3 className={s.tituloVacio}>Ningún sitio con esos filtros</h3>
          <p className={s.textoVacio}>
            {filtros.soloDisponibles
              ? 'Prueba con otro sector o incluye los sitios ya vendidos para ver el loteo completo.'
              : 'Prueba ampliando el rango de superficie o cambiando de sector.'}
          </p>
          <Boton variante="contorno" tamano="medio" onClick={limpiar}>
            Ver todos los sitios
          </Boton>
        </div>
      )}

      <p className={s.aviso}>
        Disponibilidad al 8 de septiembre de 2026, según el master plan publicado por el proyecto.
        Confírmala con la sala de ventas antes de reservar.
      </p>
    </div>
  );
}
