import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Boton, Icono, Logo } from '../ui';
import { useBloqueoScroll } from '../../hooks';
import { whatsAppDirecto } from '../../utils/contacto';
import s from './Header.module.css';

const RUTAS = [
  { a: '/modelos', texto: 'Modelos' },
  { a: '/master-plan', texto: 'Sitios' },
  { a: '/el-barrio', texto: 'El barrio' },
  { a: '/partners', texto: 'Partners' },
  { a: '/contacto', texto: 'Contacto' },
];

/*
  Las dos rutas que abren con fotografía a sangre. Mientras el header flota
  sobre ellas sin fondo, el logotipo de color no se lee: su texto es gris
  #434040 y da 1.78:1 contra la tinta del velo. Ahí va la variante clara.
*/
const PORTADA_OSCURA = (ruta) => ruta === '/' || /^\/modelos\/[^/]+$/.test(ruta);

export function Header() {
  const [abierto, setAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const { pathname } = useLocation();
  // Al desplazarse aparece el cromo claro, así que el logotipo vuelve a color.
  const sobreOscuro = PORTADA_OSCURA(pathname) && !desplazado && !abierto;

  useBloqueoScroll(abierto);

  // El menú se cierra al navegar; si no, queda abierto sobre la página nueva.
  useEffect(() => setAbierto(false), [pathname]);

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 16);
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  useEffect(() => {
    if (!abierto) return undefined;
    const alPresionar = (e) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto]);

  return (
    <header className={`${s.header} ${desplazado ? s.desplazado : ''} ${sobreOscuro ? `${s.sobreOscuro} enOscuro` : ''}`}>
      <div className={s.barra}>
        <NavLink to="/" className={s.marca} aria-label="Reserva Las Rastras · inicio">
          <Logo alto={44} variante={sobreOscuro ? 'inverso' : 'color'} />
        </NavLink>

        <nav className={s.navEscritorio} aria-label="Principal">
          {RUTAS.map((r) => (
            <NavLink
              key={r.a}
              to={r.a}
              className={({ isActive }) => `${s.enlace} ${isActive ? s.activo : ''}`}
            >
              {r.texto}
            </NavLink>
          ))}
        </nav>

        <div className={s.accionesEscritorio}>
          <Boton
            href={whatsAppDirecto()}
            variante="primario"
            tamano="chico"
            icono="whatsapp"
            iconoAlInicio
          >
            Cotizar
          </Boton>
        </div>

        <button
          type="button"
          className={s.botonMenu}
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
        >
          <Icono nombre={abierto ? 'cerrar' : 'menu'} tamano={24} />
        </button>
      </div>

      {/* El panel se desmonta al cerrarse: nada de `hidden` peleando con
          el `display: flex` de la media query. */}
      {abierto && (
        <div className={s.panelMovil} id="menu-movil">
          <nav className={s.navMovil} aria-label="Principal, móvil">
            {RUTAS.map((r, i) => (
              <NavLink
                key={r.a}
                to={r.a}
                className={({ isActive }) => `${s.enlaceMovil} ${isActive ? s.activo : ''}`}
                style={{ '--retraso': `${i * 40}ms` }}
              >
                {r.texto}
              </NavLink>
            ))}
          </nav>
          <Boton
            href={whatsAppDirecto()}
            variante="primario"
            tamano="grande"
            icono="whatsapp"
            iconoAlInicio
            className={s.ctaMovil}
          >
            Cotizar por WhatsApp
          </Boton>
        </div>
      )}
    </header>
  );
}
