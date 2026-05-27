"use server";

import type { R6PlayerStats, R6Platform } from "./types";
import { PLATFORM_MAP } from "./types";

const API_BASE = "https://api.r6data.com/api/stats";

// ── Mapeo de rank numérico (type=stats) a nombre legible ──
// Rank IDs usados por Ubisoft: 0=Unranked, 1-5=Copper, 6-10=Bronze, etc.
const RANK_NAMES: Record<number, string> = {
  0: "Unranked",
  1: "Copper V", 2: "Copper IV", 3: "Copper III", 4: "Copper II", 5: "Copper I",
  6: "Bronze V", 7: "Bronze IV", 8: "Bronze III", 9: "Bronze II", 10: "Bronze I",
  11: "Silver V", 12: "Silver IV", 13: "Silver III", 14: "Silver II", 15: "Silver I",
  16: "Gold V", 17: "Gold IV", 18: "Gold III", 19: "Gold II", 20: "Gold I",
  21: "Platinum V", 22: "Platinum IV", 23: "Platinum III", 24: "Platinum II", 25: "Platinum I",
  26: "Emerald V", 27: "Emerald IV", 28: "Emerald III", 29: "Emerald II", 30: "Emerald I",
  31: "Diamond V", 32: "Diamond IV", 33: "Diamond III", 34: "Diamond II", 35: "Diamond I",
  36: "Champion",
};

/**
 * Llamada genérica a la API de r6data.com.
 * Docs: https://r6data.com/api-docs
 */
async function r6dataFetch<T>(
  params: Record<string, string>,
  fresh: boolean = false
): Promise<T> {
  const apiKey = process.env.R6DATA_API_KEY;
  if (!apiKey) {
    throw new Error("R6DATA_API_KEY no configurada");
  }

  const url = new URL(API_BASE);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      "api-key": apiKey,
      Accept: "application/json",
    },
  };

  if (fresh) {
    fetchOptions.cache = "no-store";
  } else {
    fetchOptions.next = { revalidate: 3600 };
  }

  const res = await fetch(url.toString(), fetchOptions);

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("r6data.com: API key inválida o sin permisos");
    }
    if (res.status === 404) {
      throw new Error("r6data.com: Jugador no encontrado");
    }
    if (res.status === 429) {
      throw new Error("r6data.com: Límite de peticiones alcanzado (2500/mes)");
    }
    const text = await res.text().catch(() => "");
    throw new Error(`r6data.com error ${res.status}: ${text.substring(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

// ── Tipos internos para las respuestas ──

interface SeasonsStatsResponse {
  data?: {
    segments?: Array<{
      type: string;
      stats: Record<string, { value: number; displayValue: string }>;
      metadata?: {
        name?: string;
        shortName?: string;
        seasonName?: string;
      };
      attributes?: {
        season?: number;
        gamemode?: string;
        sessionType?: string;
      };
    }>;
    platformInfo?: {
      avatarUrl?: string;
      platformSlug?: string;
      platformUserId?: string;
      platformUserHandle?: string;
    };
    metadata?: {
      currentSeason?: number;
    };
  };
}

interface AccountInfoResponse {
  level?: number;
  profilePicture?: string;
  profiles?: Array<{
    platformType: string;
    nameOnPlatform: string;
  }>;
}

/**
 * Obtiene las stats de un jugador desde r6data.com.
 * Usa `seasonsStats` como fuente principal (K/D + rango en 1 sola llamada)
 * y `accountInfo` para el avatar.
 *
 * @param ubisoftId - Nombre de usuario en Ubisoft Connect
 * @param platform  - Plataforma (pc, playstation, xbox)
 * @param fresh     - Si true, ignora la cache de Next.js
 */
export async function fetchPlayerStats(
  ubisoftId: string,
  platform: string = "pc",
  fresh: boolean = false
): Promise<R6PlayerStats> {
  const r6Platform: R6Platform = PLATFORM_MAP[platform] ?? "uplay";

  // Fetch seasonsStats + accountInfo en paralelo (2 llamadas)
  const [seasonsData, accountData] = await Promise.all([
    r6dataFetch<SeasonsStatsResponse>(
      { type: "seasonsStats", nameOnPlatform: ubisoftId, platformType: r6Platform },
      fresh
    ).catch(() => null),
    r6dataFetch<AccountInfoResponse>(
      { type: "accountInfo", nameOnPlatform: ubisoftId, platformType: r6Platform },
      fresh
    ).catch(() => null),
  ]);

  let rank: string | null = null;
  let kd: number | null = null;
  let username = ubisoftId;
  let avatarUrl: string | null = null;

  // ── Extraer datos de seasonsStats ──
  if (seasonsData?.data) {
    const segments = seasonsData.data.segments ?? [];
    const currentSeason = seasonsData.data.metadata?.currentSeason;

    // Buscar el segmento ranked de la temporada actual
    const rankedSegment = segments.find(
      (s) =>
        s.attributes?.sessionType === "ranked" &&
        (currentSeason ? s.attributes?.season === currentSeason : true)
    ) ?? segments.find((s) => s.attributes?.sessionType === "ranked");

    if (rankedSegment) {
      // K/D
      const kdValue = rankedSegment.stats?.kdRatio?.value;
      if (typeof kdValue === "number") {
        kd = Math.round(kdValue * 100) / 100;
      }

      // Rank points → nombre del rango
      const rankPoints = rankedSegment.stats?.rankPoints?.value;
      if (typeof rankPoints === "number") {
        rank = rankPointsToName(rankPoints);
      }
    }

    // Username y avatar del platformInfo
    if (seasonsData.data.platformInfo) {
      username = seasonsData.data.platformInfo.platformUserHandle ?? ubisoftId;
      avatarUrl = seasonsData.data.platformInfo.avatarUrl ?? null;
    }
  }

  // ── Avatar de accountInfo (mejor calidad) ──
  if (accountData?.profilePicture) {
    avatarUrl = accountData.profilePicture;
  }

  // ── Fallback: si seasonsStats no dio rango, intentar con type=stats ──
  if (rank === null) {
    rank = await fetchRankFromStats(ubisoftId, r6Platform, fresh);
  }

  // ── Fallback: si no hay K/D, intentar con type=stats ──
  if (kd === null) {
    kd = await fetchKDFromStats(ubisoftId, r6Platform, fresh);
  }

  return { username, rank, kd, avatarUrl };
}

/**
 * Convierte rank points a nombre de rango.
 * Sistema de Y11+ (rank points, no MMR):
 * - 0-999: Copper V-I
 * - 1000-1499: Bronze V-I
 * - 1500-1999: Silver V-I
 * - 2000-2499: Gold V-I
 * - 2500-2999: Platinum V-I
 * - 3000-3499: Emerald V-I
 * - 3500-3999: Diamond V-I
 * - 4000-4099: Diamond I
 * - 4100+: Champion
 */
function rankPointsToName(rp: number): string {
  if (rp >= 4100) return "Champion";

  const tiers = [
    { name: "Copper", min: 0, max: 999 },
    { name: "Bronze", min: 1000, max: 1499 },
    { name: "Silver", min: 1500, max: 1999 },
    { name: "Gold", min: 2000, max: 2499 },
    { name: "Platinum", min: 2500, max: 2999 },
    { name: "Emerald", min: 3000, max: 3499 },
    { name: "Diamond", min: 3500, max: 4099 },
  ];

  for (const tier of tiers) {
    if (rp >= tier.min && rp <= tier.max) {
      const range = tier.max - tier.min + 1;
      const subdivisionSize = range / 5;
      const offset = rp - tier.min;
      const subdivision = Math.min(Math.floor(offset / subdivisionSize), 4);
      const numerals = ["V", "IV", "III", "II", "I"];
      return `${tier.name} ${numerals[subdivision]}`;
    }
  }

  return "Unranked";
}

/**
 * Fallback: obtener rango desde type=stats (usa rank ID numérico).
 */
async function fetchRankFromStats(
  ubisoftId: string,
  r6Platform: R6Platform,
  fresh: boolean
): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await r6dataFetch<any>(
      {
        type: "stats",
        nameOnPlatform: ubisoftId,
        platformType: r6Platform,
        platform_families: r6Platform === "uplay" ? "pc" : "console",
      },
      fresh
    );

    const ranked = data?.platform_families_full_profiles?.[0]
      ?.board_ids_full_profiles?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (b: any) => b.board_id === "ranked"
      );

    const profile = ranked?.full_profiles?.[0]?.profile;
    if (!profile) return null;

    // rank es un ID numérico (0-36)
    const rankId = profile.rank;
    if (typeof rankId === "number" && rankId > 0) {
      return RANK_NAMES[rankId] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fallback: obtener K/D desde type=stats.
 */
async function fetchKDFromStats(
  ubisoftId: string,
  r6Platform: R6Platform,
  fresh: boolean
): Promise<number | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await r6dataFetch<any>(
      {
        type: "stats",
        nameOnPlatform: ubisoftId,
        platformType: r6Platform,
        platform_families: r6Platform === "uplay" ? "pc" : "console",
      },
      fresh
    );

    const ranked = data?.platform_families_full_profiles?.[0]
      ?.board_ids_full_profiles?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (b: any) => b.board_id === "ranked"
      );

    const profile = ranked?.full_profiles?.[0]?.profile;
    if (!profile) return null;

    const kills = profile.kills;
    const deaths = profile.deaths;
    if (typeof kills === "number" && typeof deaths === "number" && deaths > 0) {
      return Math.round((kills / deaths) * 100) / 100;
    }

    return null;
  } catch {
    return null;
  }
}

// Re-exportar tipos para mantener compatibilidad
export type { R6PlayerStats, R6Platform };
export { PLATFORM_MAP };
