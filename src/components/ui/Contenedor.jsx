import s from './Contenedor.module.css';

/** Caja centrada con el ancho de lectura del sitio. */
export function Contenedor({ ancho = 'normal', className = '', children, ...resto }) {
  return (
    <div className={`${s.contenedor} ${s[ancho]} ${className}`} {...resto}>
      {children}
    </div>
  );
}
