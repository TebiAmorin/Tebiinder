/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { mockJugadores, mockEquipos } from "@/lib/mockData";
import type { Database, UserRole } from "@/types/database";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

export interface PageData {
  user: any | null;
  userRole: UserRole;
  existingPlayer: Jugador | null;
  existingTeam: Equipo | null;
  jugadores: Jugador[];
  equipos: Equipo[];
  dbStatus: boolean;
}

export async function fetchPageData(): Promise<PageData> {
  let user: any = null;
  let userRole: UserRole = "invitado";
  let existingPlayer: Jugador | null = null;
  let existingTeam: Equipo | null = null;
  let jugadores: Jugador[] = [];
  let equipos: Equipo[] = [];
  let dbStatus = false;

  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (hasSupabase) {
    try {
      const supabase = await createClient();

      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;

      if (user) {
        const { data: profile } = await (supabase
          .from("perfiles_usuario")
          .select("rol")
          .eq("user_id", user.id)
          .single() as any);

        if (profile?.rol) {
          userRole = profile.rol as UserRole;
        }

        if (userRole === "jugador") {
          const { data: player } = await (supabase
            .from("jugadores")
            .select("*")
            .eq("user_id", user.id)
            .single() as any);
          existingPlayer = player;
        } else if (userRole === "capitan") {
          const { data: team } = await (supabase
            .from("equipos")
            .select("*")
            .eq("capitan_id", user.id)
            .single() as any);
          existingTeam = team;
        }
      }

      const { data: dbJugadores } = await (supabase
        .from("jugadores")
        .select("*")
        .order("created_at", { ascending: false }) as any);

      const { data: dbEquipos } = await (supabase
        .from("equipos")
        .select("*")
        .order("created_at", { ascending: false }) as any);

      jugadores = dbJugadores || [];
      equipos = dbEquipos || [];
      dbStatus = true;
    } catch {
      dbStatus = false;
    }
  }

  if (!dbStatus || (jugadores.length === 0 && equipos.length === 0)) {
    jugadores = mockJugadores;
    equipos = mockEquipos;
  }

  return { user, userRole, existingPlayer, existingTeam, jugadores, equipos, dbStatus };
}
