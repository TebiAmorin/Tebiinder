#!/usr/bin/env node

/**
 * Script de prueba para verificar la conexión con la API de R6 Tracker (TRN).
 *
 * Uso:
 *   node scripts/test-r6tracker.js TU_API_KEY [ubisoftId] [platform]
 *
 * Ejemplos:
 *   node scripts/test-r6tracker.js 8074102b-7ecd-4c43-b988-3f4bc3d989ae
 *   node scripts/test-r6tracker.js MI_NUEVA_KEY Beaulo.TSM uplay
 *   node scripts/test-r6tracker.js MI_NUEVA_KEY NombreJugador psn
 *
 * Plataformas válidas: uplay (PC), psn (PlayStation), xbl (Xbox)
 */

const API_BASE = "https://public-api.tracker.gg/v2/r6siege/standard";

// Jugador de prueba por defecto (conocido en la comunidad)
const DEFAULT_PLAYER = "Beaulo.TSM";
const DEFAULT_PLATFORM = "uplay";

async function testConnection(apiKey, ubisoftId, platform) {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║     TEST DE CONEXIÓN — R6 TRACKER (TRN API)     ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  console.log(`  API Key:     ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`  Jugador:     ${ubisoftId}`);
  console.log(`  Plataforma:  ${platform}`);
  console.log(`  URL:         ${API_BASE}/profile/${platform}/${encodeURIComponent(ubisoftId)}\n`);
  console.log("─".repeat(52));

  // ── Test 1: Autenticación ──
  console.log("\n[1/3] Probando autenticación...");
  try {
    const res = await fetch(
      `${API_BASE}/profile/${platform}/${encodeURIComponent(ubisoftId)}`,
      {
        headers: {
          "TRN-Api-Key": apiKey,
          Accept: "application/json",
        },
      }
    );

    if (res.status === 401) {
      console.log("  ❌ ERROR 401 — Credenciales inválidas.");
      console.log("     Tu API key está expirada o es incorrecta.");
      console.log("     Ve a https://tracker.gg/developers para obtener una nueva.");
      return;
    }

    if (res.status === 429) {
      console.log("  ⚠️  ERROR 429 — Demasiadas peticiones (rate limited).");
      console.log("     La key SÍ es válida, pero has hecho demasiadas peticiones.");
      console.log("     Espera 1-2 minutos e inténtalo de nuevo.");
      return;
    }

    if (res.status === 404) {
      console.log("  ✅ Autenticación OK (key válida)");
      console.log(`  ⚠️  Jugador "${ubisoftId}" no encontrado en plataforma "${platform}".`);
      console.log("     Prueba con otro nombre de jugador o verifica la plataforma.");
      return;
    }

    if (!res.ok) {
      console.log(`  ❌ ERROR ${res.status} — Respuesta inesperada.`);
      const text = await res.text();
      console.log(`     Body: ${text.substring(0, 200)}`);
      return;
    }

    console.log("  ✅ Autenticación OK");

    // ── Test 2: Parsear datos ──
    console.log("\n[2/3] Parseando datos del jugador...");
    const json = await res.json();

    if (!json.data) {
      console.log("  ❌ Respuesta sin datos (json.data es null/undefined).");
      return;
    }

    const platformInfo = json.data.platformInfo;
    console.log(`  ✅ Jugador encontrado: ${platformInfo.platformUserHandle}`);
    if (platformInfo.avatarUrl) {
      console.log(`     Avatar: ${platformInfo.avatarUrl}`);
    }

    // ── Test 3: Extraer stats ──
    console.log("\n[3/3] Extrayendo estadísticas...");

    // K/D from overview
    const overview = json.data.segments.find((s) => s.type === "overview");
    const kd = overview?.stats?.kd?.value ?? null;
    console.log(`  K/D (overview): ${kd !== null ? (Math.round(kd * 100) / 100).toFixed(2) : "No disponible"}`);

    // Rank from season segments
    const seasonSegments = json.data.segments.filter(
      (s) => s.type === "season" && s.metadata?.name
    );
    console.log(`  Segmentos de temporada encontrados: ${seasonSegments.length}`);

    let rank = null;
    if (seasonSegments.length > 0) {
      const rankedSeason = seasonSegments.find(
        (s) => s.stats?.rank?.value && Number(s.stats.rank.value) > 0
      );
      const bestSeason = rankedSeason ?? seasonSegments[0];
      rank = bestSeason?.stats?.rank?.displayValue ?? null;
      console.log(`  Temporada usada: ${bestSeason?.metadata?.name ?? "desconocida"}`);
    }

    // Fallback to overview rank
    if (!rank) {
      rank = overview?.stats?.rank?.displayValue ?? null;
      if (rank) console.log("  (Rango obtenido del overview, no de temporada)");
    }

    console.log(`  Rango: ${rank ?? "No disponible"}`);

    // ── Resumen ──
    console.log("\n" + "─".repeat(52));
    console.log("\n  ✅ ¡TODO FUNCIONA CORRECTAMENTE!");
    console.log("\n  Resumen:");
    console.log(`    Jugador:  ${platformInfo.platformUserHandle}`);
    console.log(`    Rango:    ${rank ?? "N/A"}`);
    console.log(`    K/D:      ${kd !== null ? (Math.round(kd * 100) / 100).toFixed(2) : "N/A"}`);
    console.log("\n  Ahora actualiza la API key en:");
    console.log("    1. .env.local (variable R6TRACKER_API_KEY)");
    console.log("    2. Vercel → Settings → Environment Variables");
    console.log("    3. Redesplegar en Vercel para que tome efecto\n");
  } catch (err) {
    console.log(`  ❌ Error de red: ${err.message}`);
  }
}

// ── CLI ──
const args = process.argv.slice(2);
const apiKey = args[0];
const ubisoftId = args[1] || DEFAULT_PLAYER;
const platform = args[2] || DEFAULT_PLATFORM;

if (!apiKey) {
  console.log("Uso: node scripts/test-r6tracker.js TU_API_KEY [ubisoftId] [platform]\n");
  console.log("Necesitas una API key de https://tracker.gg/developers");
  console.log("Plataformas: uplay (PC), psn (PlayStation), xbl (Xbox)");
  process.exit(1);
}

testConnection(apiKey, ubisoftId, platform);
