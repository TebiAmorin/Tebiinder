/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { Database, Rol, Region, Plataforma, Disponibilidad, UserRole } from "@/types/database";
import { selectUserRole, upsertPlayerProfile, upsertTeamProfile } from "@/app/actions/profile";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface ProfileModalProps {
  user: {
    id: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  existingUserRole?: UserRole;
  existingPlayer?: Jugador | null;
  existingTeam?: Equipo | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ProfileModal({
  user,
  existingUserRole = "invitado",
  existingPlayer,
  existingTeam,
  onClose,
  onSaveSuccess,
}: ProfileModalProps) {
  const [step, setStep] = useState<"role-select" | "player-form" | "team-form" | "scout-success">(
    existingUserRole === "jugador"
      ? "player-form"
      : existingUserRole === "capitan"
      ? "team-form"
      : "role-select"
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Player LFT form state
  const [ubisoftId, setUbisoftId] = useState(existingPlayer?.ubisoft_id ?? "");
  const [rolPrincipal, setRolPrincipal] = useState<Rol>(existingPlayer?.rol_principal ?? "entry-fragger");
  const [rolSecundario, setRolSecundario] = useState<Rol | "">(existingPlayer?.rol_secundario ?? "");
  const [plataforma, setPlataforma] = useState<Plataforma>(existingPlayer?.plataforma ?? "pc");
  const [region, setRegion] = useState<Region>(existingPlayer?.region ?? "eu-west");
  const [idioma, setIdioma] = useState(existingPlayer?.idioma ?? "es");
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad>(
    existingPlayer?.disponibilidad ?? "flexible"
  );

  // Team LFG form state
  const [nombreEquipo, setNombreEquipo] = useState(existingTeam?.nombre_equipo ?? "");
  const [descripcion, setDescripcion] = useState(existingTeam?.descripcion ?? "");
  const [rolBuscado, setRolBuscado] = useState<Rol>(existingTeam?.rol_buscado ?? "entry-fragger");
  const [teamPlataforma, setTeamPlataforma] = useState<Plataforma>(existingTeam?.plataforma ?? "pc");
  const [teamRegion, setTeamRegion] = useState<Region>(existingTeam?.region ?? "eu-west");
  const [teamIdioma, setTeamIdioma] = useState(existingTeam?.idioma ?? "es");
  const [integrantesInput, setIntegrantesInput] = useState(
    existingTeam?.integrantes_ubisoft_ids?.join(", ") ?? ""
  );

  // Handle User Role Selection
  const handleSelectRole = async (selected: "jugador" | "capitan" | "ojeador") => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await selectUserRole(selected);
      if (selected === "jugador") {
        setStep("player-form");
      } else if (selected === "capitan") {
        setStep("team-form");
      } else {
        setStep("scout-success");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar rol del usuario");
    } finally {
      setLoading(false);
    }
  };

  // Submit Player Form
  const handleSubmitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await upsertPlayerProfile({
        ubisoftId: ubisoftId.trim() || undefined,
        rolPrincipal,
        rolSecundario: rolSecundario ? rolSecundario : undefined,
        disponibilidad,
        region,
        idioma: idioma.trim(),
        plataforma,
      });
      onSaveSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar perfil de jugador");
    } finally {
      setLoading(false);
    }
  };

  // Submit Team Form
  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const integrantes = integrantesInput
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    try {
      await upsertTeamProfile({
        nombreEquipo: nombreEquipo.trim(),
        descripcion: descripcion.trim() || undefined,
        region: teamRegion,
        idioma: teamIdioma.trim(),
        plataforma: teamPlataforma,
        rolBuscado,
        integrantesUbisoftIds: integrantes.length > 0 ? integrantes : undefined,
      });
      onSaveSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar perfil de equipo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-bg-card border-2 border-border-card rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto clip-tactical relative shadow-[0_0_50px_rgba(255,94,26,0.1)]">
        {/* Glowing Orange top badge */}
        <div className="h-1.5 w-full bg-accent-orange" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white font-black text-lg p-1.5 hover:bg-white/5 rounded-lg transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-white/5">
          <h2 className="font-display font-black text-2xl tracking-wide uppercase text-white">
            {step === "role-select" && "Selecciona tu Rol Táctico"}
            {step === "player-form" && "Configurar Ficha LFT (Jugador)"}
            {step === "team-form" && "Configurar Ficha LFG (Equipo)"}
            {step === "scout-success" && "Perfil de Ojeador"}
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-mono uppercase">
            Identificación: {user.user_metadata?.full_name || "Agente"}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono rounded">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Role Selection Picker */}
          {step === "role-select" && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary mb-4 font-sans leading-relaxed">
                Elige cómo quieres presentarte en Tebiinder. Podrás editar tu perfil y tus preferencias de reclutamiento en cualquier momento.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {/* Player Card Picker */}
                <button
                  disabled={loading}
                  onClick={() => handleSelectRole("jugador")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent-orange/50 transition-all text-left group"
                >
                  <span className="w-12 h-12 rounded-lg bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center text-accent-orange group-hover:scale-105 transition-transform text-2xl">
                    🎯
                  </span>
                  <div>
                    <h4 className="font-display font-bold uppercase text-white group-hover:text-accent-orange transition-colors">
                      Jugador Libre (LFT)
                    </h4>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      Busca un equipo para competir. Muestra tus estadísticas y roles principales.
                    </p>
                  </div>
                </button>

                {/* Team Captain Picker */}
                <button
                  disabled={loading}
                  onClick={() => handleSelectRole("capitan")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent-blue/50 transition-all text-left group"
                >
                  <span className="w-12 h-12 rounded-lg bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center text-accent-blue group-hover:scale-105 transition-transform text-2xl">
                    🛡️
                  </span>
                  <div>
                    <h4 className="font-display font-bold uppercase text-white group-hover:text-accent-blue transition-colors">
                      Capitán de Escuadra (LFG)
                    </h4>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      Recluta agentes libres para tu roster. Calcula la media de tu equipo automáticamente.
                    </p>
                  </div>
                </button>

                {/* Scout Picker */}
                <button
                  disabled={loading}
                  onClick={() => handleSelectRole("ojeador")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-left group"
                >
                  <span className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform text-2xl">
                    📡
                  </span>
                  <div>
                    <h4 className="font-display font-bold uppercase text-white group-hover:text-zinc-300 transition-colors">
                      Ojeador / Scout
                    </h4>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      Solo quieres observar el tablero de ofertas sin publicar fichas competitivas.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2A: Player LFT Form */}
          {step === "player-form" && (
            <form onSubmit={handleSubmitPlayer} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ubisoft Connect ID */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Ubisoft Connect ID (Para sincronizar rango y K/D)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Shaiiko.BDS"
                    value={ubisoftId}
                    onChange={(e) => setUbisoftId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono"
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Plataforma
                  </label>
                  <select
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value as Plataforma)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="pc">PC (Ubisoft)</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Región
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="eu-west">Europa Oeste</option>
                    <option value="eu-east">Europa Este</option>
                    <option value="na">Norteamérica</option>
                    <option value="latam">Latinoamérica</option>
                    <option value="apac">Asia Pacífico</option>
                  </select>
                </div>

                {/* Primary Role */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Rol Principal
                  </label>
                  <select
                    value={rolPrincipal}
                    onChange={(e) => setRolPrincipal(e.target.value as Rol)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="entry-fragger">Entry Fragger</option>
                    <option value="support">Support</option>
                    <option value="flex">Flex</option>
                    <option value="anchor">Anchor</option>
                    <option value="roamer">Roamer</option>
                    <option value="hard-breach">Hard Breach</option>
                    <option value="intel">Intel</option>
                  </select>
                </div>

                {/* Secondary Role */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Rol Secundario
                  </label>
                  <select
                    value={rolSecundario}
                    onChange={(e) => setRolSecundario(e.target.value as Rol | "")}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="">Ninguno</option>
                    <option value="entry-fragger">Entry Fragger</option>
                    <option value="support">Support</option>
                    <option value="flex">Flex</option>
                    <option value="anchor">Anchor</option>
                    <option value="roamer">Roamer</option>
                    <option value="hard-breach">Hard Breach</option>
                    <option value="intel">Intel</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Disponibilidad
                  </label>
                  <select
                    value={disponibilidad}
                    onChange={(e) => setDisponibilidad(e.target.value as Disponibilidad)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="diaria">Diaria (Entrenos)</option>
                    <option value="fines-de-semana">Fines de semana</option>
                    <option value="solo-competitivo">Solo Competitivo</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Idiomas
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: es/en"
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep("role-select")}
                  className="flex-1 py-3 border-2 border-white/10 rounded-lg font-display font-bold uppercase hover:bg-white/5 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-accent-orange text-white border-2 border-accent-orange rounded-lg font-display font-bold uppercase hover:bg-transparent hover:text-accent-orange transition-all disabled:opacity-50"
                >
                  {loading ? "Sincronizando..." : "Publicar Ficha LFT"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2B: Team LFG Form */}
          {step === "team-form" && (
            <form onSubmit={handleSubmitTeam} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team Name */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Nombre del Equipo / Club
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: BDS Esports"
                    value={nombreEquipo}
                    onChange={(e) => setNombreEquipo(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono"
                  />
                </div>

                {/* Team Description */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Descripción / Objetivos del Roster
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe los entrenamientos, objetivos, torneos que jugaréis y el nivel requerido..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-orange font-mono"
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Plataforma Principal
                  </label>
                  <select
                    value={teamPlataforma}
                    onChange={(e) => setTeamPlataforma(e.target.value as Plataforma)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="pc">PC (Ubisoft)</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Región
                  </label>
                  <select
                    value={teamRegion}
                    onChange={(e) => setTeamRegion(e.target.value as Region)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="eu-west">Europa Oeste</option>
                    <option value="eu-east">Europa Este</option>
                    <option value="na">Norteamérica</option>
                    <option value="latam">Latinoamérica</option>
                    <option value="apac">Asia Pacífico</option>
                  </select>
                </div>

                {/* Sought Role */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Rol Buscado
                  </label>
                  <select
                    value={rolBuscado}
                    onChange={(e) => setRolBuscado(e.target.value as Rol)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange cursor-pointer"
                  >
                    <option value="entry-fragger">Entry Fragger</option>
                    <option value="support">Support</option>
                    <option value="flex">Flex</option>
                    <option value="anchor">Anchor</option>
                    <option value="roamer">Roamer</option>
                    <option value="hard-breach">Hard Breach</option>
                    <option value="intel">Intel</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Idiomas Hablados
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: es/en"
                    value={teamIdioma}
                    onChange={(e) => setTeamIdioma(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono"
                  />
                </div>

                {/* Teammates roster input */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                    Ubisoft Connect IDs de los Integrantes (Separados por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Shaiiko.BDS, BriD.BDS, LikEfac.BDS"
                    value={integrantesInput}
                    onChange={(e) => setIntegrantesInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-accent-orange font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                    Los rangos y K/D de los integrantes se procesarán en paralelo para calcular la media de tu escuadra.
                  </p>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep("role-select")}
                  className="flex-1 py-3 border-2 border-white/10 rounded-lg font-display font-bold uppercase hover:bg-white/5 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-accent-blue text-black border-2 border-accent-blue rounded-lg font-display font-bold uppercase hover:bg-transparent hover:text-accent-blue transition-all disabled:opacity-50"
                >
                  {loading ? "Calculando..." : "Publicar Ficha LFG"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2C: Scout Success state */}
          {step === "scout-success" && (
            <div className="text-center py-8 space-y-4">
              <span className="text-5xl block animate-bounce">📡</span>
              <h3 className="font-display font-bold uppercase text-white text-lg">
                ¡Rol de Ojeador Activado!
              </h3>
              <p className="text-xs font-mono text-text-secondary max-w-sm mx-auto leading-relaxed">
                Has configurado tu perfil como Ojeador. Ahora puedes navegar libremente por los tablones sin publicar ninguna oferta competitiva propia.
              </p>
              
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={onSaveSuccess}
                  className="w-full py-3 bg-white text-black border-2 border-white rounded-lg font-display font-bold uppercase hover:bg-transparent hover:text-white transition-all"
                >
                  Cerrar y Ver Tablones
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
