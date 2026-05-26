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
 *
 * @param ubisoftId - ID de Ubisoft Connect del jugador
 * @param platform  - Plataforma (pc, playstation, xbox)
 * @param fresh     - Si true, ignora la cache y hace una petición fresca a la API
 */
export async function fetchPlayerStats(
  ubisoftId: string,
  platform: string = "pc",
  fresh: boolean = false
): Promise<R6PlayerStats> {
  const apiKey = process.env.R6TRACKER_API_KEY;
  if (!apiKey) {
    throw new Error("R6TRACKER_API_KEY no configurada");
  }

  const r6Platform: R6Platform = PLATFORM_MAP[platform] ?? "uplay";

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      "TRN-Api-Key": apiKey,
      Accept: "application/json",
    },
  };

  if (fresh) {
    // Bypass Next.js cache — fetch live data from TRN API
    fetchOptions.cache = "no-store";
  } else {
    // Cache for 1 hour for normal reads (profile creation, page loads)
    fetchOptions.next = { revalidate: 3600 };
  }

  const res = await fetch(
    `${API_BASE}/profile/${r6Platform}/${encodeURIComponent(ubisoftId)}`,
    fetchOptions
  );

  if (!res.ok) {
    if (res.status === 404) {
      return { username: ubisoftId, rank: null, kd: null, avatarUrl: null };
    }
    if (res.status === 429) {
      throw new Error("Demasiadas peticiones a R6 Tracker. Espera un minuto e inténtalo de nuevo.");
    }
    throw new Error(`R6 Tracker API error: ${res.status}`);
  }

  const json: R6TrackerProfile = await res.json();

  if (!json.data) {
    return { username: ubisoftId, rank: null, kd: null, avatarUrl: null };
  }

  // ── Extract K/D from the overview segment ──
  const overview = json.data.segments.find((s) => s.type === "overview");
  const kd = overview?.stats?.kd?.value ?? null;

  // ── Extract rank from the most recent season segment ──
  // TRN API returns multiple season segments. We want the most recent one
  // that actually has rank data. Seasons are typically ordered most-recent-first,
  // but we explicitly pick the one with the highest rankScore or last in the list.
  const seasonSegments = json.data.segments.filter(
    (s) => s.type === "season" && s.metadata?.name
  );

  let rank: string | null = null;

  if (seasonSegments.length > 0) {
    // Try to find a season with valid rank data (rankScore > 0)
    const rankedSeason = seasonSegments.find(
      (s) => s.stats?.rank?.value && Number(s.stats.rank.value) > 0
    );
    // Fall back to the first season segment (most recent)
    const bestSeason = rankedSeason ?? seasonSegments[0];
    rank = bestSeason?.stats?.rank?.displayValue ?? null;
  }

  // Fallback to overview rank if no season rank found
  if (!rank) {
    rank = overview?.stats?.rank?.displayValue ?? null;
  }

  return {
    username: json.data.platformInfo.platformUserHandle,
    rank,
    kd: kd !== null ? Math.round(kd * 100) / 100 : null,
    avatarUrl: json.data.platformInfo.avatarUrl ?? null,
  };
}
