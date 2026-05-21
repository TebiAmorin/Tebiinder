-- ============================================================
-- Tebiinder: Esquema de Base de Datos (Supabase / PostgreSQL)
-- ============================================================

-- Tabla auxiliar de perfiles de usuario (se crea al hacer login)
create table if not exists public.perfiles_usuario (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null unique,
  discord_id text not null,
  discord_username text not null,
  discord_avatar   text,
  rol        text not null default 'invitado'
             check (rol in ('invitado','ojeador','jugador','capitan')),
  created_at timestamptz default now()
);

-- Tabla de jugadores (Free Agents / LFT)
create table if not exists public.jugadores (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null unique,
  discord_id       text not null,
  discord_username text not null,
  discord_avatar   text,
  ubisoft_id       text,
  rango            text,
  kd               numeric(4,2),
  rol_principal    text not null
                   check (rol_principal in ('entry-fragger','flex','support','anchor','roamer','hard-breach','intel')),
  rol_secundario   text
                   check (rol_secundario is null or rol_secundario in ('entry-fragger','flex','support','anchor','roamer','hard-breach','intel')),
  disponibilidad   text not null
                   check (disponibilidad in ('diaria','fines-de-semana','flexible','solo-competitivo')),
  region           text not null
                   check (region in ('eu-west','eu-east','na','latam','apac')),
  idioma           text not null default 'es',
  plataforma       text not null
                   check (plataforma in ('pc','playstation','xbox')),
  destacado        boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Tabla de equipos (LFG)
create table if not exists public.equipos (
  id                        uuid primary key default gen_random_uuid(),
  capitan_id                uuid references auth.users(id) on delete cascade not null unique,
  nombre_equipo             text not null,
  discord_id_capitan        text not null,
  discord_username_capitan  text not null,
  discord_avatar_capitan    text,
  descripcion               text,
  region                    text not null
                            check (region in ('eu-west','eu-east','na','latam','apac')),
  idioma                    text not null default 'es',
  plataforma                text not null
                            check (plataforma in ('pc','playstation','xbox')),
  rol_buscado               text not null
                            check (rol_buscado in ('entry-fragger','flex','support','anchor','roamer','hard-breach','intel')),
  rango_medio               text,
  kd_medio                  numeric(4,2),
  integrantes_ubisoft_ids   text[],
  destacado                 boolean default false,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

-- Índices para consultas frecuentes
create index if not exists idx_jugadores_region on public.jugadores(region);
create index if not exists idx_jugadores_destacado on public.jugadores(destacado) where destacado = true;
create index if not exists idx_equipos_region on public.equipos(region);
create index if not exists idx_equipos_destacado on public.equipos(destacado) where destacado = true;

-- Trigger para actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger jugadores_updated_at
  before update on public.jugadores
  for each row execute function public.handle_updated_at();

create or replace trigger equipos_updated_at
  before update on public.equipos
  for each row execute function public.handle_updated_at();

-- Trigger para crear perfil_usuario automáticamente al registrarse con Discord
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles_usuario (user_id, discord_id, discord_username, discord_avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'provider_id', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'usuario'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security (RLS) - Habilitación básica
-- Las políticas detalladas se definirán en la Fase 2
-- ============================================================
alter table public.perfiles_usuario enable row level security;
alter table public.jugadores enable row level security;
alter table public.equipos enable row level security;

-- Política temporal: lectura pública para todos (los tablones son visibles)
create policy "Lectura pública de jugadores"
  on public.jugadores for select
  using (true);

create policy "Lectura pública de equipos"
  on public.equipos for select
  using (true);

create policy "Lectura pública de perfiles"
  on public.perfiles_usuario for select
  using (true);

-- Política temporal: los usuarios autenticados pueden insertar/actualizar su propio registro
create policy "Jugador gestiona su ficha"
  on public.jugadores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Capitán gestiona su equipo"
  on public.equipos for all
  using (auth.uid() = capitan_id)
  with check (auth.uid() = capitan_id);

create policy "Usuario gestiona su perfil"
  on public.perfiles_usuario for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
