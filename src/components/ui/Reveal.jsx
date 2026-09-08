import { useRevelado } from '../../hooks';
import s from './Reveal.module.css';

/**
 * Revela su contenido al entrar en pantalla: 18px de desplazamiento y opacidad.
 *
 * Con movimiento reducido el desplazamiento desaparece y queda solo un fundido
 * corto — reducir movimiento no es eliminar la respuesta, es cambiarla.
 */
export function Reveal({ children, retraso = 0, como: Como = 'div', className = '', ...resto }) {
  const [ref, visible] = useRevelado();

  return (
    <Como
      ref={ref}
      className={`${s.reveal} ${visible ? s.visible : ''} ${className}`}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
      {...resto}
    >
      {children}
    </Como>
  );
}
