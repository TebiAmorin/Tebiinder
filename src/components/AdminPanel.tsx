/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import type { Database } from "@/types/database";
import { toggleDestacado } from "@/app/actions/profile";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface AdminPanelProps {
  jugadores: Jugador[];
  equipos: Equipo[];
}

export default function AdminPanel({ jugadores, equipos }: AdminPanelProps) {
  const [tab, setTab] = useState<"jugadores" | "equipos">("jugadores");
  const [localJugadores, setLocalJugadores] = useState(jugadores);
  const [localEquipos, setLocalEquipos] = useState(equipos);
  const [isPending, startTransition] = useTransition();
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleToggleJugador = (jugador: Jugador) => {
    const nuevoValor = !jugador.destacado;
    // Optimistic update
    setLocalJugadores((prev) =>
      prev.map((j) => (j.id === jugador.id ? { ...j, destacado: nuevoValor } : j))
    );
    setLastAction(
      `${nuevoValor ? "Destacado" : "Quitado"}: ${jugador.discord_username}`
    );

    startTransition(async () => {
      try {
        await toggleDestacado("jugadores", jugador.id, nuevoValor);
      } catch (err: any) {
        // Revert on error
        setLocalJugadores((prev) =>
          prev.map((j) => (j.id === jugador.id ? { ...j, destacado: !nuevoValor } : j))
        );
        setLastAction(`Error: ${err.message}`);
      }
    });
  };

  const handleToggleEquipo = (equipo: Equipo) => {
    const nuevoValor = !equipo.destacado;
    setLocalEquipos((prev) =>
      prev.map((e) => (e.id === equipo.id ? { ...e, destacado: nuevoValor } : e))
    );
    setLastAction(
      `${nuevoValor ? "Destacado" : "Quitado"}: ${equipo.nombre_equipo}`
    );

    startTransition(async () => {
      try {
        await toggleDestacado("equipos", equipo.id, nuevoValor);
      } catch (err: any) {
        setLocalEquipos((prev) =>
          prev.map((e) => (e.id === equipo.id ? { ...e, destacado: !nuevoValor } : e))
        );
        setLastAction(`Error: ${err.message}`);
      }
    });
  };

  const destacadosJugadores = localJugadores.filter((j) => j.destacado).length;
  const destacadosEquipos = localEquipos.filter((e) => e.destacado).length;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-8 max-w-5xl w-full mx-auto">
      {/* Header */}
      <div className="w-full mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 border-3 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wide text-white leading-none">
              Modo Streamer
            </h1>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
              Panel de Administracion &middot; Destaca perfiles en tiempo real
            </p>
          </div>
        </div>

        {/* Live status strip */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 border-2 border-red-500 rounded-xl text-red-400 font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Panel Admin
          </span>
          <span className="px-3 py-1.5 bg-[#150a24] border-2 border-white/20 rounded-xl text-[#FF5A00] font-bold">
            {destacadosJugadores} jugadores destacados
          </span>
          <span className="px-3 py-1.5 bg-[#150a24] border-2 border-white/20 rounded-xl text-[#00F5D4] font-bold">
            {destacadosEquipos} equipos destacados
          </span>
          {isPending && (
            <span className="px-3 py-1.5 bg-amber-950/40 border-2 border-amber-500 rounded-xl text-amber-400 font-bold animate-pulse">
              Guardando...
            </span>
          )}
        </div>

        {/* Last action toast */}
        {lastAction && (
          <div
            className={`px-4 py-2 rounded-xl border-2 text-xs font-mono font-bold ${
              lastAction.startsWith("Error")
                ? "bg-red-950/40 border-red-500 text-red-300"
                : "bg-emerald-950/40 border-emerald-500 text-emerald-300"
            }`}
          >
            {lastAction}
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="w-full flex gap-3 mb-6">
        <button
          onClick={() => setTab("jugadores")}
          className={`flex-1 py-3 px-4 font-display font-bold text-lg sm:text-xl uppercase tracking-wider border-4 transition-all duration-100 rounded-xl flex items-center justify-center gap-2 ${
            tab === "jugadores"
              ? "bg-[#FF5A00] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
              : "bg-bg-card border-white/30 text-zinc-400 hover:text-white"
          }`}
        >
          Jugadores ({localJugadores.length})
        </button>
        <button
          onClick={() => setTab("equipos")}
          className={`flex-1 py-3 px-4 font-display font-bold text-lg sm:text-xl uppercase tracking-wider border-4 transition-all duration-100 rounded-xl flex items-center justify-center gap-2 ${
            tab === "equipos"
              ? "bg-[#00F5D4] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
              : "bg-bg-card border-white/30 text-zinc-400 hover:text-white"
          }`}
        >
          Equipos ({localEquipos.length})
        </button>
      </div>

      {/* Jugadores List */}
      {tab === "jugadores" && (
        <div className="w-full space-y-3">
          {localJugadores.length === 0 ? (
            <EmptyState text="No hay jugadores registrados" />
          ) : (
            localJugadores.map((jugador) => (
              <div
                key={jugador.id}
                className={`flex items-center justify-between gap-4 p-4 bg-bg-card border-4 rounded-2xl transition-all ${
                  jugador.destacado
                    ? "border-[#FF5A00] shadow-[4px_4px_0px_0px_rgba(255,90,0,0.4)]"
                    : "border-white/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  {jugador.discord_avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={jugador.discord_avatar}
                      alt={jugador.discord_username}
                      className="w-10 h-10 rounded-lg border-2 border-white/30 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg border-2 border-white/30 flex items-center justify-center font-display font-bold text-lg text-zinc-400 shrink-0">
                      {jugador.discord_username.substring(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-bold text-lg uppercase tracking-tight text-white leading-none truncate">
                        {jugador.discord_username.split("#")[0]}
                      </h4>
                      <span className="px-1.5 py-0.5 border border-white/20 text-[9px] font-mono font-bold bg-white/5 rounded uppercase text-zinc-400">
                        {jugador.plataforma}
                      </span>
                      {jugador.destacado && (
                        <span className="px-2 py-0.5 bg-[#FF5A00] text-white text-[9px] font-mono font-bold rounded uppercase border border-black">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-400">
                      <span className="uppercase">{jugador.rol_principal.replace("-", " ")}</span>
                      <span>&middot;</span>
                      <span>KD: {jugador.kd ? Number(jugador.kd).toFixed(2) : "N/A"}</span>
                      <span>&middot;</span>
                      <span>{jugador.rango || "Sin rango"}</span>
                    </div>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleJugador(jugador)}
                  disabled={isPending}
                  className={`shrink-0 px-4 py-2.5 border-3 border-black rounded-xl font-display font-bold text-sm uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-all duration-100 disabled:opacity-50 ${
                    jugador.destacado
                      ? "bg-[#FF5A00] text-white"
                      : "bg-[#1c0f2f] text-zinc-300 border-white/30"
                  }`}
                >
                  {jugador.destacado ? "Quitar" : "Destacar"}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Equipos List */}
      {tab === "equipos" && (
        <div className="w-full space-y-3">
          {localEquipos.length === 0 ? (
            <EmptyState text="No hay equipos registrados" />
          ) : (
            localEquipos.map((equipo) => (
              <div
                key={equipo.id}
                className={`flex items-center justify-between gap-4 p-4 bg-bg-card border-4 rounded-2xl transition-all ${
                  equipo.destacado
                    ? "border-[#00F5D4] shadow-[4px_4px_0px_0px_rgba(0,245,212,0.4)]"
                    : "border-white/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Team Initials */}
                  <div className="w-10 h-10 bg-[#2d1b54] rounded-lg border-2 border-white/30 flex items-center justify-center font-display font-bold text-lg text-white shrink-0">
                    {equipo.nombre_equipo
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-bold text-lg uppercase tracking-tight text-white leading-none truncate">
                        {equipo.nombre_equipo}
                      </h4>
                      <span className="px-1.5 py-0.5 border border-white/20 text-[9px] font-mono font-bold bg-white/5 rounded uppercase text-zinc-400">
                        {equipo.plataforma}
                      </span>
                      {equipo.destacado && (
                        <span className="px-2 py-0.5 bg-[#00F5D4] text-black text-[9px] font-mono font-bold rounded uppercase border border-black">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-400">
                      <span>Busca: {equipo.rol_buscado.replace("-", " ")}</span>
                      <span>&middot;</span>
                      <span>KD medio: {equipo.kd_medio ? Number(equipo.kd_medio).toFixed(2) : "N/A"}</span>
                      <span>&middot;</span>
                      <span>Cap: {equipo.discord_username_capitan.split("#")[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleEquipo(equipo)}
                  disabled={isPending}
                  className={`shrink-0 px-4 py-2.5 border-3 border-black rounded-xl font-display font-bold text-sm uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-all duration-100 disabled:opacity-50 ${
                    equipo.destacado
                      ? "bg-[#00F5D4] text-black"
                      : "bg-[#1c0f2f] text-zinc-300 border-white/30"
                  }`}
                >
                  {equipo.destacado ? "Quitar" : "Destacar"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-12 bg-bg-card border-4 border-white/20 rounded-2xl">
      <span className="text-4xl block mb-3">&#128274;</span>
      <p className="font-display font-bold text-xl uppercase tracking-wider text-zinc-400">{text}</p>
    </div>
  );
}
