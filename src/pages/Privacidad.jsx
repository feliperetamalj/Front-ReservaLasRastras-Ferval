import { Fragment } from "react";
import { Contenedor } from "../components/ui";
import { Encabezado } from "./Encabezado";
import { POLITICA, SECCIONES } from "../data/privacidad";
import { fechaLarga } from "../utils/formato";
import s from "./Privacidad.module.css";

/** Resalta los [COMPLETAR: …] para que nadie publique la política sin llenarlos. */
const conPendientes = (texto) =>
  texto.split(/(\[COMPLETAR:[^\]]*\])/).map((trozo, i) =>
    trozo.startsWith("[COMPLETAR:") ? (
      <mark key={i} className={s.pendiente}>
        {trozo}
      </mark>
    ) : (
      <Fragment key={i}>{trozo}</Fragment>
    ),
  );

export function Privacidad() {
  return (
    <>
      <Encabezado
        versalita="Privacidad"
        titulo="Política de privacidad"
        bajada="Qué datos recibe este sitio, para qué se usan y cómo puedes pedir que los corrijamos o los borremos."
      >
        <p className={s.version}>
          Versión {POLITICA.version} · vigente desde el{" "}
          {fechaLarga(POLITICA.fecha)}
        </p>
      </Encabezado>

      <Contenedor className={s.cuerpo}>
        <nav aria-labelledby="indice-privacidad" className={s.indice}>
          <h2 id="indice-privacidad" className={`versalita ${s.indiceTitulo}`}>
            En esta página
          </h2>
          <ol className={s.indiceLista}>
            {SECCIONES.map((sec) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`}>{sec.titulo}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.texto}>
          {SECCIONES.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              aria-labelledby={`${sec.id}-titulo`}
              className={s.seccion}
            >
              <h2 id={`${sec.id}-titulo`} className={s.titulo}>
                {sec.titulo}
              </h2>
              {sec.parrafos.map((p) => (
                <p key={p}>{conPendientes(p)}</p>
              ))}
              {sec.lista && (
                <ul className={s.lista}>
                  {sec.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {sec.cierre && <p>{sec.cierre}</p>}
            </section>
          ))}
        </div>
      </Contenedor>
    </>
  );
}
