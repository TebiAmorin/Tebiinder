"use client";

import { useState } from "react";
import type { Database } from "@/types/database";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];

interface GamerCardProps {
  jugador: Jugador;
}

// Custom tactical SVG role icons
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

// Custom platform SVG icons
export function PlatformIcon({ platform, className = "w-4 h-4" }: { platform: string; className?: string }) {
  switch (platform) {
    case "pc":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
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

// Rank Badge color themes
function getRankTheme(rank: string | null) {
  const r = (rank ?? "").toLowerCase();
  if (r.includes("champion")) return { name: "Champion", bg: "bg-purple-950/40", border: "border-purple-500", text: "text-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]" };
  if (r.includes("diamond")) return { name: "Diamante", bg: "bg-indigo-950/40", border: "border-indigo-500", text: "text-indigo-300", glow: "shadow-[0_0_10px_rgba(99,102,241,0.2)]" };
  if (r.includes("emerald")) return { name: "Esmeralda", bg: "bg-emerald-950/40", border: "border-emerald-500", text: "text-emerald-400", glow: "" };
  if (r.includes("platinum")) return { name: "Platino", bg: "bg-cyan-950/40", border: "border-cyan-500", text: "text-cyan-300", glow: "" };
  if (r.includes("gold")) return { name: "Oro", bg: "bg-amber-950/40", border: "border-amber-500", text: "text-amber-400", glow: "" };
  if (r.includes("silver")) return { name: "Plata", bg: "bg-slate-900/60", border: "border-slate-400", text: "text-slate-300", glow: "" };
  if (r.includes("bronze")) return { name: "Bronce", bg: "bg-amber-900/20", border: "border-amber-700", text: "text-amber-600", glow: "" };
  if (r.includes("copper")) return { name: "Cobre", bg: "bg-orange-950/20", border: "border-orange-800", text: "text-orange-700", glow: "" };
  return { name: "Sin Rango", bg: "bg-zinc-900/60", border: "border-zinc-700", text: "text-zinc-500", glow: "" };
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

  // K/D Rating styling
  const kdValue = jugador.kd ? Number(jugador.kd) : 0;
  const kdColor = kdValue >= 1.2 
    ? "text-accent-orange font-black" 
    : kdValue >= 1.0 
      ? "text-amber-400 font-bold" 
      : "text-text-secondary";

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative bg-bg-card border-2 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden clip-tactical ${
        isExpanded 
          ? "border-accent-orange shadow-[0_0_20px_rgba(255,94,26,0.15)] scale-[1.01]" 
          : "border-border-card hover:border-border-card-hover hover:shadow-[0_0_12px_rgba(255,94,26,0.06)] hover:scale-[1.005]"
      }`}
    >
      {/* Top neon indicator */}
      <div className={`h-1 w-full transition-all duration-300 ${jugador.destacado ? "bg-accent-orange" : "bg-transparent group-hover:bg-accent-orange/40"}`} />

      {/* Main card body */}
      <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        {/* Left Side: Avatar, name, rank */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Discord Avatar or default placeholder */}
            {jugador.discord_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={jugador.discord_avatar}
                alt={jugador.discord_username}
                className="w-14 h-14 rounded-lg border-2 border-border-card object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-zinc-800 rounded-lg border-2 border-border-card flex items-center justify-center font-black text-xl text-zinc-500">
                {jugador.discord_username.substring(0, 2).toUpperCase()}
              </div>
            )}

            {/* Glowing Featured dot */}
            {jugador.destacado && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-orange"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-lg leading-tight tracking-tight group-hover:text-accent-orange transition-colors">
                {jugador.discord_username.split("#")[0]}
              </h4>
              <span className="text-xs font-mono text-text-secondary">
                {jugador.plataforma.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              {/* Main Role Label */}
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider bg-white/5 border border-white/10 uppercase flex items-center gap-1.5 text-accent-blue">
                <RoleIcon role={jugador.rol_principal} className="w-3.5 h-3.5" />
                {jugador.rol_principal.replace("-", " ")}
              </span>

              {/* Secondary Role Label if exists */}
              {jugador.rol_secundario && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-white/5 text-zinc-400">
                  {jugador.rol_secundario.replace("-", " ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Stats (Rank & K/D) */}
        <div className="flex items-center gap-6 self-end md:self-auto mt-2 md:mt-0">
          {/* KD block */}
          <div className="text-right">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
              K/D RATIO
            </span>
            <span className={`text-xl font-mono ${kdColor}`}>
              {jugador.kd ? Number(jugador.kd).toFixed(2) : "N/A"}
            </span>
          </div>

          {/* R6 Rank Block */}
          <div className={`px-4 py-2 rounded-lg border-2 ${rankTheme.bg} ${rankTheme.border} ${rankTheme.glow} flex flex-col items-center justify-center min-w-[100px]`}>
            <span className="text-[9px] font-mono tracking-wider text-text-secondary uppercase">
              RANGO
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
          isExpanded ? "max-h-[300px] p-5" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Ubisoft Connect</span>
            <span className="font-bold text-text-primary text-xs md:text-sm truncate block mt-0.5">
              {jugador.ubisoft_id || "No vinculado"}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Disponibilidad</span>
            <span className="text-text-primary font-bold text-xs md:text-sm block mt-0.5 capitalize">
              {jugador.disponibilidad.replace("-", " ")}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Región</span>
            <span className="text-text-primary font-bold text-xs md:text-sm block mt-0.5 uppercase">
              {jugador.region}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Idiomas</span>
            <span className="text-text-primary font-bold text-xs md:text-sm block mt-0.5 uppercase">
              {jugador.idioma}
            </span>
          </div>
        </div>

        {/* Actions bar inside expanded */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
          <p className="text-xs text-text-secondary">
            Haz clic de nuevo en la tarjeta para colapsar los detalles.
          </p>

          <button
            onClick={copyDiscord}
            className={`px-5 py-2 rounded-lg font-display font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all duration-200 uppercase ${
              copied 
                ? "bg-accent-green/20 border-accent-green text-accent-green" 
                : "bg-accent-orange text-white border-accent-orange hover:bg-transparent hover:text-accent-orange"
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
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                Copiar Discord
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
