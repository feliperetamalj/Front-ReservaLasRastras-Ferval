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
| `npm test` | Pruebas de la agenda (`node --test`, sin dependencias) |

---

## Dónde se edita el contenido

Todo el texto y las cifras viven en `src/data`. **Nunca escribas contenido
dentro de un componente.**

| Archivo | Contiene |
|---|---|
| `src/data/proyecto.js` | Datos del proyecto, atributos, entorno, fotos |
| `src/data/contacto.js` | Sala de ventas, Ferval y horario de atención |
| `src/data/agenda.js` | Reglas, textos de consentimiento y correos de la agenda |
| `src/data/feriados.js` | Feriados en que la agenda no ofrece visitas (actualizar cada año) |
| `src/data/modelos.js` | Los seis modelos de casa |
| `src/data/sitios.js` | Los 184 sitios del plano (superficie, estado, posición) y los macrolotes |
| `src/data/partners.js` | Arquitectos y constructoras autorizados |
| `src/data/privacidad.js` | Política de privacidad (versión, fecha y secciones) |
| `src/data/medidas.js` | Generado — medidas de cada imagen. No editar a mano |

### Actualizar la disponibilidad de sitios

`src/data/sitios.js` trae los estados del **listado del 7 de octubre de 2026**
que publica el sitio nuevo de Ferval (`reservalasrastras.cl/master-plan.html`).
Para actualizarlo:

1. Cambia `estado` en las filas que corresponda: `'disponible'`,
   `'reservado'` o `'vendido'`.
2. Cambia `FECHA_DISPONIBILIDAD` en el mismo archivo; es la que se muestra
   junto al buscador.

Criterios que quedaron aplicados en octubre (detalle en la cabecera de
`sitios.js`):

- Donde la superficie del listado difiere en más de 1 m² de la anterior, se
  mantiene la anterior y la del listado queda en `nota`. `nota` es **interna**:
  no se muestra en el sitio.
- Los 22 sitios que el listado ya no publica pasan a `reservado` con `nota`
  (B5 sigue `vendido`). No se borran: su círculo sigue impreso en el plano.
- D26 y H1 son **macrolotes** (`MACROLOTES`): solo aparecen en la vista de
  lista y no entran en el rango de superficies ni en los recuentos de sitios.
- `casa` guarda la casa construida con la que se vende el sitio (39 sitios),
  con el texto tal como lo publica el listado. Enlaza a la ficha del modelo
  solo cuando la equivalencia es inequívoca: Mediterránea 308 → 310, 182 y
  179 de 2 pisos. Chilena 140/150/190 y Mediterránea 140/176/180 no tienen
  modelo en el catálogo y van sin enlace. Reemplaza al antiguo campo `modelo`,
  que asociaba 14 sitios por la foto que mostraba el sitio anterior.

Los totales, los rangos de superficie, los recuentos por sector y la cantidad
de sectores que aparece en los textos se recalculan solos (`RESUMEN` y
`POR_SECTOR`): no hay cifras escritas a mano en ninguna pantalla.

`x` e `y` son la posición del centro de cada sitio en el plano, como fracción
del ancho y del alto de la imagen. **No se tocan** salvo que cambie la imagen
del plano; en ese caso hay que volver a medirlas (el comentario de cabecera de
`sitios.js` explica cómo se obtuvieron).

### El plano interactivo

`src/components/sections/MapaSitios.jsx`. Cada sitio es un botón que tapa el
círculo impreso en la imagen, así el estado que se ve es siempre el de los
datos y no el que quedó dibujado el día que se hizo el plano.

- **Escritorio:** se parte con los círculos a 28 px. Pasar el cursor abre la
  ficha; hacer clic la fija. La rueda desplaza; Control + rueda (o pellizcar
  en el trackpad) acerca sobre el cursor; arrastrar con el mouse desplaza.
- **Teléfono:** se parte viendo el barrio completo. El primer toque acerca
  sobre ese punto —el sitio tocado queda bajo el dedo— y abre su ficha; a
  partir de ahí, tocar elige.
- **Teclado:** el plano es una sola parada del tabulador. Las flechas mueven
  al sitio vecino en esa dirección, Inicio y Fin van a los extremos, Intro
  fija la ficha, Escape la cierra, y `+` / `−` acercan y alejan.
- Los filtros del buscador **atenúan** lo que no coincide, no lo ocultan.
- La vista de lista muestra los mismos sitios con los mismos filtros; es
  también el camino más cómodo con lector de pantalla.

Los estados se distinguen por luminosidad y forma, no solo por color: oro
lleno (disponible), papel con borde discontinuo (reservado) y tinta
(vendido). Verde y rojo tenían casi la misma luminancia —el par que más
confunde la visión del color— y el verde se perdía sobre el pasto del plano.

Los sitios que se venden con casa llevan una insignia con forma de casa en el
marcador (papel con la casa en tinta, legible sobre los tres estados) y se
pueden filtrar con "Con casa construida".

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

El script también actualiza `src/data/medidas.js`, que es lo que permite a cada
`<img>` declarar `width` y `height` y reservar su espacio antes de descargar.
Es incremental: conserva las medidas que ya estaban y solo agrega o reemplaza
las de los originales presentes en la carpeta, así que se puede correr con una
sola foto nueva sin perder las demás.

Las dos fotos de la portada (`cliente_hero-acceso.jpg`, 1600×900, y
`cliente_hero-acceso-movil.jpg`, 890×1920) vienen del sitio nuevo de Ferval
(reservalasrastras.cl). La vertical se sirve bajo 640 px con `<picture>`: en el
teléfono el portal queda arriba y el texto abajo, sobre el pasto.

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

El destinatario está en `CONTACTO` (`src/data/proyecto.js`): el WhatsApp de la
sala de ventas de Alto Las Rastras (+56 9 6642 4037), el mismo que publican el
sitio nuevo y el brochure 2026. `CORPORATIVO` guarda el contacto de
Inmobiliaria Ferval, que aparece en el pie.

El horario sale de `ATENCION` en el mismo archivo: días y tramos de atención.
Es la única fuente del horario que se muestra en el sitio.

El botón flotante de WhatsApp (`WhatsAppFlotante.jsx`) abre el mismo número en
todas las rutas y se oculta mientras el menú móvil está abierto. Su verde
(`--whatsapp`) es más oscuro que el de la marca de WhatsApp para que el ícono
blanco cumpla 3:1.

---

## Agenda de visitas

`/agendar` ofrece los próximos 21 días en bloques de una hora, según el
horario de `ATENCION` y los feriados de `src/data/feriados.js`, con 2 horas de
anticipación mínima. Todo se calcula en la hora de Santiago.

- La lógica vive en `src/utils/agenda.js` y la comparten la página y las
  funciones de `api/` (disponibilidad, agendar, gestionar): el servidor valida
  con las mismas reglas. Por eso esos archivos y los de `src/data/` que
  importan no pueden traer imágenes y sus imports llevan `.js`.
- Base de datos en Supabase y correos con Resend, ambos con `fetch`, sin
  dependencias. Las claves solo existen como variables de entorno en Vercel
  (ver `.env.example`); sin ellas, la página envía la solicitud por WhatsApp.
- El enlace para cancelar o borrar datos lleva el token en el fragmento
  (`#token=…`), que el navegador no manda al servidor.

Puesta en marcha, operación diaria y cómo atender pedidos de borrado:
[`docs/agenda.md`](docs/agenda.md).

## Despliegue

`vercel.json` está validado contra el esquema. **No le agregues claves de
comentario:** JSON no admite comentarios y Vercel rechaza cualquier propiedad
que no reconozca, con un error que solo aparece al desplegar.

La reescritura de rutas manda todo a `index.html` salvo los archivos reales
(`assets/`, favicon, `og-image.jpg`, `robots.txt`, `sitemap.xml`) y las
funciones de `api/`; sin ella, recargar `/modelos/colonial-150` devuelve 404.
Las funciones corren en São Paulo (`gru1`), junto a la base de datos.

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
| Sectores en venta | Dice "lote B, C, E, F y G", pero su plano incluye también los sectores A y D |
| Página `/reserva/` | Formulario roto ("Formulario de contacto no encontrado") y "Entrega: Noviembre 2021" |
| Página `/visitasaladeventa/` | Muestra el código `[booked-calendar calendar=27]` sin renderizar |

Los cuatro modelos cuyo precio se contradice muestran **"Precio a consultar"**.
Publicar una cifra que el propio cliente desmiente en otra pantalla es peor que
no publicarla.

## Política de privacidad

`/privacidad` cubre la información permanente que exige el Art. 14 ter de la
Ley 19.628, modificada por la Ley 21.719 (vigente desde el 1 de diciembre de
2026): cada sección de `src/data/privacidad.js` indica la letra que responde.
Hay enlace en el pie de todas las páginas y en el formulario de contacto.

Es un borrador fundado en el texto de la ley, no asesoría legal. **Antes de
publicar en el dominio del cliente**, Ferval tiene que completar los
marcadores `[COMPLETAR: …]` (razón social, RUT, representante legal,
domicilio, correo para solicitudes y las garantías de las transferencias
internacionales). La página los resalta en amarillo para que no pasen
inadvertidos:

```bash
grep -n "COMPLETAR" src/data/privacidad.js
```

Si cambia el texto, sube `POLITICA.version` y la fecha: la versión se guarda
con cada consentimiento de la agenda.

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
