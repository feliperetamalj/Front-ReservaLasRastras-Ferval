import { Link } from 'react-router-dom';
import { Anillos, Contenedor, Icono, Logo } from '../ui';
import { CONTACTO, CREDITOS, HORARIO, PROYECTO } from '../../data/proyecto';
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
                <span>
                  {CONTACTO.direccion}
                  <br />
                  {CONTACTO.ciudad}
                </span>
              </li>
              <li className={s.dato}>
                <Icono nombre="telefono" tamano={18} className={s.iconoDato} />
                <a href={`tel:${CONTACTO.telefonoLink}`} className={`${s.enlace} tabular`}>
                  {CONTACTO.telefono}
                </a>
              </li>
              <li className={s.dato}>
                <Icono nombre="correo" tamano={18} className={s.iconoDato} />
                <a href={`mailto:${CONTACTO.email}`} className={s.enlace}>
                  {CONTACTO.email}
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
            {CREDITOS.map((titular, i) => (
              <span key={titular} className={s.credito}>
                {i > 0 && <span aria-hidden="true"> - </span>}©&nbsp;{anio} {titular}
              </span>
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
