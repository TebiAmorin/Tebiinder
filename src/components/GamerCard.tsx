"use client";

import { useState } from "react";
import type { Database } from "@/types/database";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];

interface GamerCardProps {
  jugador: Jugador;
}

// Flat modern SVG role icons
export function RoleIcon({ role, className = "w-5 h-5" }: { role: string; className?: string }) {
  switch (role) {
    case "entry-fragger":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.4" />
        </svg>
      );
    case "support":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "flex":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case "anchor":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "roamer":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "hard-breach":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "intel":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
  }
}

// Flat platform icons
export function PlatformIcon({ platform, className = "w-4 h-4" }: { platform: string; className?: string }) {
  switch (platform) {
    case "pc":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
        </svg>
      );
    case "playstation":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2A10 10 0 1 0 22 12 A10 10 0 0 0 12 2 M12 6a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V9a3 3 0 0 1 3-3z" />
        </svg>
      );
    case "xbox":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2A10 10 0 1 0 22 12 A10 10 0 0 0 12 2 M8 8 l8 8 M16 8 l-8 8" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    default:
      return null;
  }
}

// Rank Badge color themes - Neo-Brutalist Flat style
function getRankTheme(rank: string | null) {
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

export default function GamerCard({ jugador }: GamerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const rankTheme = getRankTheme(jugador.rango);

  const copyDiscord = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(jugador.discord_username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kdValue = jugador.kd ? Number(jugador.kd) : 0;
  const kdColor = kdValue >= 1.2 
    ? "text-[#FF5A00] font-black" 
    : kdValue >= 1.0 
      ? "text-amber-400 font-bold" 
      : "text-zinc-300";

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative bg-bg-card border-4 border-white neo-shadow-hover rounded-2xl md:rounded-3xl cursor-pointer overflow-hidden ${
        isExpanded ? "scale-[1.01] !transform-none !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : ""
      }`}
    >
      {/* Featured visual badge on the sticker */}
      {jugador.destacado && (
        <div className="absolute top-0 right-0 bg-[#FF5A00] text-white border-b-4 border-l-4 border-white font-display font-bold uppercase tracking-wider text-xs px-3 py-1 z-10">
          Destacado
        </div>
      )}

      {/* Main card body */}
      <div className="p-5 flex flex-col md:flex-row md:items-center gap-5 justify-between">
        {/* Left Side: Avatar, name, rank */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Sticker Avatar with thick border */}
            {jugador.discord_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={jugador.discord_avatar}
                alt={jugador.discord_username}
                className="w-16 h-16 rounded-xl border-4 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] object-cover bg-zinc-800"
              />
            ) : (
              <div className="w-16 h-16 bg-zinc-800 rounded-xl border-4 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-display font-bold text-3xl text-zinc-400">
                {jugador.discord_username.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              {/* Giant Bebas Neue heading */}
              <h4 className="font-display font-bold text-3xl leading-none uppercase tracking-tight text-white group-hover:text-[#FF5A00] transition-colors">
                {jugador.discord_username.split("#")[0]}
              </h4>
              <span className="px-2 py-0.5 border border-white text-[10px] font-mono font-bold bg-white/10 rounded uppercase text-white">
                {jugador.plataforma.toUpperCase()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {/* Primary Role Label */}
              <span className="px-3 py-0.5 border-2 border-white rounded text-xs font-mono font-bold uppercase tracking-wide flex items-center gap-1.5 bg-black/60 text-[#00F5D4]">
                <RoleIcon role={jugador.rol_principal} className="w-3.5 h-3.5" />
                {jugador.rol_principal.replace("-", " ")}
              </span>

              {/* Secondary Role Label if exists */}
              {jugador.rol_secundario && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 border border-white/20 rounded text-xs font-mono bg-white/5 text-zinc-400 uppercase">
                  {jugador.rol_secundario.replace("-", " ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Stats (Rank & K/D) */}
        <div className="flex items-center gap-6 self-start md:self-auto mt-3 md:mt-0">
          {/* KD block */}
          <div className="text-right">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              K/D RATIO
            </span>
            <span className={`text-2xl font-mono ${kdColor}`}>
              {jugador.kd ? Number(jugador.kd).toFixed(2) : "N/A"}
            </span>
          </div>

          {/* R6 Rank Block - Sticker Style */}
          <div className={`px-4 py-1.5 rounded-xl border-4 border-black neo-shadow ${rankTheme.bg} flex flex-col items-center justify-center min-w-[110px]`}>
            <span className="text-[8px] font-mono font-bold tracking-wider text-black/60 uppercase leading-none">
              RANGO
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
          isExpanded ? "max-h-[350px] p-5" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Ubisoft Connect</span>
            <span className="font-bold text-white text-sm truncate block mt-0.5">
              {jugador.ubisoft_id || "No vinculado"}
            </span>
          </div>

          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Disponibilidad</span>
            <span className="text-white font-bold text-sm block mt-0.5 capitalize">
              {jugador.disponibilidad.replace("-", " ")}
            </span>
          </div>

          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Región</span>
            <span className="text-white font-bold text-sm block mt-0.5 uppercase">
              {jugador.region}
            </span>
          </div>

          <div className="bg-[#1c0f2f] p-3 border-2 border-white/20 rounded-xl">
            <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Idiomas</span>
            <span className="text-white font-bold text-sm block mt-0.5 uppercase">
              {jugador.idioma}
            </span>
          </div>
        </div>

        {/* Actions bar inside expanded */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t-2 border-white/10">
          <p className="text-xs font-mono text-zinc-400">
            Haz clic de nuevo en la tarjeta para cerrar los detalles.
          </p>

          {/* Contact action button: Soft Neo-Brutalism Match Button */}
          <button
            onClick={copyDiscord}
            className={`w-full sm:w-auto px-6 py-3 font-display font-bold text-xl uppercase tracking-wider border-4 border-black neo-shadow transition-transform duration-100 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
              copied 
                ? "bg-[#00F5D4] text-black" 
                : "bg-[#FF5A00] text-white"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Discord Copiado!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                Conectar / Match
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
