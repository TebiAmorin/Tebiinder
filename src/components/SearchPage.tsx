/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { Database, UserRole } from "@/types/database";
import Matchmaker from "./Matchmaker";
import ProfileModal from "./ProfileModal";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface SearchPageProps {
  user: any | null;
  userRole?: UserRole;
  existingPlayer?: Jugador | null;
  existingTeam?: Equipo | null;
  jugadores: Jugador[];
  equipos: Equipo[];
  dbStatus: boolean;
}

export default function SearchPage({
  user,
  userRole = "invitado",
  existingPlayer = null,
  existingTeam = null,
  jugadores,
  equipos,
  dbStatus,
}: SearchPageProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);

  const handleSaveSuccess = () => {
    setShowProfileModal(false);
    window.location.reload();
  };

  // Show CTA if user is logged in but has no profile yet (still "invitado")
  const showCta = user && userRole === "invitado" && !ctaDismissed;
  // Show login CTA if not logged in
  const showLoginCta = !user && !ctaDismissed;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-8 max-w-6xl w-full mx-auto relative">
      {/* DB offline warning */}
      {!dbStatus && (
        <div className="w-full max-w-5xl bg-[#321303] border-4 border-amber-500 rounded-2xl p-4 mb-6 flex items-center gap-4 font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-3xl">&#9888;&#65039;</span>
          <div>
            <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider leading-none mb-1">
              Modo Demostracion
            </h4>
            <p className="text-[11px] text-zinc-300 leading-normal">
              Supabase no conectado. Mostrando datos de ejemplo.
            </p>
          </div>
        </div>
      )}

      {/* ── CTA BANNER: Logged in but no profile ── */}
      {showCta && (
        <div className="w-full max-w-5xl mb-6 bg-gradient-to-r from-[#FF5A00] to-orange-600 border-4 border-black rounded-2xl neo-shadow p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <button
            onClick={() => setCtaDismissed(true)}
            className="absolute top-2 right-3 text-white/60 hover:text-white text-lg font-bold"
          >
            &#10005;
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">&#127919;</span>
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white leading-none">
                &iquest;Que estas buscando?
              </h3>
              <p className="text-xs text-white/80 font-mono mt-1">
                Publica tu ficha de jugador o equipo y empieza a reclutar o encontrar roster.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="shrink-0 w-full sm:w-auto px-5 py-3 bg-white text-black border-3 border-black rounded-xl font-display font-bold text-base sm:text-lg uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100"
          >
            Crear Mi Ficha
          </button>
        </div>
      )}

      {/* ── CTA BANNER: Not logged in ── */}
      {showLoginCta && (
        <div className="w-full max-w-5xl mb-6 bg-[#150a24] border-4 border-white rounded-2xl neo-shadow p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <button
            onClick={() => setCtaDismissed(true)}
            className="absolute top-2 right-3 text-zinc-500 hover:text-white text-lg font-bold"
          >
            &#10005;
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">&#128274;</span>
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white leading-none">
                Entra para publicar tu ficha
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Login con Discord en un clic. Crea tu perfil de jugador o equipo en segundos.
              </p>
            </div>
          </div>
          <a
            href="/auth/login"
            className="shrink-0 w-full sm:w-auto px-5 py-3 bg-[#5865F2] text-white border-3 border-black rounded-xl font-display font-bold text-base sm:text-lg uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 text-center"
          >
            Discord Login
          </a>
        </div>
      )}

      {/* ── MATCHMAKER ── */}
      <Matchmaker initialJugadores={jugadores} initialEquipos={equipos} />

      {/* Profile Modal */}
      {showProfileModal && user && (
        <ProfileModal
          user={user}
          existingUserRole={userRole}
          existingPlayer={existingPlayer}
          existingTeam={existingTeam}
          onClose={() => setShowProfileModal(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </main>
  );
}
