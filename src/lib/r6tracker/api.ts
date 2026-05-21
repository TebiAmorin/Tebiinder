"use server";

import type {
  R6TrackerProfile,
  R6PlayerStats,
  R6Platform,
} from "./types";
import { PLATFORM_MAP } from "./types";

const API_BASE = "https://public-api.tracker.gg/v2/r6siege/standard";

/**
 * Obtiene las stats de un jugador desde R6Tracker (TRN API).
 * Se ejecuta solo en el servidor para proteger la API key.
 */
export async function fetchPlayerStats(
  ubisoftId: string,
  platform: string = "pc"
): Promise<R6PlayerStats> {
  const apiKey = process.env.R6TRACKER_API_KEY;
  if (!apiKey) {
    throw new Error("R6TRACKER_API_KEY no configurada");
  }

  const r6Platform: R6Platform = PLATFORM_MAP[platform] ?? "uplay";

  const res = await fetch(
    `${API_BASE}/profile/${r6Platform}/${encodeURIComponent(ubisoftId)}`,
    {
      headers: {
        "TRN-Api-Key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache 1 hora
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return { username: ubisoftId, rank: null, kd: null, avatarUrl: null };
    }
    throw new Error(`R6Tracker API error: ${res.status}`);
  }

  const json: R6TrackerProfile = await res.json();

  if (!json.data) {
    return { username: ubisoftId, rank: null, kd: null, avatarUrl: null };
  }

  // Buscar el segmento "overview" que tiene KD global
  const overview = json.data.segments.find((s) => s.type === "overview");
  const kd = overview?.stats?.kd?.value ?? null;

  // Buscar el rango del segmento de temporada actual
  const currentSeason = json.data.segments.find(
    (s) => s.type === "season" && s.metadata?.name
  );
  const rank =
    currentSeason?.stats?.rank?.displayValue ??
    overview?.stats?.rank?.displayValue ??
    null;

  return {
    username: json.data.platformInfo.platformUserHandle,
    rank,
    kd: kd !== null ? Math.round(kd * 100) / 100 : null,
    avatarUrl: json.data.platformInfo.avatarUrl ?? null,
  };
}
