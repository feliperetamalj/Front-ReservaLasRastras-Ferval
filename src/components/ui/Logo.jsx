import logoColor from '../../assets/brand/logo-reserva.svg';
import logoClaro from '../../assets/brand/logo-reserva-claro.svg';
import s from './Logo.module.css';

/**
 * El logotipo oficial. No se redibuja.
 *
 * Sobre fondo oscuro no se usa un filtro CSS: `invert()` convierte el dorado
 * en su complementario azul y se pierde la marca. La variante clara es el
 * mismo SVG con tres clases recoloreadas — el texto pasa a blanco, "Barrio
 * Residencial" al oro medio y el anillo oscuro al oro claro.
 */
export function Logo({ alto = 40, variante = 'color', className = '' }) {
  return (
    <img
      src={variante === 'inverso' ? logoClaro : logoColor}
      alt="Reserva Las Rastras · Barrio Residencial"
      height={alto}
      style={{ height: alto }}
      className={`${s.logo} ${className}`}
    />
  );
}
