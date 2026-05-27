/**
 * Tipos para la API de r6data.com
 * Docs: https://r6data.com/api-docs
 */

// ── Datos procesados que usamos en Tebiinder ──

export interface R6PlayerStats {
  username: string;
  rank: string | null;
  kd: number | null;
  avatarUrl: string | null;
}

// ── Plataformas ──

export type R6Platform = "uplay" | "psn" | "xbl";

export const PLATFORM_MAP: Record<string, R6Platform> = {
  pc: "uplay",
  playstation: "psn",
  xbox: "xbl",
};
