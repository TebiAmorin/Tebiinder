"use server";

import { fetchPlayerStats } from "./api";
import type { R6PlayerStats } from "./types";

/** Rangos de R6 ordenados de menor a mayor para calcular la media */
const RANK_ORDER = [
  "Copper V",
  "Copper IV",
  "Copper III",
  "Copper II",
  "Copper I",
  "Bronze V",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver V",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold V",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum V",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Emerald V",
  "Emerald IV",
  "Emerald III",
  "Emerald II",
  "Emerald I",
  "Diamond V",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
  "Champion",
];

function rankToIndex(rank: string): number {
  const idx = RANK_ORDER.findIndex(
    (r) => r.toLowerCase() === rank.toLowerCase()
  );
  return idx === -1 ? -1 : idx;
}

function indexToRank(index: number): string {
  const clamped = Math.min(Math.max(Math.round(index), 0), RANK_ORDER.length - 1);
  return RANK_ORDER[clamped];
}

export interface TeamAverageStats {
  rangoMedio: string | null;
  kdMedio: number | null;
  jugadores: R6PlayerStats[];
}

/**
 * Calcula el rango medio y KD medio de un equipo
 * a partir de los Ubisoft IDs de sus integrantes.
 */
export async function calculateTeamStats(
  ubisoftIds: string[],
  platform: string = "pc"
): Promise<TeamAverageStats> {
  if (!ubisoftIds.length) {
    return { rangoMedio: null, kdMedio: null, jugadores: [] };
  }

  // Fetch stats de todos los jugadores en paralelo
  const jugadores = await Promise.all(
    ubisoftIds.map((id) => fetchPlayerStats(id, platform))
  );

  // Calcular KD medio (solo de jugadores con KD válido)
  const kds = jugadores
    .map((j) => j.kd)
    .filter((kd): kd is number => kd !== null);
  const kdMedio =
    kds.length > 0
      ? Math.round((kds.reduce((a, b) => a + b, 0) / kds.length) * 100) / 100
      : null;

  // Calcular rango medio (solo de jugadores con rango válido)
  const rankIndices = jugadores
    .map((j) => (j.rank ? rankToIndex(j.rank) : -1))
    .filter((idx) => idx !== -1);
  const rangoMedio =
    rankIndices.length > 0
      ? indexToRank(
          rankIndices.reduce((a, b) => a + b, 0) / rankIndices.length
        )
      : null;

  return { rangoMedio, kdMedio, jugadores };
}
