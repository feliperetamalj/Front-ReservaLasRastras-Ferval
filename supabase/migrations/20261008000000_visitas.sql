-- Agenda de visitas a la sala de ventas de Reserva Las Rastras.
-- Se aplica una vez, en el SQL Editor de Supabase o con `supabase db push`.

create table public.visitas (
  id uuid primary key default gen_random_uuid(),
  creada_en timestamptz not null default now(),
  fecha date not null,
  hora time not null,
  estado text not null default 'solicitada'
    check (estado in ('solicitada', 'confirmada', 'cancelada', 'realizada')),
  nombre text not null check (char_length(nombre) between 2 and 80),
  telefono text not null check (char_length(telefono) between 8 and 20),
  email text check (email is null or char_length(email) <= 120),
  interes text check (interes is null or char_length(interes) <= 60),
  comentario text check (comentario is null or char_length(comentario) <= 500),
  -- Prueba del consentimiento (Art. 12 de la Ley 19.628: la carga de la prueba es del responsable).
  consentimiento boolean not null check (consentimiento = true),
  consentimiento_texto text not null,
  politica_version text not null,
  marketing boolean not null default false,
  -- sha256(ip + HASH_SALT): para limitar envíos y como prueba; nunca la IP en claro.
  ip_hash text,
  -- Enlace del correo para cancelar o borrar los datos.
  token_gestion uuid not null default gen_random_uuid() unique
);

comment on table public.visitas is
  'Solicitudes de visita desde /agendar. Datos personales: se borran 12 meses después de la fecha de la visita.';

-- Un bloque, una visita activa. Si la sala llega a atender a más de una
-- persona a la vez, reemplazar por un conteo con capacidad.
create unique index visitas_bloque_activo
  on public.visitas (fecha, hora)
  where estado in ('solicitada', 'confirmada');

-- Sin políticas: con la clave pública nadie lee ni escribe. Solo las
-- funciones de Vercel, con la clave de servicio, que salta RLS.
alter table public.visitas enable row level security;
revoke all on public.visitas from anon, authenticated;

-- Retención: todos los días a las 04:15 (UTC) se borran las visitas cuya
-- fecha pasó hace más de 12 meses.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'borrar-visitas-vencidas',
  '15 4 * * *',
  $$delete from public.visitas
    where fecha < ((now() at time zone 'America/Santiago')::date - interval '12 months')$$
);
