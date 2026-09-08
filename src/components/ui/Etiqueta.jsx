import s from './Etiqueta.module.css';

/** Pastilla de metadato: superficie, estado de un sitio, estilo de un modelo. */
export function Etiqueta({ children, tono = 'neutro', className = '', ...resto }) {
  return (
    <span className={`${s.etiqueta} ${s[tono]} ${className}`} {...resto}>
      {children}
    </span>
  );
}
