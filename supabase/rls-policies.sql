-- ============================================================
-- Tebiinder: Políticas RLS Detalladas (Fase 2)
-- Ejecutar DESPUÉS del schema.sql inicial
-- ============================================================

-- Eliminar políticas temporales de Fase 1
drop policy if exists "Lectura pública de jugadores" on public.jugadores;
drop policy if exists "Lectura pública de equipos" on public.equipos;
drop policy if exists "Lectura pública de perfiles" on public.perfiles_usuario;
drop policy if exists "Jugador gestiona su ficha" on public.jugadores;
drop policy if exists "Capitán gestiona su equipo" on public.equipos;
drop policy if exists "Usuario gestiona su perfil" on public.perfiles_usuario;

-- ============================================================
-- PERFILES_USUARIO
-- ============================================================

-- Cualquiera puede ver los perfiles (invitados incluidos)
create policy "perfiles_select_publico"
  on public.perfiles_usuario for select
  using (true);

-- Un usuario autenticado puede insertar su propio perfil
create policy "perfiles_insert_propio"
  on public.perfiles_usuario for insert
  with check (auth.uid() = user_id);

-- Un usuario solo puede actualizar su propio perfil
create policy "perfiles_update_propio"
  on public.perfiles_usuario for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Nadie puede borrar perfiles (protección)
-- (no se crea policy de delete)

-- ============================================================
-- JUGADORES (Free Agents / LFT)
-- ============================================================

-- Cualquiera puede ver todos los jugadores (tablón público)
create policy "jugadores_select_publico"
  on public.jugadores for select
  using (true);

-- Solo usuarios con rol 'jugador' pueden crear su ficha
create policy "jugadores_insert_jugador"
  on public.jugadores for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.perfiles_usuario
      where perfiles_usuario.user_id = auth.uid()
        and perfiles_usuario.rol = 'jugador'
    )
  );

-- Un jugador solo puede actualizar su propia ficha
create policy "jugadores_update_propio"
  on public.jugadores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Un jugador puede eliminar su propia ficha
create policy "jugadores_delete_propio"
  on public.jugadores for delete
  using (auth.uid() = user_id);

-- ============================================================
-- EQUIPOS (LFG)
-- ============================================================

-- Cualquiera puede ver todos los equipos (tablón público)
create policy "equipos_select_publico"
  on public.equipos for select
  using (true);

-- Solo usuarios con rol 'capitan' pueden crear un equipo
create policy "equipos_insert_capitan"
  on public.equipos for insert
  with check (
    auth.uid() = capitan_id
    and exists (
      select 1 from public.perfiles_usuario
      where perfiles_usuario.user_id = auth.uid()
        and perfiles_usuario.rol = 'capitan'
    )
  );

-- Un capitán solo puede actualizar su propio equipo
create policy "equipos_update_propio"
  on public.equipos for update
  using (auth.uid() = capitan_id)
  with check (auth.uid() = capitan_id);

-- Un capitán puede eliminar su propio equipo
create policy "equipos_delete_propio"
  on public.equipos for delete
  using (auth.uid() = capitan_id);

-- ============================================================
-- ADMIN: Modo Streamer (destacar perfiles)
-- Se controlará mediante una función RPC con security definer
-- para que solo admins puedan cambiar el campo 'destacado'
-- ============================================================

create or replace function public.toggle_destacado(
  tabla text,       -- 'jugadores' o 'equipos'
  registro_id uuid,
  valor boolean
)
returns void as $$
declare
  is_admin boolean;
begin
  -- Verificar que el usuario tiene rol admin/ojeador
  select exists(
    select 1 from public.perfiles_usuario
    where user_id = auth.uid()
      and rol = 'ojeador'
  ) into is_admin;

  if not is_admin then
    raise exception 'No autorizado: solo ojeadores/admin pueden destacar perfiles';
  end if;

  if tabla = 'jugadores' then
    update public.jugadores set destacado = valor where id = registro_id;
  elsif tabla = 'equipos' then
    update public.equipos set destacado = valor where id = registro_id;
  else
    raise exception 'Tabla no válida: use jugadores o equipos';
  end if;
end;
$$ language plpgsql security definer;
