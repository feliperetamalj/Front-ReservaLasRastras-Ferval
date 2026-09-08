import { Icono, Reveal, Seccion } from '../ui';
import { ATRIBUTOS } from '../../data/proyecto';
import s from './Atributos.module.css';

export function Atributos({ fondo = 'papel' }) {
  return (
    <Seccion
      id="siguiente"
      fondo={fondo}
      versalita="Superior, exclusivo y de alto estándar"
      titulo="Lo que hace distinto a este barrio"
      bajada="Seis decisiones de urbanización que se toman antes de vender el primer sitio y que después no se pueden corregir."
    >
      <ul className={s.grilla}>
        {ATRIBUTOS.map((a, i) => (
          <Reveal como="li" key={a.titulo} retraso={i * 60} className={s.item}>
            <span className={s.marco}>
              <Icono nombre={a.icono} tamano={26} />
            </span>
            <h3 className={s.titulo}>{a.titulo}</h3>
            <p className={s.detalle}>{a.detalle}</p>
          </Reveal>
        ))}
      </ul>
    </Seccion>
  );
}
