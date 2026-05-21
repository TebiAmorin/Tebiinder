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

  const handleSaveSuccess = () => {
    setShowProfileModal(false);
    window.location.reload();
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12 max-w-6xl w-full mx-auto relative">
      {/* 1. Header Area / Navbar */}
      <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b-4 border-white/20">
        {/* Logo and Status */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            {/* Sticker Logo box */}
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF5A00] to-orange-600 border-4 border-white font-display font-bold text-4xl text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform flex items-center justify-center select-none">
              T
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-display font-bold tracking-wide uppercase text-white leading-none">
                Tebiinder
              </h1>
              <span className="px-2 py-0.5 border-2 border-white bg-black/40 rounded font-mono font-bold text-[9px] text-[#00F5D4] tracking-widest uppercase">
                BETA v1.2
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-widest mt-1">
              R6 Siege Tactical Matchmaking
            </p>
          </div>
        </div>

        {/* User Login / Badge */}
        <div className="flex items-center gap-4 font-mono text-xs">
          {user ? (
            <div className="flex items-center gap-3 bg-[#150a24] border-4 border-white p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* User Avatar Sticker */}
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name || "Gamer"}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                />
              ) : (
                <div className="w-12 h-12 bg-zinc-800 rounded-xl border-2 border-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-display font-bold text-2xl text-white uppercase">
                  {user.user_metadata?.full_name?.substring(0, 2) || "U"}
                </div>
              )}

              <div className="text-left font-mono">
                <span className="block font-bold text-white text-sm leading-tight truncate max-w-[120px]">
                  {user.user_metadata?.full_name || "Agente"}
                </span>
                <span className="text-[9px] text-[#00F5D4] uppercase font-bold tracking-wider">
                  Rol: {userRole}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 bg-[#FF5A00] text-white border-4 border-black rounded-xl text-xs font-display font-bold uppercase tracking-wide neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100"
                >
                  Ficha
                </button>
                <a
                  href="/auth/logout"
                  className="px-2.5 py-2 border-2 border-white text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase transition-colors"
                >
                  Salir
                </a>
              </div>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="px-6 py-3 bg-[#FF5A00] text-white border-4 border-black font-display font-bold text-xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 flex items-center gap-2"
            >
              🔑 Discord Login
            </a>
          )}
        </div>
      </header>

      {/* 2. Developer Warning / Offline Database Neo-Brutalist Banner */}
      {!dbStatus && (
        <div className="w-full max-w-5xl bg-[#321303] border-4 border-amber-500 rounded-3xl p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-5 font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider leading-none mb-1">
                Base de Datos en Modo Demostración
              </h4>
              <p className="text-[11px] text-zinc-300 leading-normal max-w-2xl">
                Supabase no está configurado o conectado. El sistema ha activado el feed estático para que puedas testear el buscador de equipos y la interfaz del Matchmaker de inmediato.
              </p>
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-white/10 pl-3 md:pl-0 md:pr-4">
            <span>Configura las variables en tu</span>
            <code className="block text-amber-400 font-bold mt-1 text-sm bg-black/40 px-2 py-0.5 rounded border border-white/10">
              .env.local
            </code>
          </div>
        </div>
      )}

      {/* 3. Hero Introduction Poster Style */}
      <section className="text-center max-w-3xl space-y-4 mb-14 select-none">
        {/* Large poster-style vector badge placeholder to replicate the R6 poster vibe */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-3 bg-[#150a24] border-4 border-white rounded-3xl px-6 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-[1deg] transition-transform duration-200">
            <span className="font-display font-bold text-4xl text-[#00F5D4]">6</span>
            <span className="w-2.5 h-6 bg-white rounded-full rotate-[15deg]"></span>
            <span className="font-display font-bold text-4xl text-[#FF5A00]">LFT/LFG</span>
          </div>
        </div>

        {/* Poster Heading: TEBIINDER */}
        <h2 className="text-6xl sm:text-8xl md:text-9xl font-display font-bold tracking-tight uppercase leading-none text-white">
          TEBIINDER
        </h2>
        {/* Subtitle Poster-heading: TODAVÍA NO TIENES EQUIPO?! */}
        <h3 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold uppercase text-white tracking-tight leading-none mt-1">
          ¡¿TODAVÍA NO TIENES EQUIPO?!
        </h3>

        <p className="text-zinc-200 text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed pt-2">
          La central de reclutamiento definitiva para escuadras competitivas y free agents de Rainbow Six Siege. Encuentra tu roster, analiza estadísticas y conecta en Discord de golpe.
        </p>

        {/* Dynamic Network stats strip - Sticker Badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-4 font-mono text-xs font-bold">
          <span className="px-3.5 py-1.5 bg-[#150a24] border-2 border-white rounded-full text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] border border-black" />
            LFT: {jugadores.length} Agentes
          </span>
          <span className="px-3.5 py-1.5 bg-[#150a24] border-2 border-white rounded-full text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4] border border-black" />
            LFG: {equipos.length} Escuadras
          </span>
          <span className="px-3.5 py-1.5 bg-black/60 border-2 border-white rounded-full text-[#00F5D4] flex items-center gap-1.5">
            ⚔️ RED: ACTIVA
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
