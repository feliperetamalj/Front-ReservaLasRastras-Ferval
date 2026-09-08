import { Link } from 'react-router-dom';
import { Icono } from './Icono';
import s from './Boton.module.css';

/**
 * Botón único para las tres formas que necesita el sitio: enlace interno,
 * enlace externo y botón real. El elemento se decide por las props, así que
 * un enlace nunca termina siendo un <button> con onClick.
 */
export function Boton({
  children,
  variante = 'primario',
  tamano = 'medio',
  a, // ruta interna
  href, // url externa
  icono,
  iconoAlInicio = false,
  className = '',
  ...resto
}) {
  const clases = `${s.boton} ${s[variante]} ${s[tamano]} ${className}`;

  const contenido = (
    <>
      {icono && iconoAlInicio && <Icono nombre={icono} tamano={18} className={s.icono} />}
      <span className={s.texto}>{children}</span>
      {icono && !iconoAlInicio && <Icono nombre={icono} tamano={18} className={s.icono} />}
    </>
  );

  if (a) {
    return (
      <Link to={a} className={clases} {...resto}>
        {contenido}
      </Link>
    );
  }

  if (href) {
    const externo = href.startsWith('http');
    return (
      <a
        href={href}
        className={clases}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...resto}
      >
        {contenido}
      </a>
    );
  }

  return (
    <button type="button" className={clases} {...resto}>
      {contenido}
    </button>
  );
}
