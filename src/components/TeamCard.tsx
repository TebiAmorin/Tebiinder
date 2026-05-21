"use client";

import { useState } from "react";
import type { Database } from "@/types/database";
import { RoleIcon } from "./GamerCard";

type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface TeamCardProps {
  equipo: Equipo;
}

// Custom rank styling mapping
function getTeamRankTheme(rank: string | null) {
  const r = (rank ?? "").toLowerCase();
  if (r.includes("champion")) return { name: "Champion", bg: "bg-purple-950/40", border: "border-purple-500", text: "text-purple-400" };
  if (r.includes("diamond")) return { name: "Diamante", bg: "bg-indigo-950/40", border: "border-indigo-500", text: "text-indigo-300" };
  if (r.includes("emerald")) return { name: "Esmeralda", bg: "bg-emerald-950/40", border: "border-emerald-500", text: "text-emerald-400" };
  if (r.includes("platinum")) return { name: "Platino", bg: "bg-cyan-950/40", border: "border-cyan-500", text: "text-cyan-300" };
  if (r.includes("gold")) return { name: "Oro", bg: "bg-amber-950/40", border: "border-amber-500", text: "text-amber-400" };
  if (r.includes("silver")) return { name: "Plata", bg: "bg-slate-900/60", border: "border-slate-400", text: "text-slate-300" };
  if (r.includes("bronze")) return { name: "Bronce", bg: "bg-amber-900/20", border: "border-amber-700", text: "text-amber-600" };
  if (r.includes("copper")) return { name: "Cobre", bg: "bg-orange-950/20", border: "border-orange-800", text: "text-orange-700" };
  return { name: "Sin Rango", bg: "bg-zinc-900/60", border: "border-zinc-700", text: "text-zinc-500" };
}

export default function TeamCard({ equipo }: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const rankTheme = getTeamRankTheme(equipo.rango_medio);

  const copyDiscord = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(equipo.discord_username_capitan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kdValue = equipo.kd_medio ? Number(equipo.kd_medio) : 0;
  const kdColor = kdValue >= 1.2 
    ? "text-accent-orange font-black animate-pulse-slow" 
    : kdValue >= 1.0 
      ? "text-amber-400 font-bold" 
      : "text-text-secondary";

  // Get initials for team insignia
  const initials = equipo.nombre_equipo
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative bg-bg-card border-2 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden clip-tactical ${
        isExpanded 
          ? "border-accent-orange shadow-[0_0_20px_rgba(255,94,26,0.15)] scale-[1.01]" 
          : "border-border-card hover:border-border-card-hover hover:shadow-[0_0_12px_rgba(255,94,26,0.06)] hover:scale-[1.005]"
      }`}
    >
      {/* Top indicator stripe */}
      <div className={`h-1 w-full transition-all duration-300 ${equipo.destacado ? "bg-accent-blue" : "bg-transparent group-hover:bg-accent-blue/40"}`} />

      {/* Main card body */}
      <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        {/* Left: Insignia and Details */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Insignia placeholder (large initials in R6 block lettering) */}
            <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-black rounded-lg border-2 border-border-card flex items-center justify-center font-display font-black text-lg text-white group-hover:border-accent-blue transition-colors">
              {initials}
            </div>

            {/* Glowing Featured indicator */}
            {equipo.destacado && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-blue"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-lg leading-tight tracking-tight group-hover:text-accent-blue transition-colors">
                {equipo.nombre_equipo}
              </h4>
              <span className="text-xs font-mono text-text-secondary">
                {equipo.plataforma.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              {/* Seeking indicator */}
              <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">
                BUSCA:
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider bg-accent-orange/10 border border-accent-orange/30 uppercase flex items-center gap-1 text-accent-orange">
                <RoleIcon role={equipo.rol_buscado} className="w-3.5 h-3.5" />
                {equipo.rol_buscado.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex items-center gap-6 self-end md:self-auto mt-2 md:mt-0">
          {/* Team KD Block */}
          <div className="text-right">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
              KD MEDIO
            </span>
            <span className={`text-xl font-mono ${kdColor}`}>
              {equipo.kd_medio ? Number(equipo.kd_medio).toFixed(2) : "N/A"}
            </span>
          </div>

          {/* Average Rank Block */}
          <div className={`px-4 py-2 rounded-lg border-2 ${rankTheme.bg} ${rankTheme.border} flex flex-col items-center justify-center min-w-[100px]`}>
            <span className="text-[9px] font-mono tracking-wider text-text-secondary uppercase">
              RANGO MEDIO
            </span>
            <span className={`text-xs font-bold font-display uppercase tracking-tighter ${rankTheme.text}`}>
              {rankTheme.name}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded details container */}
      <div
        className={`transition-all duration-300 ease-in-out bg-black/40 border-t border-white/5 overflow-hidden ${
          isExpanded ? "max-h-[400px] p-5" : "max-h-0"
        }`}
      >
        <p className="text-sm font-sans text-text-secondary leading-relaxed mb-5 italic bg-white/5 p-3 rounded-lg border border-white/5">
          &quot;{equipo.descripcion || "Sin descripción proporcionada."}&quot;
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono mb-5">
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Región</span>
            <span className="text-text-primary font-bold text-xs md:text-sm block mt-0.5 uppercase">
              {equipo.region}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Idiomas</span>
            <span className="text-text-primary font-bold text-xs md:text-sm block mt-0.5 uppercase">
              {equipo.idioma}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Capitán</span>
            <span className="text-text-primary font-bold text-xs md:text-sm block mt-0.5 truncate">
              {equipo.discord_username_capitan.split("#")[0]}
            </span>
          </div>
        </div>

        {/* Teammates roster list */}
        {equipo.integrantes_ubisoft_ids && equipo.integrantes_ubisoft_ids.length > 0 && (
          <div className="border-t border-white/5 pt-4 mb-4">
            <span className="block text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider mb-2">
              Roster Integrantes ({equipo.integrantes_ubisoft_ids.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {equipo.integrantes_ubisoft_ids.map((id, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-md text-xs font-mono bg-zinc-900 border border-white/5 text-zinc-300"
                >
                  ⚔️ {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Copy Captain Discord tag button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
          <p className="text-xs text-text-secondary">
            Haz clic de nuevo en la tarjeta para colapsar los detalles.
          </p>

          <button
            onClick={copyDiscord}
            className={`px-5 py-2 rounded-lg font-display font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all duration-200 uppercase ${
              copied 
                ? "bg-accent-green/20 border-accent-green text-accent-green" 
                : "bg-accent-blue text-black border-accent-blue hover:bg-transparent hover:text-accent-blue"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Discord Copiado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" fill="currentColor"/>
                </svg>
                Discord de Capitán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
