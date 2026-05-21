/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { mockJugadores, mockEquipos } from "@/lib/mockData";
import Dashboard from "@/components/Dashboard";
import type { Database, UserRole } from "@/types/database";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

export default async function Home() {
  let user: any = null;
  let userRole: UserRole = "invitado";
  let existingPlayer: Jugador | null = null;
  let existingTeam: Equipo | null = null;
  let jugadores: Jugador[] = [];
  let equipos: Equipo[] = [];
  let dbStatus = false;

  // Verify if Supabase URL is set
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (hasSupabase) {
    try {
      const supabase = await createClient();
      
      // 1. Fetch current authenticated user session
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;

      if (user) {
        // 2. Fetch general user profile role (cast to any to bypass Supabase generic type issues)
        const { data: profile } = await (supabase
          .from("perfiles_usuario")
          .select("rol")
          .eq("user_id", user.id)
          .single() as any);
        
        if (profile?.rol) {
          userRole = profile.rol as UserRole;
        }

        // 3. Fetch specific player or team data if applicable
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

      // 4. Fetch all player profiles LFT
      const { data: dbJugadores } = await (supabase
        .from("jugadores")
        .select("*")
        .order("created_at", { ascending: false }) as any);
      
      // 5. Fetch all team profiles LFG
      const { data: dbEquipos } = await (supabase
        .from("equipos")
        .select("*")
        .order("created_at", { ascending: false }) as any);

      jugadores = dbJugadores || [];
      equipos = dbEquipos || [];
      dbStatus = true;
    } catch {
      // Graceful fallback to demo mode on DB errors
      dbStatus = false;
    }
  }

  // Gracefully fall back to rich demo data if DB is empty or disconnected
  if (!dbStatus || (jugadores.length === 0 && equipos.length === 0)) {
    jugadores = mockJugadores;
    equipos = mockEquipos;
  }

  return (
    <Dashboard
      user={user}
      userRole={userRole}
      existingPlayer={existingPlayer}
      existingTeam={existingTeam}
      jugadores={jugadores}
      equipos={equipos}
      dbStatus={dbStatus}
    />
  );
}
