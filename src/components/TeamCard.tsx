"use client";

import { useState } from "react";
import type { Database } from "@/types/database";
import { RoleIcon } from "./GamerCard";

type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface TeamCardProps {
  equipo: Equipo;
}

// Flat modern Rank theme mapping for teams
function getTeamRankTheme(rank: string | null) {
  const r = (rank ?? "").toLowerCase();
  if (r.includes("champion")) return { name: "Champion", bg: "bg-purple-600", border: "border-black", text: "text-white" };
  if (r.includes("diamond")) return { name: "Diamante", bg: "bg-indigo-600", border: "border-black", text: "text-white" };
  if (r.includes("emerald")) return { name: "Esmeralda", bg: "bg-emerald-500", border: "border-black", text: "text-white" };
  if (r.includes("platinum")) return { name: "Platino", bg: "bg-cyan-400", border: "border-black", text: "text-black" };
  if (r.includes("gold")) return { name: "Oro", bg: "bg-amber-400", border: "border-black", text: "text-black" };
  if (r.includes("silver")) return { name: "Plata", bg: "bg-slate-300", border: "border-black", text: "text-black" };
  if (r.includes("bronze")) return { name: "Bronce", bg: "bg-orange-700", border: "border-black", text: "text-white" };
  if (r.includes("copper")) return { name: "Cobre", bg: "bg-red-700", border: "border-black", text: "text-white" };
  return { name: "Sin Rango", bg: "bg-zinc-600", border: "border-black", text: "text-zinc-200" };
}

export default function TeamCard({ equipo }: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rankTheme = getTeamRankTheme(equipo.rango_medio);

  const kdValue = equipo.kd_medio ? Number(equipo.kd_medio) : 0;
  const kdColor = kdValue >= 1.2 
    ? "text-[#FF5A00] font-black" 
    : kdValue >= 1.0 
      ? "text-amber-400 font-bold" 
      : "text-zinc-300";

  // Initials for team sticker badge
  const initials = equipo.nombre_equipo
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative bg-bg-card border-4 border-white neo-shadow-hover rounded-2xl md:rounded-3xl cursor-pointer overflow-hidden ${
        isExpanded ? "scale-[1.01] !transform-none !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : ""
      }`}
    >
      {/* Featured visual badge on the sticker */}
      {equipo.destacado && (
        <div className="absolute top-0 right-0 bg-[#00F5D4] text-black border-b-4 border-l-4 border-white font-display font-bold uppercase tracking-wider text-xs px-3 py-1 z-10">
          Destacado
        </div>
      )}

      {/* Main card body */}
      <div className="p-5 flex flex-col md:flex-row md:items-center gap-5 justify-between">
        {/* Left: Insignia and Details */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Team Sticker Logo badge */}
            <div className="w-16 h-16 bg-[#2d1b54] rounded-xl border-4 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-display font-bold text-3xl text-white group-hover:bg-[#FF5A00] transition-colors">
              {initials}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              {/* Giant Bebas Neue heading */}
              <h4 className="font-display font-bold text-3xl leading-none uppercase tracking-tight text-white group-hover:text-[#00F5D4] transition-colors">
                {equipo.nombre_equipo}
              </h4>
              <span className="px-2 py-0.5 border border-white text-[10px] font-mono font-bold bg-white/10 rounded uppercase text-white">
                {equipo.plataforma.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase">
                BUSCA:
              </span>
              {/* Seeking role badge */}
              <span className="px-3 py-0.5 border-2 border-white rounded text-xs font-mono font-bold uppercase tracking-wide flex items-center gap-1.5 bg-black/60 text-[#FF5A00]">
                <RoleIcon role={equipo.rol_buscado} className="w-3.5 h-3.5" />
                {equipo.rol_buscado.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex items-center gap-6 self-start md:self-auto mt-3 md:mt-0">
          {/* Team KD Block */}
          <div className="text-right">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              KD MEDIO
            </span>
            <span className={`text-2xl font-mono ${kdColor}`}>
              {equipo.kd_medio ? Number(equipo.kd_medio).toFixed(2) : "N/A"}
            </span>
          </div>

          {/* Average Rank Block - Sticker Style */}
          <div className={`px-4 py-1.5 rounded-xl border-4 border-black neo-shadow ${rankTheme.bg} flex flex-col items-center justify-center min-w-[110px]`}>
            <span className="text-[8px] font-mono font-bold tracking-wider text-black/60 uppercase leading-none">
              RANGO MEDIO
            </span>
            <span className={`text-sm font-bold font-display uppercase tracking-tight leading-tight ${rankTheme.text}`}>
              {rankTheme.name}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded details container */}
      <div
        className={`transition-all duration-300 ease-in-out bg-black/60 border-t-4 border-white overflow-hidden ${
          isExpanded ? "max-h-[450px] p-5" : "max-h-0"
        }`}
      >
        <p className="text-xs font-mono text-zinc-200 leading-relaxed mb-5 italic bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
          &quot;{equipo.descripcion || "Sin descripción proporcionada."}&quot;
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono mb-5">
          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Región</span>
            <span className="text-white font-bold text-sm block mt-0.5 uppercase">
              {equipo.region}
            </span>
          </div>

          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Idiomas</span>
            <span className="text-white font-bold text-sm block mt-0.5 uppercase">
              {equipo.idioma}
            </span>
          </div>

          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Capitán</span>
            <span className="text-white font-bold text-sm block mt-0.5 truncate uppercase">
              {equipo.discord_username_capitan.split("#")[0]}
            </span>
          </div>
        </div>

        {/* Teammates roster list */}
        {equipo.integrantes_ubisoft_ids && equipo.integrantes_ubisoft_ids.length > 0 && (
          <div className="border-t-2 border-white/10 pt-4 mb-4">
            <span className="block text-[9px] font-mono text-zinc-400 uppercase font-bold tracking-wider mb-2">
              Roster Integrantes ({equipo.integrantes_ubisoft_ids.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {equipo.integrantes_ubisoft_ids.map((id, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-xl text-xs font-mono bg-black/40 border-2 border-white/20 text-white font-bold"
                >
                  ⚔️ {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Copy Captain Discord tag button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t-2 border-white/10">
          <p className="text-xs font-mono text-zinc-400">
            Haz clic de nuevo en la tarjeta para cerrar los detalles.
          </p>

          <a
            href={`discord://-/users/${equipo.discord_id_capitan}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-auto px-6 py-3 font-display font-bold text-lg uppercase tracking-wider border-4 border-black neo-shadow transition-transform duration-100 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-[#5865F2] text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
            </svg>
            Contactar Capitán
          </a>
        </div>
      </div>
    </div>
  );
}
