/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { Database, UserRole } from "@/types/database";
import Matchmaker from "./Matchmaker";
import ProfileModal from "./ProfileModal";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface DashboardProps {
  user: any | null;
  userRole?: UserRole;
  existingPlayer?: Jugador | null;
  existingTeam?: Equipo | null;
  jugadores: Jugador[];
  equipos: Equipo[];
  dbStatus: boolean;
}

export default function Dashboard({
  user,
  userRole = "invitado",
  existingPlayer = null,
  existingTeam = null,
  jugadores,
  equipos,
  dbStatus,
}: DashboardProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Refresh page helper after saving profile
  const handleSaveSuccess = () => {
    setShowProfileModal(false);
    // Force refresh the server data
    window.location.reload();
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12 max-w-6xl w-full mx-auto relative">
      {/* HUD scanning grid lines effect */}
      <div className="absolute inset-0 bg-grid pointer-events-none -z-10" />

      {/* 1. Header Area */}
      <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        {/* Logo and Status */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            {/* Logo box */}
            <div className="w-12 h-12 bg-gradient-to-br from-accent-orange to-amber-600 rounded-lg border-2 border-white flex items-center justify-center font-display font-black text-xl text-white shadow-[0_0_15px_rgba(255,94,26,0.4)] group-hover:rotate-6 transition-transform">
              T
            </div>
            {/* Tiny HUD corner accents */}
            <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-accent-orange" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-accent-orange" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-black tracking-wider uppercase text-white">
                Tebiinder
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-accent-orange/10 border border-accent-orange/30 text-[9px] font-mono text-accent-orange font-bold tracking-widest uppercase">
                BETA v1.1
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
              R6 Siege Tactical Recruitment
            </p>
          </div>
        </div>

        {/* User Login / Badge */}
        <div className="flex items-center gap-4 font-mono text-xs">
          {user ? (
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-2 rounded-xl">
              {/* User Avatar */}
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name || "Gamer"}
                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                />
              ) : (
                <div className="w-10 h-10 bg-zinc-800 rounded-lg border border-white/10 flex items-center justify-center font-bold text-white uppercase">
                  {user.user_metadata?.full_name?.substring(0, 2) || "U"}
                </div>
              )}

              <div className="text-left">
                <span className="block font-bold text-white text-xs leading-none">
                  {user.user_metadata?.full_name || "Agente"}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">
                  Rol: {userRole}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-3 py-1.5 bg-accent-orange text-white border border-accent-orange/50 rounded-lg text-[10px] font-bold font-display uppercase tracking-wider hover:bg-transparent hover:text-accent-orange transition-all"
                >
                  Ficha
                </button>
                <a
                  href="/auth/logout"
                  className="px-2.5 py-1.5 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg text-[10px] transition-colors"
                >
                  Salir
                </a>
              </div>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="px-6 py-2.5 font-display font-black bg-accent-orange text-white rounded-lg border-2 border-white hover:bg-transparent hover:text-accent-orange transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(255,94,26,0.2)]"
            >
              🔑 Discord Login
            </a>
          )}
        </div>
      </header>

      {/* 2. Developer Warning / Offline Database HUD Banner */}
      {!dbStatus && (
        <div className="w-full max-w-5xl bg-amber-950/20 border-2 border-amber-500/40 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs clip-tactical-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">⚠️</span>
            <div>
              <h4 className="font-bold text-amber-400 uppercase tracking-wider">
                BASE DE DATOS EN MODO CONSOLA / DEMO
              </h4>
              <p className="text-[11px] text-zinc-400 leading-normal mt-0.5">
                Supabase no está conectado todavía. El sistema muestra agentes y escuadras de demostración altamente detallados para interactuar en tiempo real.
              </p>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 text-left md:text-right border-l md:border-l-0 md:border-r border-white/10 pl-3 md:pl-0 md:pr-4">
            <span>Configura las variables de tu</span>
            <code className="block text-amber-500 font-bold mt-0.5">.env.local</code>
          </div>
        </div>
      )}

      {/* 3. Hero Introduction */}
      <section className="text-center max-w-2xl space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase leading-none text-white">
          Encuentra tu Roster.
          <br />
          <span className="text-accent-orange">Completa tu escuadra.</span>
        </h2>
        <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed">
          La central de emparejamiento táctico para equipos y free agents competitivos de Rainbow Six Siege. Filtra perfiles, analiza rangos y conecta en Discord.
        </p>

        {/* Dynamic Network stats strip */}
        <div className="flex justify-center gap-4 pt-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
            LFT: {jugadores.length} Agentes
          </span>
          <span className="text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            LFG: {equipos.length} Escuadras
          </span>
          <span className="text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            RED: ONLINE
          </span>
        </div>
      </section>

      {/* 4. Matchmaker Console */}
      <Matchmaker initialJugadores={jugadores} initialEquipos={equipos} />

      {/* 5. Profile Edit Modal */}
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
