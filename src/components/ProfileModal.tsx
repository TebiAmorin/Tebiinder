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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto transition-opacity duration-75">
      {/* Sticker-style Modal Container */}
      <div className="bg-[#150a24] border-4 border-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Top thick orange stripe */}
        <div className="h-2 w-full bg-[#FF5A00]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white font-black text-2xl p-1.5 hover:bg-white/10 rounded-xl transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b-2 border-white/10">
          <h2 className="font-display font-bold text-4xl tracking-wide uppercase text-white leading-none">
            {step === "role-select" && "Selecciona tu Rol Táctico"}
            {step === "player-form" && "Configurar Ficha LFT (Jugador)"}
            {step === "team-form" && "Configurar Ficha LFG (Equipo)"}
            {step === "scout-success" && "Perfil de Ojeador"}
          </h2>
          <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase font-bold tracking-wider">
            Identificación: {user.user_metadata?.full_name || "Agente"}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-red-950/40 border-4 border-red-500 text-red-200 text-xs font-mono rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Role Selection Picker */}
          {step === "role-select" && (
            <div className="space-y-5">
              <p className="text-sm text-zinc-200 font-sans leading-relaxed">
                Elige cómo quieres presentarte en Tebiinder. Podrás editar tu perfil y tus preferencias de reclutamiento en cualquier momento.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {/* Player Card Picker */}
                <button
                  disabled={loading}
                  onClick={() => handleSelectRole("jugador")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-4 border-white bg-[#1c0f2f] hover:bg-[#25153e] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-150 text-left group"
                >
                  <span className="w-14 h-14 rounded-xl bg-[#FF5A00] border-2 border-black flex items-center justify-center text-white text-3xl group-hover:scale-105 transition-transform">
                    🎯
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-2xl uppercase tracking-wider text-white group-hover:text-[#FF5A00] transition-colors leading-none">
                      Jugador Libre (LFT)
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      Busca un equipo para competir. Muestra tus estadísticas y roles principales.
                    </p>
                  </div>
                </button>

                {/* Team Captain Picker */}
                <button
                  disabled={loading}
                  onClick={() => handleSelectRole("capitan")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-4 border-white bg-[#1c0f2f] hover:bg-[#25153e] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-150 text-left group"
                >
                  <span className="w-14 h-14 rounded-xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-black text-3xl group-hover:scale-105 transition-transform">
                    🛡️
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-2xl uppercase tracking-wider text-white group-hover:text-[#00F5D4] transition-colors leading-none">
                      Capitán de Escuadra (LFG)
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      Recluta agentes libres para tu roster. Calcula la media de tu equipo automáticamente.
                    </p>
                  </div>
                </button>

                {/* Scout Picker */}
                <button
                  disabled={loading}
                  onClick={() => handleSelectRole("ojeador")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-4 border-white bg-[#1c0f2f] hover:bg-[#25153e] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-150 text-left group"
                >
                  <span className="w-14 h-14 rounded-xl bg-zinc-700 border-2 border-black flex items-center justify-center text-zinc-200 text-3xl group-hover:scale-105 transition-transform">
                    📡
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-2xl uppercase tracking-wider text-white group-hover:text-zinc-300 transition-colors leading-none">
                      Ojeador / Scout
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Ubisoft Connect ID (Para sincronizar rango y K/D)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Shaiiko.BDS"
                    value={ubisoftId}
                    onChange={(e) => setUbisoftId(e.target.value)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Plataforma
                  </label>
                  <select
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value as Plataforma)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
                  >
                    <option value="pc">PC (Ubisoft)</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Región
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Rol Principal
                  </label>
                  <select
                    value={rolPrincipal}
                    onChange={(e) => setRolPrincipal(e.target.value as Rol)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Rol Secundario
                  </label>
                  <select
                    value={rolSecundario}
                    onChange={(e) => setRolSecundario(e.target.value as Rol | "")}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Disponibilidad
                  </label>
                  <select
                    value={disponibilidad}
                    onChange={(e) => setDisponibilidad(e.target.value as Disponibilidad)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="diaria">Diaria (Entrenos)</option>
                    <option value="fines-de-semana">Fines de semana</option>
                    <option value="solo-competitivo">Solo Competitivo</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Idiomas
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: es/en"
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 pt-5 border-t-2 border-white/10">
                <button
                  type="button"
                  onClick={() => setStep("role-select")}
                  className="flex-1 py-3 border-4 border-white text-white bg-transparent rounded-xl font-display font-bold text-xl uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-transform duration-100"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#FF5A00] text-white border-4 border-black rounded-xl font-display font-bold text-xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 disabled:opacity-50"
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Nombre del Equipo / Club
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: BDS Esports"
                    value={nombreEquipo}
                    onChange={(e) => setNombreEquipo(e.target.value)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>

                {/* Team Description */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Descripción / Objetivos del Roster
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe los entrenamientos, objetivos, torneos que jugaréis y el nivel requerido..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl p-3.5 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Plataforma Principal
                  </label>
                  <select
                    value={teamPlataforma}
                    onChange={(e) => setTeamPlataforma(e.target.value as Plataforma)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
                  >
                    <option value="pc">PC (Ubisoft)</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Región
                  </label>
                  <select
                    value={teamRegion}
                    onChange={(e) => setTeamRegion(e.target.value as Region)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Rol Buscado
                  </label>
                  <select
                    value={rolBuscado}
                    onChange={(e) => setRolBuscado(e.target.value as Rol)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer"
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
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Idiomas Hablados
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: es/en"
                    value={teamIdioma}
                    onChange={(e) => setTeamIdioma(e.target.value)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]"
                  />
                </div>

                {/* Teammates roster input */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-2">
                    Ubisoft Connect IDs de los Integrantes (Separados por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Shaiiko.BDS, BriD.BDS, LikEfac.BDS"
                    value={integrantesInput}
                    onChange={(e) => setIntegrantesInput(e.target.value)}
                    className="w-full bg-[#1c0f2f] border-4 border-white text-white rounded-xl py-3 px-4 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]"
                  />
                  <p className="text-[10px] text-zinc-400 mt-2 font-bold leading-normal">
                    Los rangos y K/D de los integrantes se procesarán en paralelo para calcular la media de tu escuadra.
                  </p>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 pt-5 border-t-2 border-white/10">
                <button
                  type="button"
                  onClick={() => setStep("role-select")}
                  className="flex-1 py-3 border-4 border-white text-white bg-transparent rounded-xl font-display font-bold text-xl uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-transform duration-100"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#00F5D4] text-black border-4 border-black rounded-xl font-display font-bold text-xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 disabled:opacity-50"
                >
                  {loading ? "Calculando..." : "Publicar Ficha LFG"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2C: Scout Success state */}
          {step === "scout-success" && (
            <div className="text-center py-8 space-y-4">
              <span className="text-6xl block animate-bounce">📡</span>
              <h3 className="font-display font-bold text-3xl uppercase tracking-wider text-white leading-none">
                ¡Rol de Ojeador Activado!
              </h3>
              <p className="text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed font-sans">
                Has configurado tu perfil como Ojeador. Ahora puedes navegar libremente por los tablones sin publicar ninguna oferta competitiva propia.
              </p>
              
              <div className="pt-6 border-t-2 border-white/10">
                <button
                  onClick={onSaveSuccess}
                  className="w-full py-3.5 bg-white text-black border-4 border-black rounded-xl font-display font-bold text-xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100"
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
