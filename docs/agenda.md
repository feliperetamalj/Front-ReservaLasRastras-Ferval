# Agenda de visitas · runbook

La página `/agendar` permite pedir una visita a la sala de ventas. Las
solicitudes quedan en Supabase (tabla `visitas`), a la sala le llega un correo
con un botón para confirmar por WhatsApp y, si la persona dejó su correo,
recibe la confirmación con el archivo de calendario y un enlace para cancelar
o borrar sus datos.

Mientras falte alguna variable de entorno, la agenda queda **apagada**: la
misma página arma la solicitud y la abre en WhatsApp. Nada se pierde.

## Puesta en marcha (una vez)

1. **Supabase.** Crear el proyecto `reserva-las-rastras` en la región São
   Paulo (`sa-east-1`). En *SQL Editor*, pegar y ejecutar
   `supabase/migrations/20261008000000_visitas.sql`. Crea la tabla, el índice
   que impide dos visitas en el mismo bloque, RLS sin políticas (nadie la lee
   con la clave pública) y el borrado automático a los 12 meses.
2. **Gmail.** En la cuenta que enviará los correos (idealmente de la sala o
   de Ferval), activar la verificación en dos pasos y crear una contraseña de
   aplicación en myaccount.google.com/apppasswords. Gmail admite unos 500
   destinatarios al día, de sobra para la agenda.
3. **Vercel.** En *Settings → Environment Variables* (Production), cargar las
   seis variables de `.env.example`. Redesplegar.
4. **Probar.** Pedir una visita con un correo propio, revisar que llegan los
   dos correos, cancelarla desde el enlace y comprobar en Supabase que quedó
   `cancelada`.

## Día a día

Todo se hace en Supabase → *Table Editor* → `visitas`, o en *SQL Editor*.

**Confirmar una visita.** Escribirle por WhatsApp con el botón del correo y
cambiar `estado` de `solicitada` a `confirmada`.

**Cancelar una visita** (la pide la persona por WhatsApp o teléfono): cambiar
`estado` a `cancelada`. El bloque queda libre al instante.

**Marcar la visita como hecha:** `estado` = `realizada`.

**Listado del día** (para imprimir o exportar a CSV desde el editor):

```sql
select hora, nombre, telefono, email, interes, comentario, estado
from visitas
where fecha = (now() at time zone 'America/Santiago')::date
  and estado in ('solicitada', 'confirmada')
order by hora;
```

## Derechos de las personas (Ley 19.628 / 21.719)

Cualquier persona puede pedir ver, corregir o borrar sus datos. Hay **30 días
corridos** para responder (prorrogables una vez por 30, avisándole).

La persona puede borrarlos sola con el enlace de su correo. Si lo pide por
otra vía, buscar sus filas y revisarlas **antes** de borrar:

```sql
select id, fecha, hora, nombre, telefono, email
from visitas
where telefono like '%12345678%' or email = 'persona@correo.cl';

-- Si son las correctas:
delete from visitas where id in ('…', '…');
```

Para entregarle una copia (acceso o portabilidad), exportar esas mismas filas
a CSV desde el editor.

Si una visita termina en compra, sus datos pasan a la gestión comercial de
Ferval, fuera de este sistema: esta tabla no es un CRM.

Los correos enviados quedan también en la carpeta *Enviados* de la cuenta de
Gmail remitente: si alguien pide borrar sus datos, borrar ahí también su
confirmación.

## Si algo falla

- **No llegan correos a la sala:** la solicitud no se guarda (se deshace) y la
  página le ofrece WhatsApp a la persona. Revisar `SMTP_USUARIO` y
  `SMTP_CLAVE` (si se cambió la contraseña de la cuenta, Google anula las
  contraseñas de aplicación y hay que crear otra), y los registros de la
  función `api/agendar` en Vercel: `EAUTH` es clave rechazada. No contienen
  datos personales, solo códigos de error.
- **Una persona dice que el día que quería aparece cerrado:** revisar
  `src/data/feriados.js` y el horario en `src/data/contacto.js`.
- **Cambia el horario de la sala:** se edita `ATENCION` en
  `src/data/contacto.js`; los bloques de la agenda se recalculan solos.

## Pendiente (fase 2)

Panel `/admin` con Supabase Auth y doble factor para que la sala vea y
gestione la agenda sin entrar a Supabase.
