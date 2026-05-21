"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchPlayerStats } from "@/lib/r6tracker/api";
import { calculateTeamStats } from "@/lib/r6tracker/team-stats";
import type { Rol, Region, Plataforma, Disponibilidad } from "@/types/database";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Helper: .from() con cast para evitar el bug de generics de Supabase v2
// con tipos manuales (resuelve Insert/Update como `never`).
// La validación real ocurre en la DB (constraints + RLS).
async function db() {
  const supabase = await createClient();
  return {
    supabase,
    jugadores: () => supabase.from("jugadores") as any,
    equipos: () => supabase.from("equipos") as any,
    perfiles: () => supabase.from("perfiles_usuario") as any,
  };
}

// ============================================================
// Seleccionar rol del usuario
// ============================================================
export async function selectUserRole(rol: "ojeador" | "jugador" | "capitan") {
  const { supabase, perfiles } = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await perfiles().update({ rol }).eq("user_id", user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}

// ============================================================
// Crear / actualizar ficha de jugador (LFT)
// ============================================================
interface PlayerFormData {
  ubisoftId?: string;
  rolPrincipal: Rol;
  rolSecundario?: Rol;
  disponibilidad: Disponibilidad;
  region: Region;
  idioma: string;
  plataforma: Plataforma;
}

export async function upsertPlayerProfile(formData: PlayerFormData) {
  const { supabase, jugadores } = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const discordId = user.user_metadata?.provider_id ?? "";
  const discordUsername =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? "usuario";
  const discordAvatar = user.user_metadata?.avatar_url ?? null;

  // Fetch stats de Ubisoft si se proporcionó el ID
  let rango: string | null = null;
  let kd: number | null = null;

  if (formData.ubisoftId) {
    try {
      const stats = await fetchPlayerStats(
        formData.ubisoftId,
        formData.plataforma
      );
      rango = stats.rank;
      kd = stats.kd;
    } catch {
      // Si falla la API, seguimos sin stats
    }
  }

  const { error } = await jugadores().upsert(
    {
      user_id: user.id,
      discord_id: discordId,
      discord_username: discordUsername,
      discord_avatar: discordAvatar,
      ubisoft_id: formData.ubisoftId ?? null,
      rango,
      kd,
      rol_principal: formData.rolPrincipal,
      rol_secundario: formData.rolSecundario ?? null,
      disponibilidad: formData.disponibilidad,
      region: formData.region,
      idioma: formData.idioma,
      plataforma: formData.plataforma,
    },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
  return { success: true, rango, kd };
}

// ============================================================
// Crear / actualizar ficha de equipo (LFG)
// ============================================================
interface TeamFormData {
  nombreEquipo: string;
  descripcion?: string;
  region: Region;
  idioma: string;
  plataforma: Plataforma;
  rolBuscado: Rol;
  integrantesUbisoftIds?: string[];
}

export async function upsertTeamProfile(formData: TeamFormData) {
  const { supabase, equipos } = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const discordId = user.user_metadata?.provider_id ?? "";
  const discordUsername =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? "usuario";
  const discordAvatar = user.user_metadata?.avatar_url ?? null;

  let rangoMedio: string | null = null;
  let kdMedio: number | null = null;

  if (formData.integrantesUbisoftIds?.length) {
    try {
      const teamStats = await calculateTeamStats(
        formData.integrantesUbisoftIds,
        formData.plataforma
      );
      rangoMedio = teamStats.rangoMedio;
      kdMedio = teamStats.kdMedio;
    } catch {
      // Si falla, seguimos sin medias
    }
  }

  const { error } = await equipos().upsert(
    {
      capitan_id: user.id,
      nombre_equipo: formData.nombreEquipo,
      discord_id_capitan: discordId,
      discord_username_capitan: discordUsername,
      discord_avatar_capitan: discordAvatar,
      descripcion: formData.descripcion ?? null,
      region: formData.region,
      idioma: formData.idioma,
      plataforma: formData.plataforma,
      rol_buscado: formData.rolBuscado,
      rango_medio: rangoMedio,
      kd_medio: kdMedio,
      integrantes_ubisoft_ids: formData.integrantesUbisoftIds ?? null,
    },
    { onConflict: "capitan_id" }
  );

  if (error) throw new Error(error.message);
  return { success: true, rangoMedio, kdMedio };
}

// ============================================================
// Refrescar stats de un jugador individual
// ============================================================
export async function refreshPlayerStats() {
  const { supabase, jugadores } = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: jugador } = await jugadores()
    .select("ubisoft_id, plataforma")
    .eq("user_id", user.id)
    .single();

  if (!jugador?.ubisoft_id) throw new Error("Sin Ubisoft ID configurado");

  const stats = await fetchPlayerStats(jugador.ubisoft_id, jugador.plataforma);

  const { error } = await jugadores()
    .update({ rango: stats.rank, kd: stats.kd })
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  return { rango: stats.rank, kd: stats.kd };
}
