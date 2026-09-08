# Reserva Las Rastras

Sitio del barrio residencial Reserva Las Rastras (Talca), proyecto de
Inmobiliaria Ferval. Reemplaza al sitio WordPress de `reservalasrastras.cl`.

React 19 + Vite 8 + CSS Modules. Sin librerías de interfaz.

---

## Poner a andar

Node vive en `~/.local/node` (instalado sin sudo, no hay Homebrew en esta
máquina). El shell no interactivo no carga `~/.zshrc`, así que hay que
anteponer el PATH:

```bash
export PATH="$HOME/.local/node/bin:$PATH" && npm install && npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve `dist/` como en producción |

---

## Dónde se edita el contenido

Todo el texto y las cifras viven en `src/data`. **Nunca escribas contenido
dentro de un componente.**

| Archivo | Contiene |
|---|---|
| `src/data/proyecto.js` | Datos del proyecto, contacto, horario, atributos, entorno |
| `src/data/modelos.js` | Los seis modelos de casa |
| `src/data/sitios.js` | Los 132 sitios del loteo con superficie y disponibilidad |
| `src/data/partners.js` | Arquitectos y constructoras autorizados |
| `src/data/medidas.js` | Generado — medidas de cada imagen. No editar a mano |

### Actualizar la disponibilidad de sitios

`src/data/sitios.js` trae la disponibilidad al **8 de septiembre de 2026**,
leída del master plan publicado. Para actualizarla, cambia `disponible` en las
filas que corresponda: los totales, los rangos de superficie y los recuentos
por sector se recalculan solos (`RESUMEN` y `POR_SECTOR`), no hay cifras
escritas a mano en ninguna pantalla.

### Reprocesar imágenes

Los originales se descargaron del sitio anterior y se convirtieron a WebP en
los tamaños en que efectivamente se pintan (51 MB → 11 MB, −79 %).

```bash
node scripts/preparar-imagenes.mjs <carpeta-con-los-originales>
```

El nombre de cada original conserva la ruta de WordPress
(`2024/06/179-galeria.jpg` → `2024_06_179-galeria.jpg`) porque en `uploads` es
habitual que dos meses distintos tengan un `01.jpg` que no es la misma foto; si
se guarda solo el nombre base, una sobrescribe a la otra en silencio.

El script también regenera `src/data/medidas.js`, que es lo que permite a cada
`<img>` declarar `width` y `height` y reservar su espacio antes de descargar.

### Regenerar favicon e imagen Open Graph

```bash
node scripts/generar-social.mjs
```

---

## Marca

Los colores **no están estimados**: salen literalmente del SVG del logotipo
(`src/assets/brand/logo-reserva.svg`), donde el degradado dorado declara sus
paradas exactas.

| Token | Valor | Dónde vive |
|---|---|---|
| `--oro-400` | `#c7a626` | Relleno de botón y texto sobre tinta (7,77:1) |
| `--oro-700` | `#82680a` | Texto dorado sobre fondo claro (5,00:1) |
| `--oro-200` | `#f6d85d` | Texto dorado sobre fotografía velada |
| `--grafito-600` | `#434040` | Texto secundario, es el gris del logotipo |
| `--tinta-900` | `#1e120d` | Texto principal y superficies oscuras |

**La regla que hay que respetar al agregar cualquier elemento dorado:** el oro
medio da 2,36:1 sobre blanco y reprueba. Su lugar es el *relleno* de botón —con
texto en tinta encima, nunca blanco— y las superficies oscuras. Para texto
dorado sobre fondo claro existe `--oro-700`; sobre fotografía, `--oro-200`.

Tipografía: **Cinzel** para titulares (la capital romana inscripcional que rima
con el serif del logotipo) e **Inter** para texto y cifras, donde hace falta
numeración tabular.

Los tres anillos del isotipo se reutilizan como recurso gráfico en
`src/components/ui/Anillos.jsx`. Sus `path` están copiados literalmente del
logotipo, así que conservan las irregularidades del trazo a mano.

---

## Formulario

No hay backend. El formulario valida, compone el mensaje y lo entrega a
WhatsApp o al cliente de correo. Nada se envía ni se guarda desde el sitio, y
ningún dato personal viaja a un tercero.

El destinatario está en `CONTACTO` (`src/data/proyecto.js`). Hoy es el contacto
comercial de Ferval, porque **el sitio del proyecto no publica un teléfono
propio**; si Reserva Las Rastras tiene su propio número de sala de ventas, es el
único valor que hay que cambiar.

---

## Despliegue

`vercel.json` está validado contra el esquema. **No le agregues claves de
comentario:** JSON no admite comentarios y Vercel rechaza cualquier propiedad
que no reconozca, con un error que solo aparece al desplegar.

La reescritura de rutas manda todo a `index.html` salvo los archivos reales
(`assets/`, favicon, `og-image.jpg`, `robots.txt`, `sitemap.xml`); sin ella,
recargar `/modelos/colonial-150` devuelve 404.

Si conectas el repositorio a Vercel *después* del último push, no hay evento que
dispare la construcción. Un commit vacío la despierta:

```bash
git commit --allow-empty -m "Dispara el primer despliegue" && git push
```

---

## Datos contradictorios del sitio anterior

Están documentados en el código, junto al dato que afectan, y se muestran al
visitante como nota cuando corresponde. **Ninguno se corrigió en silencio.**

| Dónde | Qué dice el sitio actual |
|---|---|
| Modelo de 310 m² | Aparece como **310, 283 y 159 m²** en la misma ficha, y como 308 m² en el sitio de Ferval |
| Modelo de 179 m² de un piso | Su distintivo de precio dice **159 m²**; el título dice 179 |
| Modelo colonial mayor | **190** en la portada, **192** en el menú y en su ficha |
| Horario de la sala de ventas | **Cuatro horarios distintos** en cuatro páginas |
| Sectores en venta | Dice "lote B, C, E, F y G", pero su tabla también lista el sector A |
| Página `/reserva/` | Formulario roto ("Formulario de contacto no encontrado") y "Entrega: Noviembre 2021" |
| Página `/visitasaladeventa/` | Muestra el código `[booked-calendar calendar=27]` sin renderizar |

Los cuatro modelos cuyo precio se contradice muestran **"Precio a consultar"**.
Publicar una cifra que el propio cliente desmiente en otra pantalla es peor que
no publicarla.

## Datos personales de terceros

El sitio anterior publica el **celular particular y el correo de Gmail** de cada
arquitecto y constructor en `/partners/`. Aquí se listan los nombres y la
especialidad, y solo se conservan los datos de contacto corporativos; los
celulares los entrega la sala de ventas. Republicarlos es una decisión del
cliente, y desde diciembre de 2026 queda cubierta por la Ley 21.719.

---

## Accesibilidad

Verificado sobre las nueve rutas con `scripts/auditar.js`: sin imágenes sin
`alt`, sin controles sin nombre accesible, un solo `h1` por página, jerarquía de
encabezados sin saltos, objetivos táctiles sobre 24 px y CLS 0.

Para volver a correrlo, pega el contenido de `scripts/auditar.js` en la consola
del navegador. Un resultado limpio devuelve `problemas: ['ninguno']`.

El sitio respeta `prefers-reduced-motion`, `prefers-reduced-transparency` y
`prefers-contrast`. Reducir movimiento no elimina la respuesta: cambia el
desplazamiento por un fundido corto.
