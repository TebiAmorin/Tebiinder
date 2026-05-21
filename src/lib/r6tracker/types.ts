/** Tipos de respuesta de la API de R6Tracker (TRN) */

export interface R6TrackerProfile {
  data: {
    platformInfo: {
      platformSlug: string;
      platformUserId: string;
      platformUserHandle: string;
      avatarUrl: string | null;
    };
    segments: R6Segment[];
  } | null;
  errors?: { message: string }[];
}

export interface R6Segment {
  type: string; // "overview", "season", etc.
  metadata?: {
    name?: string;
  };
  stats: Record<string, R6Stat>;
}

export interface R6Stat {
  value: number;
  displayValue: string;
  percentile?: number;
}

/** Datos procesados que nos interesan para Tebiinder */
export interface R6PlayerStats {
  username: string;
  rank: string | null;
  kd: number | null;
  avatarUrl: string | null;
}

/** Plataformas soportadas por la API */
export type R6Platform = "uplay" | "psn" | "xbl";

/** Mapeo de nuestras plataformas a las de la API */
export const PLATFORM_MAP: Record<string, R6Platform> = {
  pc: "uplay",
  playstation: "psn",
  xbox: "xbl",
};
