#!/usr/bin/env node

/**
 * Script de prueba para verificar la conexión con la API de r6data.com.
 *
 * Uso:
 *   node scripts/test-r6data.js TU_API_KEY [ubisoftId] [platform]
 *
 * Ejemplos:
 *   node scripts/test-r6data.js mi-api-key-aqui
 *   node scripts/test-r6data.js mi-api-key-aqui Beaulo uplay
 *   node scripts/test-r6data.js mi-api-key-aqui NombreJugador psn
 *
 * Plataformas válidas: uplay (PC), psn (PlayStation), xbl (Xbox)
 *
 * Obtener API key gratis en: https://r6data.com
 */

const API_BASE = "https://api.r6data.com/api/stats";

const DEFAULT_PLAYER = "Beaulo";
const DEFAULT_PLATFORM = "uplay";

async function testR6Data(apiKey, ubisoftId, platform) {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║       TEST DE CONEXIÓN — r6data.com API         ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  console.log(`  API Key:     ${apiKey.substring(0, 8)}...`);
  console.log(`  Jugador:     ${ubisoftId}`);
  console.log(`  Plataforma:  ${platform}\n`);
  console.log("─".repeat(52));

  // ── Test 1: Autenticación con accountInfo ──
  console.log("\n[1/4] Probando autenticación (accountInfo)...");
  try {
    const url = `${API_BASE}?type=accountInfo&nameOnPlatform=${encodeURIComponent(ubisoftId)}&platformType=${platform}`;
    console.log(`  URL: ${url}`);

    const res = await fetch(url, {
      headers: { "api-key": apiKey, Accept: "application/json" },
    });

    if (res.status === 401 || res.status === 403) {
      console.log("  ❌ ERROR — API key inválida o sin permisos.");
      console.log("     Verifica tu key en https://r6data.com/dashboard");
      return;
    }

    if (res.status === 429) {
      console.log("  ⚠️  Límite de peticiones alcanzado.");
      console.log("     Plan gratuito: 2500 peticiones/mes.");
      return;
    }

    const text = await res.text();
    console.log(`  Status: ${res.status}`);

    let json;
    try {
      json = JSON.parse(text);
      console.log("  ✅ Autenticación OK");
      console.log("  Respuesta accountInfo:");
      console.log(JSON.stringify(json, null, 2).split("\n").map(l => "    " + l).join("\n"));
    } catch {
      console.log(`  Respuesta (no JSON): ${text.substring(0, 300)}`);
    }
  } catch (err) {
    console.log(`  ❌ Error de red: ${err.message}`);
    return;
  }

  // ── Test 2: Stats generales ──
  console.log("\n[2/4] Probando stats generales...");
  try {
    const url = `${API_BASE}?type=stats&nameOnPlatform=${encodeURIComponent(ubisoftId)}&platformType=${platform}&platform_families=${platform === "uplay" ? "pc" : "console"}`;
    console.log(`  URL: ${url}`);

    const res = await fetch(url, {
      headers: { "api-key": apiKey, Accept: "application/json" },
    });

    const text = await res.text();
    console.log(`  Status: ${res.status}`);

    let json;
    try {
      json = JSON.parse(text);
      console.log("  ✅ Respuesta recibida");

      // Intentar extraer K/D
      let kd = null;
      if (typeof json.kd === "number") kd = json.kd;
      else if (typeof json.kdRatio === "number") kd = json.kdRatio;
      else if (json.data?.kd) kd = json.data.kd;
      else if (json.stats?.kd) kd = json.stats.kd;

      // Intentar desde kills/deaths
      if (kd === null) {
        const inner = json.data ?? json.stats ?? json;
        const kills = inner.kills ?? inner.totalKills;
        const deaths = inner.deaths ?? inner.totalDeaths;
        if (kills && deaths && deaths > 0) {
          kd = Math.round((kills / deaths) * 100) / 100;
          console.log(`  K/D (calculado): ${kd} (${kills} kills / ${deaths} deaths)`);
        }
      } else {
        console.log(`  K/D (directo): ${kd}`);
      }

      if (kd === null) {
        console.log("  ⚠️  No se encontró K/D en la respuesta.");
        console.log("  Estructura de la respuesta (primeros niveles):");
        printStructure(json, "    ", 0, 3);
      }
    } catch {
      console.log(`  Respuesta (no JSON): ${text.substring(0, 300)}`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
  }

  // ── Test 3: SeasonalStats (para rango) ──
  console.log("\n[3/4] Probando seasonalStats (rango)...");
  try {
    const url = `${API_BASE}?type=seasonalStats&nameOnPlatform=${encodeURIComponent(ubisoftId)}&platformType=${platform}`;
    console.log(`  URL: ${url}`);

    const res = await fetch(url, {
      headers: { "api-key": apiKey, Accept: "application/json" },
    });

    const text = await res.text();
    console.log(`  Status: ${res.status}`);

    let json;
    try {
      json = JSON.parse(text);
      console.log("  ✅ Respuesta recibida");

      // Extraer rango del último entry
      const historyData = json?.data?.history?.data;
      if (historyData && historyData.length > 0) {
        const lastEntry = historyData[historyData.length - 1];
        const rank = lastEntry?.[1]?.metadata?.rank;
        const rankPoints = lastEntry?.[1]?.value;
        console.log(`  Rango actual: ${rank ?? "No encontrado"}`);
        console.log(`  Rank Points:  ${rankPoints ?? "No encontrado"}`);
        console.log(`  Entradas de historial: ${historyData.length}`);
      } else {
        console.log("  ⚠️  No se encontraron datos de temporada.");
        console.log("  Estructura de la respuesta:");
        printStructure(json, "    ", 0, 3);
      }
    } catch {
      console.log(`  Respuesta (no JSON): ${text.substring(0, 300)}`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
  }

  // ── Test 4: SeasonsStats (historial de temporadas) ──
  console.log("\n[4/4] Probando seasonsStats (historial)...");
  try {
    const url = `${API_BASE}?type=seasonsStats&nameOnPlatform=${encodeURIComponent(ubisoftId)}&platformType=${platform}`;
    console.log(`  URL: ${url}`);

    const res = await fetch(url, {
      headers: { "api-key": apiKey, Accept: "application/json" },
    });

    const text = await res.text();
    console.log(`  Status: ${res.status}`);

    let json;
    try {
      json = JSON.parse(text);
      console.log("  ✅ Respuesta recibida");
      console.log("  Estructura de la respuesta:");
      printStructure(json, "    ", 0, 4);
    } catch {
      console.log(`  Respuesta (no JSON): ${text.substring(0, 300)}`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
  }

  // ── Resumen ──
  console.log("\n" + "─".repeat(52));
  console.log("\n  ✅ Tests completados.");
  console.log("\n  Próximos pasos:");
  console.log("    1. Copia tu API key de r6data.com");
  console.log("    2. Añádela en .env.local (variable R6DATA_API_KEY)");
  console.log("    3. Añádela en Vercel → Settings → Environment Variables");
  console.log("    4. Redespliega en Vercel\n");
}

/** Imprime la estructura de un objeto mostrando tipos y valores */
function printStructure(obj, prefix, depth, maxDepth) {
  if (depth >= maxDepth) {
    console.log(`${prefix}... (truncado)`);
    return;
  }

  if (Array.isArray(obj)) {
    console.log(`${prefix}Array[${obj.length}]`);
    if (obj.length > 0) {
      console.log(`${prefix}  [0]:`);
      printStructure(obj[0], prefix + "    ", depth + 1, maxDepth);
    }
    return;
  }

  if (obj && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      if (val && typeof val === "object") {
        console.log(`${prefix}${key}: ${Array.isArray(val) ? `Array[${val.length}]` : "Object"}`);
        printStructure(val, prefix + "  ", depth + 1, maxDepth);
      } else {
        console.log(`${prefix}${key}: ${JSON.stringify(val)} (${typeof val})`);
      }
    }
  } else {
    console.log(`${prefix}${JSON.stringify(obj)} (${typeof obj})`);
  }
}

// ── CLI ──
const args = process.argv.slice(2);
const apiKey = args[0];
const ubisoftId = args[1] || DEFAULT_PLAYER;
const platform = args[2] || DEFAULT_PLATFORM;

if (!apiKey) {
  console.log("Uso: node scripts/test-r6data.js TU_API_KEY [ubisoftId] [platform]\n");
  console.log("Necesitas una API key gratuita de https://r6data.com");
  console.log("Plataformas: uplay (PC), psn (PlayStation), xbl (Xbox)");
  process.exit(1);
}

testR6Data(apiKey, ubisoftId, platform);
