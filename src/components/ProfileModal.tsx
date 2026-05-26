/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { Database, Rol, Plataforma, Disponibilidad, UserRole } from "@/types/database";
import {
  selectUserRole,
  upsertPlayerProfile,
  upsertTeamProfile,
  deletePlayerProfile,
  deleteTeamProfile,
  refreshPlayerStats,
} from "@/app/actions/profile";

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
  const [step, setStep] = useState<"role-select" | "player-form" | "team-form" | "scout-success" | "confirm-delete">(
    existingUserRole === "jugador"
      ? "player-form"
      : existingUserRole === "capitan"
      ? "team-form"
      : "role-select"
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statsPreview, setStatsPreview] = useState<{ rango: string | null; kd: number | null } | null>(
    existingPlayer ? { rango: existingPlayer.rango, kd: existingPlayer.kd ? Number(existingPlayer.kd) : null } : null
  );

  // Player LFT form state
  const [ubisoftId, setUbisoftId] = useState(existingPlayer?.ubisoft_id ?? "");
  const [rolPrincipal, setRolPrincipal] = useState<Rol>(existingPlayer?.rol_principal ?? "entry-fragger");
  const [rolSecundario, setRolSecundario] = useState<Rol | "">(existingPlayer?.rol_secundario ?? "");
  const [plataforma, setPlataforma] = useState<Plataforma>(existingPlayer?.plataforma ?? "pc");
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad>(
    existingPlayer?.disponibilidad ?? "flexible"
  );

  // Team LFG form state
  const [nombreEquipo, setNombreEquipo] = useState(existingTeam?.nombre_equipo ?? "");
  const [descripcion, setDescripcion] = useState(existingTeam?.descripcion ?? "");
  const [rolBuscado, setRolBuscado] = useState<Rol>(existingTeam?.rol_buscado ?? "entry-fragger");
  const [teamPlataforma, setTeamPlataforma] = useState<Plataforma>(existingTeam?.plataforma ?? "pc");
  const [integrantesInput, setIntegrantesInput] = useState(
    existingTeam?.integrantes_ubisoft_ids?.join(", ") ?? ""
  );

  const handleSelectRole = async (selected: "jugador" | "capitan" | "ojeador") => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await selectUserRole(selected);
      if (selected === "jugador") setStep("player-form");
      else if (selected === "capitan") setStep("team-form");
      else setStep("scout-success");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar rol");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await upsertPlayerProfile({
        ubisoftId: ubisoftId.trim() || undefined,
        rolPrincipal,
        rolSecundario: rolSecundario || undefined,
        disponibilidad,
        plataforma,
      });
      if (result.rango || result.kd) {
        setStatsPreview({ rango: result.rango, kd: result.kd });
      }
      onSaveSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar ficha");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const result = await refreshPlayerStats();
      setStatsPreview({ rango: result.rango, kd: result.kd });
    } catch (err: any) {
      setErrorMsg(err.message || "No se pudieron actualizar las stats");
    } finally {
      setRefreshing(false);
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
        plataforma: teamPlataforma,
        rolBuscado,
        integrantesUbisoftIds: integrantes.length > 0 ? integrantes : undefined,
      });
      onSaveSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar equipo");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (existingUserRole === "jugador") await deletePlayerProfile();
      else if (existingUserRole === "capitan") await deleteTeamProfile();
      onSaveSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Error al retirar ficha");
    } finally {
      setLoading(false);
    }
  };

  // Shared select styling
  const selectClass =
    "w-full bg-[#1c0f2f] border-3 border-white text-white rounded-xl py-3 px-3 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00] cursor-pointer";
  const inputClass =
    "w-full bg-[#1c0f2f] border-3 border-white text-white rounded-xl py-3 px-3 font-mono font-bold text-sm focus:outline-none focus:border-[#FF5A00]";
  const labelClass = "block text-zinc-300 font-bold uppercase tracking-wider mb-1.5 text-[11px]";

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#150a24] border-t-4 sm:border-4 border-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto relative shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Orange stripe */}
        <div className="h-1.5 w-full bg-[#FF5A00] rounded-t-3xl sm:rounded-t-[calc(1.5rem-4px)]" />

        {/* Drag handle mobile */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="w-10 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white font-black text-xl p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b-2 border-white/10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-wide uppercase text-white leading-none pr-8">
            {step === "role-select" && "¿Qué buscas?"}
            {step === "player-form" && "Tu Ficha de Jugador"}
            {step === "team-form" && "Tu Ficha de Equipo"}
            {step === "scout-success" && "Modo Ojeador"}
            {step === "confirm-delete" && "Retirar Ficha"}
          </h2>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mx-5 mt-3 p-3 bg-red-950/40 border-2 border-red-500 text-red-200 text-xs font-mono rounded-xl font-bold">
            {errorMsg}
          </div>
        )}

        <div className="p-5">
          {/* ── STEP: Role Selection ── */}
          {step === "role-select" && (
            <div className="space-y-3">
              <button
                disabled={loading}
                onClick={() => handleSelectRole("jugador")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-3 border-white bg-[#1c0f2f] hover:bg-[#25153e] active:scale-[0.98] transition-all text-left group"
              >
                <span className="w-12 h-12 shrink-0 rounded-xl bg-[#FF5A00] border-2 border-black flex items-center justify-center text-2xl">
                  🎯
                </span>
                <div>
                  <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white group-hover:text-[#FF5A00] transition-colors leading-none">
                    Busco Equipo (LFT)
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">
                    Soy un jugador libre buscando roster para competir.
                  </p>
                </div>
              </button>

              <button
                disabled={loading}
                onClick={() => handleSelectRole("capitan")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-3 border-white bg-[#1c0f2f] hover:bg-[#25153e] active:scale-[0.98] transition-all text-left group"
              >
                <span className="w-12 h-12 shrink-0 rounded-xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-2xl">
                  🛡️
                </span>
                <div>
                  <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white group-hover:text-[#00F5D4] transition-colors leading-none">
                    Busco Jugador (LFG)
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">
                    Soy capitán y necesito completar mi roster.
                  </p>
                </div>
              </button>

              <button
                disabled={loading}
                onClick={() => handleSelectRole("ojeador")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-white/30 bg-[#1c0f2f] hover:bg-[#25153e] active:scale-[0.98] transition-all text-left group"
              >
                <span className="w-10 h-10 shrink-0 rounded-lg bg-zinc-700 border-2 border-black flex items-center justify-center text-xl">
                  👁️
                </span>
                <div>
                  <h4 className="font-display font-bold text-lg uppercase tracking-wider text-zinc-300 leading-none">
                    Solo Ojear
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Explorar sin publicar ficha.
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* ── STEP: Player Form (Simplified) ── */}
          {step === "player-form" && (
            <form onSubmit={handleSubmitPlayer} className="space-y-4">
              {/* Ubisoft ID + Stats Preview */}
              <div>
                <label className={labelClass}>Ubisoft Connect ID</label>
                <input
                  type="text"
                  placeholder="Ej: Shaiiko.BDS"
                  value={ubisoftId}
                  onChange={(e) => setUbisoftId(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Se sincronizarán tu rango y K/D automáticamente con R6 Tracker.
                </p>
              </div>

              {/* Stats preview (shown when player has stats) */}
              {statsPreview && (statsPreview.rango || statsPreview.kd !== null) && (
                <div className="flex items-center justify-between gap-3 p-3 bg-[#1c0f2f] border-2 border-white/20 rounded-xl">
                  <div className="flex items-center gap-4 text-sm font-mono">
                    <div>
                      <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Rango</span>
                      <span className="text-white font-bold">{statsPreview.rango || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-zinc-400 uppercase font-bold tracking-wider">K/D</span>
                      <span className="text-white font-bold">{statsPreview.kd !== null ? statsPreview.kd.toFixed(2) : "N/A"}</span>
                    </div>
                  </div>
                  {existingPlayer?.ubisoft_id && (
                    <button
                      type="button"
                      onClick={handleRefreshStats}
                      disabled={refreshing}
                      className="shrink-0 px-3 py-2 bg-[#150a24] border-2 border-white/30 rounded-lg text-[10px] font-mono font-bold text-zinc-300 hover:text-white hover:border-white transition-colors uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 min-h-[38px]"
                    >
                      <svg className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {refreshing ? "..." : "Refrescar"}
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Platform */}
                <div>
                  <label className={labelClass}>Plataforma</label>
                  <select value={plataforma} onChange={(e) => setPlataforma(e.target.value as Plataforma)} className={selectClass}>
                    <option value="pc">PC</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className={labelClass}>Disponibilidad</label>
                  <select value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value as Disponibilidad)} className={selectClass}>
                    <option value="flexible">Flexible</option>
                    <option value="diaria">Diaria</option>
                    <option value="fines-de-semana">Fines de semana</option>
                    <option value="solo-competitivo">Solo Competitivo</option>
                  </select>
                </div>

                {/* Primary Role */}
                <div>
                  <label className={labelClass}>Rol Principal</label>
                  <select value={rolPrincipal} onChange={(e) => setRolPrincipal(e.target.value as Rol)} className={selectClass}>
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
                  <label className={labelClass}>Rol Secundario</label>
                  <select value={rolSecundario} onChange={(e) => setRolSecundario(e.target.value as Rol | "")} className={selectClass}>
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
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3 border-t-2 border-white/10">
                {existingUserRole !== "jugador" && (
                  <button type="button" onClick={() => setStep("role-select")}
                    className="py-3 px-4 border-3 border-white text-white bg-transparent rounded-xl font-display font-bold text-base uppercase tracking-wider active:scale-95 transition-transform">
                    Atrás
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-[#FF5A00] text-white border-3 border-black rounded-xl font-display font-bold text-lg uppercase tracking-wider neo-shadow active:scale-95 transition-transform disabled:opacity-50">
                  {loading ? "Guardando..." : existingPlayer ? "Actualizar" : "Publicar Ficha"}
                </button>
              </div>

              {/* Retire profile button */}
              {existingPlayer && (
                <button type="button" onClick={() => setStep("confirm-delete")}
                  className="w-full py-2.5 text-red-400 border-2 border-red-400/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-950/30 transition-colors mt-2">
                  Ya encontré equipo — Retirar mi ficha
                </button>
              )}
            </form>
          )}

          {/* ── STEP: Team Form (Simplified) ── */}
          {step === "team-form" && (
            <form onSubmit={handleSubmitTeam} className="space-y-4">
              <div>
                <label className={labelClass}>Nombre del Equipo</label>
                <input type="text" required placeholder="Ej: Team Heretics" value={nombreEquipo}
                  onChange={(e) => setNombreEquipo(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Descripción</label>
                <textarea rows={2} placeholder="Qué buscáis, nivel, horarios..." value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className={inputClass + " resize-none"} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Plataforma</label>
                  <select value={teamPlataforma} onChange={(e) => setTeamPlataforma(e.target.value as Plataforma)} className={selectClass}>
                    <option value="pc">PC</option>
                    <option value="playstation">PlayStation</option>
                    <option value="xbox">Xbox</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Rol que Buscáis</label>
                  <select value={rolBuscado} onChange={(e) => setRolBuscado(e.target.value as Rol)} className={selectClass}>
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

              <div>
                <label className={labelClass}>Ubisoft IDs del Roster (separados por comas)</label>
                <input type="text" placeholder="Ej: Player1, Player2, Player3" value={integrantesInput}
                  onChange={(e) => setIntegrantesInput(e.target.value)} className={inputClass} />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Calcularemos rango y K/D medio del equipo automáticamente.
                </p>
              </div>

              <div className="flex gap-3 pt-3 border-t-2 border-white/10">
                {existingUserRole !== "capitan" && (
                  <button type="button" onClick={() => setStep("role-select")}
                    className="py-3 px-4 border-3 border-white text-white bg-transparent rounded-xl font-display font-bold text-base uppercase tracking-wider active:scale-95 transition-transform">
                    Atrás
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-[#00F5D4] text-black border-3 border-black rounded-xl font-display font-bold text-lg uppercase tracking-wider neo-shadow active:scale-95 transition-transform disabled:opacity-50">
                  {loading ? "Guardando..." : existingTeam ? "Actualizar" : "Publicar Equipo"}
                </button>
              </div>

              {existingTeam && (
                <button type="button" onClick={() => setStep("confirm-delete")}
                  className="w-full py-2.5 text-red-400 border-2 border-red-400/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-950/30 transition-colors mt-2">
                  Roster completo — Retirar ficha de equipo
                </button>
              )}
            </form>
          )}

          {/* ── STEP: Scout Success ── */}
          {step === "scout-success" && (
            <div className="text-center py-6 space-y-4">
              <span className="text-5xl block">👁️</span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-white leading-none">
                Modo Ojeador Activado
              </h3>
              <p className="text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                Puedes explorar los tablones y contactar jugadores/equipos sin publicar ficha.
              </p>
              <button onClick={onSaveSuccess}
                className="w-full py-3 bg-white text-black border-3 border-black rounded-xl font-display font-bold text-lg uppercase neo-shadow active:scale-95 transition-transform mt-4">
                Ir a los Tablones
              </button>
            </div>
          )}

          {/* ── STEP: Confirm Delete ── */}
          {step === "confirm-delete" && (
            <div className="text-center py-6 space-y-4">
              <span className="text-5xl block">🎉</span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-white leading-none">
                {existingUserRole === "jugador"
                  ? "¿Encontraste equipo?"
                  : "¿Roster completo?"}
              </h3>
              <p className="text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                Tu ficha se retirará de los tablones. Podrás crear una nueva en cualquier momento.
              </p>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(existingUserRole === "jugador" ? "player-form" : "team-form")}
                  className="flex-1 py-3 border-3 border-white text-white rounded-xl font-display font-bold text-base uppercase active:scale-95 transition-transform">
                  Cancelar
                </button>
                <button onClick={handleDeleteProfile} disabled={loading}
                  className="flex-1 py-3 bg-red-600 text-white border-3 border-black rounded-xl font-display font-bold text-base uppercase neo-shadow active:scale-95 transition-transform disabled:opacity-50">
                  {loading ? "Retirando..." : "Sí, Retirar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
