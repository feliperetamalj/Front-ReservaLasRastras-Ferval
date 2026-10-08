import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Anillos, Contenedor, Icono, Logo } from '../ui';
import { CONTACTO, CORPORATIVO, CREDITOS, HORARIO, PROYECTO } from '../../data/proyecto';
import { whatsAppDirecto } from '../../utils/contacto';
import s from './Footer.module.css';

const COLUMNAS = [
  {
    titulo: 'El proyecto',
    enlaces: [
      { a: '/modelos', texto: 'Modelos de casa' },
      { a: '/master-plan', texto: 'Sitios disponibles' },
      { a: '/el-barrio', texto: 'El barrio' },
      { a: '/partners', texto: 'Partners' },
    ],
  },
];

export function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className={`${s.footer} enOscuro`}>
      <Anillos variante="oscuro" className={s.marcaAgua} />

      <Contenedor>
        <div className={s.grilla}>
          <div className={s.columnaMarca}>
            <Logo alto={52} variante="inverso" />
            <p className={s.descripcion}>
              {PROYECTO.resumen}
            </p>
            <div className={s.redes}>
              <a
                href={CONTACTO.instagram}
                className={s.red}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Reserva Las Rastras"
              >
                <Icono nombre="instagram" tamano={20} />
              </a>
              <a
                href={CONTACTO.facebook}
                className={s.red}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Reserva Las Rastras"
              >
                <Icono nombre="facebook" tamano={20} />
              </a>
            </div>
          </div>

          {COLUMNAS.map((col) => (
            <nav key={col.titulo} className={s.columna} aria-label={col.titulo}>
              <h2 className={`versalita ${s.tituloColumna}`}>{col.titulo}</h2>
              <ul className={s.lista}>
                {col.enlaces.map((e) => (
                  <li key={e.a}>
                    <Link to={e.a} className={s.enlace}>
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={s.columna}>
            <h2 className={`versalita ${s.tituloColumna}`}>Sala de ventas</h2>
            <ul className={s.lista}>
              <li className={s.dato}>
                <Icono nombre="pin" tamano={18} className={s.iconoDato} />
                <a href={CONTACTO.mapa} className={s.enlace} target="_blank" rel="noopener noreferrer">
                  {CONTACTO.direccion}, {CONTACTO.ciudad}
                </a>
              </li>
              <li className={s.dato}>
                <Icono nombre="whatsapp" tamano={18} className={s.iconoDato} />
                <a
                  href={whatsAppDirecto()}
                  className={`${s.enlace} tabular`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CONTACTO.telefono}
                </a>
              </li>
            </ul>

            <h2 className={`versalita ${s.tituloColumna} ${s.tituloSecundario}`}>
              {CORPORATIVO.nombre}
            </h2>
            <ul className={s.lista}>
              <li className={s.dato}>
                <Icono nombre="telefono" tamano={18} className={s.iconoDato} />
                <a href={`tel:${CORPORATIVO.telefonoLink}`} className={`${s.enlace} tabular`}>
                  {CORPORATIVO.telefono}
                </a>
              </li>
              <li className={s.dato}>
                <Icono nombre="correo" tamano={18} className={s.iconoDato} />
                <a href={`mailto:${CORPORATIVO.email}`} className={s.enlace}>
                  {CORPORATIVO.email}
                </a>
              </li>
            </ul>
          </div>

          <div className={s.columna}>
            <h2 className={`versalita ${s.tituloColumna}`}>Horario</h2>
            <ul className={s.lista}>
              {HORARIO.map((h) => (
                <li key={h.dias} className={s.horario}>
                  <span className={s.dias}>{h.dias}</span>
                  <span className={`${s.horas} tabular`}>{h.horas}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={s.pie}>
          <p className={s.legal}>
            {/*
              El separador va fuera del bloque de cada titular: dentro de un
              `inline-block`, el espacio inicial se colapsa y se leía
              "Rastras- © 2026".
            */}
            {CREDITOS.map((titular, i) => (
              <Fragment key={titular}>
                {i > 0 && <span aria-hidden="true"> - </span>}
                <span className={s.credito}>
                  ©&nbsp;{anio} {titular}
                </span>
              </Fragment>
            ))}
            .
          </p>
          <p className={s.aviso}>
            Las imágenes, planos y especificaciones técnicas de este sitio son
            referenciales y tienen por objeto mostrar las características generales
            del proyecto, no detalles ni terminaciones específicas. Los interiores no
            incluyen muebles, paisajismo ni jardines terminados.
          </p>
        </div>
      </Contenedor>
    </footer>
  );
}
