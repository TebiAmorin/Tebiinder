"use client";

import { useState, useMemo, useEffect } from "react";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import GamerCard from "./GamerCard";
import TeamCard from "./TeamCard";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface MatchmakerProps {
  initialJugadores: Jugador[];
  initialEquipos: Equipo[];
}

// ── Rank tier utility (client-side) ──
// Maps rank strings like "Diamond III" to a numeric tier for filtering/sorting
const RANK_TIERS: Record<string, number> = {
  copper: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
  emerald: 5,
  diamond: 6,
  champion: 7,
};

function getRankTier(rank: string | null): number {
  if (!rank) return -1;
  const r = rank.toLowerCase();
  for (const [tier, value] of Object.entries(RANK_TIERS)) {
    if (r.includes(tier)) return value;
  }
  return -1;
}

// Rank sub-order: "Diamond I" > "Diamond V" — split number suffix
function getRankPrecise(rank: string | null): number {
  if (!rank) return -1;
  const tier = getRankTier(rank);
  if (tier === -1) return -1;
  // Champion has no sub-tier
  if (tier === 7) return 700;
  // Extract roman numeral (V=1, IV=2, III=3, II=4, I=5)
  const r = rank.toUpperCase();
  if (r.endsWith(" I") && !r.endsWith("II") && !r.endsWith("III")) return tier * 100 + 5;
  if (r.endsWith(" II") && !r.endsWith("III")) return tier * 100 + 4;
  if (r.endsWith(" III")) return tier * 100 + 3;
  if (r.endsWith(" IV")) return tier * 100 + 2;
  if (r.endsWith(" V")) return tier * 100 + 1;
  return tier * 100;
}

const RANK_FILTER_OPTIONS = [
  { value: "all", label: "Cualquier Rango" },
  { value: "champion", label: "Champion" },
  { value: "diamond", label: "Diamond +" },
  { value: "emerald", label: "Emerald +" },
  { value: "platinum", label: "Platinum +" },
  { value: "gold", label: "Gold +" },
  { value: "silver", label: "Silver +" },
  { value: "bronze", label: "Bronze +" },
  { value: "copper", label: "Copper +" },
];

export default function Matchmaker({ initialJugadores, initialEquipos }: MatchmakerProps) {
  const [jugadores, setJugadores] = useState<Jugador[]>(initialJugadores);
  const [equipos, setEquipos] = useState<Equipo[]>(initialEquipos);
  const [view, setView] = useState<"jugadores" | "equipos">("jugadores");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "kd" | "rank">("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);

  // Count active filters (for badge)
  const activeFilterCount = [platformFilter, roleFilter, rankFilter].filter((f) => f !== "all").length;

  // ── Supabase Realtime subscription ──
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("matchmaker-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jugadores" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Jugador;
            setJugadores((prev) =>
              prev.map((j) => (j.id === updated.id ? updated : j))
            );
          } else if (payload.eventType === "INSERT") {
            const inserted = payload.new as Jugador;
            setJugadores((prev) => [inserted, ...prev]);
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setJugadores((prev) => prev.filter((j) => j.id !== deleted.id));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "equipos" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Equipo;
            setEquipos((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            );
          } else if (payload.eventType === "INSERT") {
            const inserted = payload.new as Equipo;
            setEquipos((prev) => [inserted, ...prev]);
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setEquipos((prev) => prev.filter((e) => e.id !== deleted.id));
          }
        }
      )
      .subscribe((status) => {
        setRealtimeActive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setJugadores(initialJugadores);
  }, [initialJugadores]);

  useEffect(() => {
    setEquipos(initialEquipos);
  }, [initialEquipos]);

  const handleViewChange = (newView: "jugadores" | "equipos") => {
    setView(newView);
    setPlatformFilter("all");
    setRoleFilter("all");
    setRankFilter("all");
    setSearchQuery("");
    setSortBy("recent");
  };

  const clearFilters = () => {
    setPlatformFilter("all");
    setRoleFilter("all");
    setRankFilter("all");
    setSearchQuery("");
  };

  // ── Filter and Sort players ──
  const filteredJugadores = useMemo(() => {
    let result = [...jugadores];

    if (platformFilter !== "all") {
      result = result.filter((j) => j.plataforma === platformFilter);
    }
    if (roleFilter !== "all") {
      result = result.filter((j) => j.rol_principal === roleFilter || j.rol_secundario === roleFilter);
    }
    if (rankFilter !== "all") {
      const minTier = RANK_TIERS[rankFilter] ?? 0;
      result = result.filter((j) => getRankTier(j.rango) >= minTier);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.discord_username.toLowerCase().includes(q) ||
          (j.ubisoft_id && j.ubisoft_id.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "kd") {
      result.sort((a, b) => Number(b.kd ?? 0) - Number(a.kd ?? 0));
    } else if (sortBy === "rank") {
      result.sort((a, b) => getRankPrecise(b.rango) - getRankPrecise(a.rango));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Destacados always on top
    result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

    return result;
  }, [jugadores, platformFilter, roleFilter, rankFilter, searchQuery, sortBy]);

  // ── Filter and Sort teams ──
  const filteredEquipos = useMemo(() => {
    let result = [...equipos];

    if (platformFilter !== "all") {
      result = result.filter((e) => e.plataforma === platformFilter);
    }
    if (roleFilter !== "all") {
      result = result.filter((e) => e.rol_buscado === roleFilter);
    }
    if (rankFilter !== "all") {
      const minTier = RANK_TIERS[rankFilter] ?? 0;
      result = result.filter((e) => getRankTier(e.rango_medio) >= minTier);
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

    if (sortBy === "kd") {
      result.sort((a, b) => Number(b.kd_medio ?? 0) - Number(a.kd_medio ?? 0));
    } else if (sortBy === "rank") {
      result.sort((a, b) => getRankPrecise(b.rango_medio) - getRankPrecise(a.rango_medio));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

    return result;
  }, [equipos, platformFilter, roleFilter, rankFilter, searchQuery, sortBy]);

  const resultCount = view === "jugadores" ? filteredJugadores.length : filteredEquipos.length;
  const selectClass = "w-full bg-[#1c0f2f] border-3 border-white text-white rounded-xl py-3 px-3 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer min-h-[44px]";

  return (
    <div className="w-full max-w-5xl space-y-5">
      {/* ── View Selectors ── */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={() => handleViewChange("jugadores")}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wide uppercase border-4 border-black transition-all duration-100 flex items-center justify-center gap-2 sm:gap-3 ${
            view === "jugadores"
              ? "bg-[#FF5A00] text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
              : "bg-bg-card border-white text-zinc-400 hover:text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          }`}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Agentes Libres</span>
          <span className="sm:hidden">LFT</span>
        </button>

        <button
          onClick={() => handleViewChange("equipos")}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wide uppercase border-4 border-black transition-all duration-100 flex items-center justify-center gap-2 sm:gap-3 ${
            view === "equipos"
              ? "bg-[#00F5D4] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
              : "bg-bg-card border-white text-zinc-400 hover:text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          }`}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="hidden sm:inline">Escuadras</span>
          <span className="sm:hidden">LFG</span>
        </button>
      </div>

      {/* ── Compact Filter Bar ── */}
      <div className="bg-bg-card border-4 border-white rounded-2xl sm:rounded-3xl neo-shadow-lg overflow-hidden">
        {/* Always visible: Search + Toggle + Count */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Row 1: Search + Filter toggle */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={view === "jugadores" ? "Buscar jugador..." : "Buscar escuadra..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c0f2f] border-3 border-white text-white rounded-xl py-3 pl-10 pr-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] placeholder-zinc-500 min-h-[44px]"
              />
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`shrink-0 px-4 py-3 border-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all duration-100 flex items-center gap-2 min-h-[44px] ${
                filtersOpen || activeFilterCount > 0
                  ? "bg-[#FF5A00] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-[#1c0f2f] border-white text-zinc-300 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-mono font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <svg className={`w-3 h-3 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Realtime indicator */}
            {realtimeActive && (
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider shrink-0 self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En vivo
              </span>
            )}
          </div>

          {/* Row 2: Sort + Count (always visible) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg border-2 border-white text-sm font-bold bg-black/60 ${view === "jugadores" ? "text-[#FF5A00]" : "text-[#00F5D4]"}`}>
                {resultCount}
              </span>
              <span className="text-zinc-400">resultados</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-bold hidden sm:inline">ORDENAR:</span>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-2 border-2 rounded-xl transition-all duration-100 uppercase font-bold text-[11px] min-h-[38px] ${
                  sortBy === "recent"
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-transparent border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                Nuevo
              </button>
              <button
                onClick={() => setSortBy("kd")}
                className={`px-3 py-2 border-2 rounded-xl transition-all duration-100 uppercase font-bold text-[11px] min-h-[38px] ${
                  sortBy === "kd"
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-transparent border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                K/D
              </button>
              <button
                onClick={() => setSortBy("rank")}
                className={`px-3 py-2 border-2 rounded-xl transition-all duration-100 uppercase font-bold text-[11px] min-h-[38px] ${
                  sortBy === "rank"
                    ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-transparent border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                Rango
              </button>
            </div>
          </div>
        </div>

        {/* ── Collapsible Filters Panel ── */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            filtersOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t-2 border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {/* Platform */}
              <div>
                <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1.5 text-[10px] font-mono">
                  Plataforma
                </label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">Todas</option>
                  <option value="pc">PC (Ubisoft)</option>
                  <option value="playstation">PlayStation</option>
                  <option value="xbox">Xbox</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1.5 text-[10px] font-mono">
                  {view === "jugadores" ? "Rol" : "Rol Buscado"}
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={selectClass}
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

              {/* Rank (minimum tier) */}
              <div>
                <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1.5 text-[10px] font-mono">
                  Rango Minimo
                </label>
                <select
                  value={rankFilter}
                  onChange={(e) => setRankFilter(e.target.value)}
                  className={selectClass}
                >
                  {RANK_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear filters button */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-2 text-xs font-mono font-bold text-red-400 border-2 border-red-400/30 rounded-xl hover:bg-red-950/30 transition-colors uppercase tracking-wider min-h-[38px]"
              >
                Limpiar filtros ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Feeds Display ── */}
      <div className="space-y-4">
        {view === "jugadores" ? (
          filteredJugadores.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {filteredJugadores.map((jugador) => (
                <GamerCard key={jugador.id} jugador={jugador} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-card border-4 border-white rounded-3xl neo-shadow p-6">
              <span className="text-5xl block mb-4">&#128225;</span>
              <h4 className="font-display font-bold uppercase text-xl sm:text-2xl text-zinc-400 mb-1 leading-none">
                No se encontraron agentes libres
              </h4>
              <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
                Prueba ajustando los filtros o buscando otros terminos.
              </p>
            </div>
          )
        ) : (
          filteredEquipos.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {filteredEquipos.map((equipo) => (
                <TeamCard key={equipo.id} equipo={equipo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-card border-4 border-white rounded-3xl neo-shadow p-6">
              <span className="text-5xl block mb-4">&#127967;&#65039;</span>
              <h4 className="font-display font-bold uppercase text-xl sm:text-2xl text-zinc-400 mb-1 leading-none">
                No se encontraron escuadras
              </h4>
              <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
                No hay escuadras buscando ese rol actualmente.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
