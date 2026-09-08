/**
 * Íconos SVG dibujados a mano, en un solo registro.
 *
 * Nada de emojis: se dibujan distinto en cada sistema operativo, no heredan el
 * color del texto y delatan el atajo. Todos comparten caja de 24, trazo de 1.5
 * y `currentColor`, así que cambian de color con el texto que acompañan.
 */

const TRAZOS = {
  // --- Atributos del barrio ---
  portal: (
    <>
      <path d="M3 20h18" />
      <path d="M5 20V9l7-4 7 4v11" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  plano: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 11h8V4M11 11v9M11 15h10" />
    </>
  ),
  rayo: <path d="M13 2 5 13h6l-2 9 8-11h-6l2-9Z" />,
  sitio: (
    <>
      <path d="M3 6.5 12 3l9 3.5v11L12 21l-9-3.5v-11Z" />
      <path d="M12 3v18M3 6.5l9 3.5 9-3.5" />
    </>
  ),
  arbol: (
    <>
      <path d="M12 3 6 12h3l-3 5h12l-3-5h3L12 3Z" />
      <path d="M12 17v4" />
    </>
  ),
  auto: (
    <>
      <path d="M4 16v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2M16 16v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2" />
      <path d="M3 16v-4l2-5h14l2 5v4H3Z" />
      <path d="M6.5 12.5h1M16.5 12.5h1" />
    </>
  ),

  // --- Fichas de modelo ---
  cama: (
    <>
      <path d="M3 18v-8M3 14h18v4M21 18v-4" />
      <path d="M7 10V8a1 1 0 0 1 1-1h9a3 3 0 0 1 3 3v4" />
      <circle cx="7.5" cy="11.5" r="1.5" />
    </>
  ),
  bano: (
    <>
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" />
      <path d="M7 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" />
    </>
  ),
  superficie: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 4v4H4M20 16h-4v4" />
    </>
  ),
  niveles: (
    <>
      <path d="M3 20h6v-5h6v-5h6" />
      <path d="M3 20V9" />
    </>
  ),

  // --- Navegación y acciones ---
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  flechaIzq: <path d="M19 12H5M11 18l-6-6 6-6" />,
  abajo: <path d="M12 5v14M6 13l6 6 6-6" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z M8.6 9.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 2.6 2.2c.3.1.4 0 .6-.1l.5-.6c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4a1.8 1.8 0 0 1-1.3 1.6 4 4 0 0 1-3-.7 10 10 0 0 1-3.9-4.3 3.3 3.3 0 0 1-.4-2.5Z" />
  ),
  correo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  telefono: (
    <path d="M7 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6L17 12.5 21 14v3a2 2 0 0 1-2.2 2A17 17 0 0 1 5 5.2 2 2 0 0 1 7 3Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  descargar: <path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14" />,
  lupa: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  expandir: <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.5V5h-2.5A3.8 3.8 0 0 0 10.7 8.8V11H8v3.5h2.7V21h3.6v-6.5h2.6l.6-3.5h-3.2V9.3c0-.5.3-.8.8-.8Z" />
  ),
};

export function Icono({ nombre, tamano = 24, className, ...resto }) {
  const trazo = TRAZOS[nombre];
  if (!trazo) return null;

  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...resto}
    >
      {trazo}
    </svg>
  );
}
