-- ============================================================
-- Tebiinder: Habilitar Supabase Realtime (Fase 4)
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ============================================================

-- Habilitar replicación para las tablas del matchmaker
-- Esto permite que los clientes se suscriban a cambios en tiempo real
alter publication supabase_realtime add table public.jugadores;
alter publication supabase_realtime add table public.equipos;
