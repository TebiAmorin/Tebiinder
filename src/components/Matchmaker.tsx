"use client";

import { useState, useMemo } from "react";
import type { Database } from "@/types/database";
import GamerCard from "./GamerCard";
import TeamCard from "./TeamCard";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface MatchmakerProps {
  initialJugadores: Jugador[];
  initialEquipos: Equipo[];
}

export default function Matchmaker({ initialJugadores, initialEquipos }: MatchmakerProps) {
  const [view, setView] = useState<"jugadores" | "equipos">("jugadores");
  const [regionFilter, setRegionFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "kd">("recent");

  // Reset filters when switching views
  const handleViewChange = (newView: "jugadores" | "equipos") => {
    setView(newView);
    setRegionFilter("all");
    setPlatformFilter("all");
    setRoleFilter("all");
    setSearchQuery("");
    setSortBy("recent");
  };

  // Filter and Sort players
  const filteredJugadores = useMemo(() => {
    let result = [...initialJugadores];

    if (regionFilter !== "all") {
      result = result.filter((j) => j.region === regionFilter);
    }
    if (platformFilter !== "all") {
      result = result.filter((j) => j.plataforma === platformFilter);
    }
    if (roleFilter !== "all") {
      result = result.filter((j) => j.rol_principal === roleFilter || j.rol_secundario === roleFilter);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.discord_username.toLowerCase().includes(q) ||
          (j.ubisoft_id && j.ubisoft_id.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "kd") {
      result.sort((a, b) => Number(b.kd ?? 0) - Number(a.kd ?? 0));
    } else {
      // "recent" or default
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Keep featured players at the very top
    result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

    return result;
  }, [initialJugadores, regionFilter, platformFilter, roleFilter, searchQuery, sortBy]);

  // Filter and Sort teams
  const filteredEquipos = useMemo(() => {
    let result = [...initialEquipos];

    if (regionFilter !== "all") {
      result = result.filter((e) => e.region === regionFilter);
    }
    if (platformFilter !== "all") {
      result = result.filter((e) => e.plataforma === platformFilter);
    }
    if (roleFilter !== "all") {
      result = result.filter((e) => e.rol_buscado === roleFilter);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.nombre_equipo.toLowerCase().includes(q) ||
          e.discord_username_capitan.toLowerCase().includes(q) ||
          (e.descripcion && e.descripcion.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "kd") {
      result.sort((a, b) => Number(b.kd_medio ?? 0) - Number(a.kd_medio ?? 0));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Keep featured teams at the top
    result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

    return result;
  }, [initialEquipos, regionFilter, platformFilter, roleFilter, searchQuery, sortBy]);

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* 1. Tactical HUD View Selectors */}
      <div className="flex bg-black/40 border-2 border-border-card rounded-xl p-1.5 md:p-2 gap-2 clip-tactical">
        <button
          onClick={() => handleViewChange("jugadores")}
          className={`flex-1 py-3 text-sm md:text-base font-display font-black tracking-wider uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            view === "jugadores"
              ? "bg-accent-orange text-white shadow-[0_0_12px_rgba(255,94,26,0.3)] border border-accent-orange/40"
              : "text-text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Agentes Libres (LFT)
        </button>

        <button
          onClick={() => handleViewChange("equipos")}
          className={`flex-1 py-3 text-sm md:text-base font-display font-black tracking-wider uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            view === "equipos"
              ? "bg-accent-blue text-black shadow-[0_0_12px_rgba(0,229,255,0.3)] border border-accent-blue/40"
              : "text-text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Escuadras (LFG)
        </button>
      </div>

      {/* 2. HUD Filter Console */}
      <div className="bg-bg-card border-2 border-border-card rounded-xl p-5 clip-tactical-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-orange animate-ping" />
          <h3 className="font-display font-bold uppercase text-xs tracking-widest text-text-secondary">
            CONSOLA DE FILTROS TÁCTICOS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Search bar */}
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Buscar</label>
            <div className="relative">
              <input
                type="text"
                placeholder={view === "jugadores" ? "Ubisoft ID, Discord..." : "Nombre de escuadra..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-3 pr-8 text-white focus:outline-none focus:border-accent-orange font-mono text-xs transition-colors"
              />
              <span className="absolute right-2.5 top-3 text-zinc-500">🔍</span>
            </div>
          </div>

          {/* Region selector */}
          <div>
            <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Región</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono transition-colors cursor-pointer"
            >
              <option value="all">Cualquier Región</option>
              <option value="eu-west">Europa Oeste (EUW)</option>
              <option value="eu-east">Europa Este (EUE)</option>
              <option value="na">Norteamérica (NA)</option>
              <option value="latam">Latinoamérica (LATAM)</option>
              <option value="apac">Asia Pacífico (APAC)</option>
            </select>
          </div>

          {/* Platform selector */}
          <div>
            <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Plataforma</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono transition-colors cursor-pointer"
            >
              <option value="all">Todas las plataformas</option>
              <option value="pc">PC (Ubisoft)</option>
              <option value="playstation">PlayStation</option>
              <option value="xbox">Xbox</option>
            </select>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
              {view === "jugadores" ? "Rol" : "Rol Buscado"}
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono transition-colors cursor-pointer"
            >
              <option value="all">Cualquier Rol</option>
              <option value="entry-fragger">Entry Fragger</option>
              <option value="support">Support</option>
              <option value="flex">Flex</option>
              <option value="anchor">Anchor</option>
              <option value="roamer">Roamer</option>
              <option value="hard-breach">Hard Breach</option>
              <option value="intel">Intel</option>
            </select>
          </div>
        </div>

        {/* Sorting and result count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-[11px] font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <span>Resultados encontrados:</span>
            <span className={`px-2 py-0.5 rounded bg-white/5 font-bold ${view === "jugadores" ? "text-accent-orange" : "text-accent-blue"}`}>
              {view === "jugadores" ? filteredJugadores.length : filteredEquipos.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500">ORDENAR POR:</span>
            <button
              onClick={() => setSortBy("recent")}
              className={`px-2 py-1 rounded transition-colors uppercase font-bold ${
                sortBy === "recent"
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-text-secondary"
              }`}
            >
              Recientes
            </button>
            <button
              onClick={() => setSortBy("kd")}
              className={`px-2 py-1 rounded transition-colors uppercase font-bold ${
                sortBy === "kd"
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-text-secondary"
              }`}
            >
              K/D Ratio
            </button>
          </div>
        </div>
      </div>

      {/* 3. Feeds Display */}
      <div className="space-y-4">
        {view === "jugadores" ? (
          filteredJugadores.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredJugadores.map((jugador) => (
                <GamerCard key={jugador.id} jugador={jugador} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-card border-2 border-border-card rounded-xl border-dashed p-6">
              <span className="text-4xl block mb-3">📡</span>
              <h4 className="font-display font-bold uppercase text-text-secondary mb-1">
                No se encontraron agentes libres
              </h4>
              <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
                Prueba ajustando los filtros tácticos o buscando otros términos.
              </p>
            </div>
          )
        ) : (
          filteredEquipos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredEquipos.map((equipo) => (
                <TeamCard key={equipo.id} equipo={equipo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-card border-2 border-border-card rounded-xl border-dashed p-6">
              <span className="text-4xl block mb-3">🏟️</span>
              <h4 className="font-display font-bold uppercase text-text-secondary mb-1">
                No se encontraron escuadras LFG
              </h4>
              <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
                No hay escuadras buscando ese rol actualmente. ¡Prueba a crear tu propio equipo!
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
