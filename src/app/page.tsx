import Link from "next/link";
import Image from "next/image";
import { fetchPageData } from "@/lib/fetchPageData";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { user, userRole, existingPlayer, existingTeam, jugadores, equipos } =
    await fetchPageData();

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      "entry-fragger": "Entry Fragger",
      support: "Soporte",
      flex: "Flex",
      anchor: "Ancla",
      roamer: "Roamer",
      "hard-breach": "Hard Breach",
      intel: "Intel",
    };
    return roles[role] || role;
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case "pc": return "PC";
      case "playstation": return "PlayStation";
      case "xbox": return "Xbox";
      default: return platform;
    }
  };

  return (
    <>
      <Navbar
        user={user}
        userRole={userRole}
        existingPlayer={existingPlayer}
        existingTeam={existingTeam}
      />

      <div className="perspective-container">
        <div className="perspective-grid-inner" />
      </div>

      <main className="flex-1 flex flex-col items-center px-4 relative max-w-5xl w-full mx-auto pb-20">

        {/* ── HERO ── */}
        <section className="w-full max-w-3xl text-center pt-14 pb-6 sm:pt-20 sm:pb-10 space-y-6">

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-wide uppercase leading-[0.85] text-white select-none drop-shadow-[5px_5px_0px_rgba(0,0,0,0.5)]">
            TEBIINDER
          </h1>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wider leading-tight select-none">
            ENCUENTRA EQUIPO.{" "}
            <span className="text-[#FF5A00]">CLASIFÍCATE.</span>{" "}
            <span className="text-[#00F5D4]">VIAJA A VALENCIA.</span>
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Arma tu roster de 5 y compite en los clasificatorios de la{" "}
            <strong className="text-[#00f5d4]">OWN Masters R6 Siege</strong>.{" "}
            Más de <strong className="text-[#FF5A00]">1.500&#x20AC; en premios</strong> y viaje a Valencia.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="px-4 py-2 bg-[#150a24] border-2 border-white/30 rounded-xl text-white text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5a00]" />
              {jugadores.length} Jugadores
            </span>
            <span className="px-4 py-2 bg-[#150a24] border-2 border-white/30 rounded-xl text-white text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
              {equipos.length} Equipos
            </span>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/buscar"
              className="w-full sm:w-auto px-8 py-4 bg-[#ff5a00] text-white border-4 border-black font-display font-black text-xl uppercase tracking-wider rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Equipo
            </Link>
            {!user && (
              <a
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-4 bg-[#5865F2] text-white border-4 border-black font-display font-black text-xl uppercase tracking-wider rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                Entrar con Discord
              </a>
            )}
          </div>
        </section>

        {/* ── 3 PASOS ── */}
        <section className="w-full max-w-3xl py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                num: "1",
                title: "Entra con Discord",
                desc: "Un clic. Tu Discord es tu perfil de combate.",
                color: "bg-[#5865F2]",
              },
              {
                num: "2",
                title: "Publica tu Ficha",
                desc: "Jugador suelto o capitán de equipo. Tus stats se sincronizan.",
                color: "bg-[#ff5a00]",
              },
              {
                num: "3",
                title: "Conecta y Compite",
                desc: "Contacta por Discord, monta el roster e inscríbete al torneo.",
                color: "bg-[#00f5d4]",
                textDark: true,
              },
            ].map((s) => (
              <div
                key={s.num}
                className="bg-[#150a24] border-3 border-white/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3"
              >
                <div className={`w-11 h-11 ${s.color} ${s.textDark ? "text-black" : "text-white"} border-3 border-black text-lg font-display font-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center`}>
                  {s.num}
                </div>
                <h3 className="font-display font-black text-base uppercase tracking-wider text-white leading-snug">
                  {s.title}
                </h3>
                <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TORNEO RESUMEN ── */}
        <section className="w-full max-w-3xl py-6">
          <div className="bg-[#150a24] border-4 border-white rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">

            {/* Banner */}
            <div className="relative">
              <Image
                src="/R6 Masters Fotos/HEADERWEB_OWNMASTERS_RAINBOWSIX_2026.png"
                alt="OWN Masters Rainbow Six Siege 2026"
                width={1200}
                height={400}
                className="w-full h-28 sm:h-40 object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150a24] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display font-black text-lg sm:text-2xl uppercase text-white leading-snug drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    OWN Masters R6 Siege
                  </h3>
                  <span className="font-mono text-white/70 text-[10px] font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    Ubisoft x OWN
                  </span>
                </div>
                <Link
                  href="/torneo"
                  className="shrink-0 px-4 py-2 bg-white text-black border-2 border-black rounded-lg font-display font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
                >
                  Ver Todo
                </Link>
              </div>
            </div>

            {/* Dates */}
            <div className="p-5 grid grid-cols-3 gap-3">
              <a
                href="https://www.challengermode.com/s/own/tournaments/d546f505-fe8e-4adc-9aec-08deaf628dd5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border-2 border-[#ff5a00]/40 rounded-xl p-4 text-center hover:border-[#ff5a00] hover:bg-[#ff5a00]/10 transition-colors group"
              >
                <span className="text-[8px] font-mono font-black text-[#ff5a00] uppercase tracking-widest block">QL1</span>
                <span className="font-display font-black text-base sm:text-xl text-white leading-snug block mt-1">5 Jun</span>
                <span className="font-mono text-zinc-400 text-[10px] block mt-0.5">18:00H</span>
                <span className="text-[9px] font-mono font-bold text-[#ff5a00] mt-2 block group-hover:underline">Inscribirse &#x2192;</span>
              </a>
              <a
                href="https://www.challengermode.com/s/own/tournaments/835ecd48-649c-43cf-ba45-08deba39a012"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border-2 border-[#ff5a00]/40 rounded-xl p-4 text-center hover:border-[#ff5a00] hover:bg-[#ff5a00]/10 transition-colors group"
              >
                <span className="text-[8px] font-mono font-black text-[#ff5a00] uppercase tracking-widest block">QL2</span>
                <span className="font-display font-black text-base sm:text-xl text-white leading-snug block mt-1">13 Jun</span>
                <span className="font-mono text-zinc-400 text-[10px] block mt-0.5">14:00H</span>
                <span className="text-[9px] font-mono font-bold text-[#ff5a00] mt-2 block group-hover:underline">Inscribirse &#x2192;</span>
              </a>
              <div className="bg-black/30 border-2 border-[#00f5d4]/40 rounded-xl p-4 text-center">
                <span className="text-[8px] font-mono font-black text-[#00f5d4] uppercase tracking-widest block">Playoffs</span>
                <span className="font-display font-black text-base sm:text-xl text-white leading-snug block mt-1">19 Jun</span>
                <span className="font-mono text-zinc-400 text-[10px] block mt-0.5">BO3</span>
                <span className="text-[9px] font-mono text-zinc-500 mt-2 block">4 equipos</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABLÓN DE FICHAJES ── */}
        <section className="w-full max-w-3xl py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wide text-white leading-snug">
              Tablón de Fichajes
            </h2>
            <Link
              href="/buscar"
              className="px-4 py-2 bg-white text-black border-2 border-black rounded-lg text-xs font-display font-black uppercase tracking-wider hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all shrink-0"
            >
              Ver Todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Jugadores */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#ff5a00]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a00]" />
                <h3 className="font-display font-black text-sm uppercase text-zinc-300 tracking-wider">
                  Jugadores sin Equipo
                </h3>
              </div>

              {jugadores.slice(0, 3).map((jugador) => (
                <div
                  key={jugador.id}
                  className="bg-[#150a24] border-2 border-white/15 rounded-xl p-4 hover:border-white/30 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: jugador.rank_color || "#ff5a00" }} />
                  <div className="flex items-center gap-3 mt-0.5">
                    {jugador.discord_avatar ? (
                      <Image
                        src={jugador.discord_avatar}
                        alt={jugador.discord_username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover border-2 border-white/30"
                        unoptimized={jugador.discord_avatar.includes("embed/avatars")}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#5f25a3] rounded-lg border-2 border-white/30 flex items-center justify-center font-display font-black text-white text-sm">
                        {jugador.discord_username.substring(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-white uppercase truncate leading-snug">
                          {jugador.ubisoft_id ?? jugador.discord_username.split("#")[0]}
                        </span>
                        {jugador.rank_image_url && (
                          <Image
                            src={jugador.rank_image_url}
                            alt={jugador.rango ?? "Rank"}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain shrink-0"
                            style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,1))" }}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono font-bold text-[#FF5A00]">
                          {getRoleLabel(jugador.rol_principal)}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          K/D {jugador.kd ? Number(jugador.kd).toFixed(2) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/buscar"
                className="block text-center py-2.5 text-[#ff5a00] font-mono text-xs font-bold hover:underline"
              >
                Ver {jugadores.length} jugadores &#x2192;
              </Link>
            </div>

            {/* Equipos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#00F5D4]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4]" />
                <h3 className="font-display font-black text-sm uppercase text-zinc-300 tracking-wider">
                  Equipos Reclutando
                </h3>
              </div>

              {equipos.slice(0, 3).map((equipo) => (
                <div
                  key={equipo.id}
                  className="bg-[#150a24] border-2 border-white/15 rounded-xl p-4 hover:border-white/30 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#00F5D4]" />
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="w-10 h-10 bg-[#2d1b54] rounded-lg border-2 border-white/30 flex items-center justify-center font-display font-black text-white text-xs shrink-0">
                      {equipo.nombre_equipo.split(" ").map((w) => w[0]).join("").substring(0, 3).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-display font-black text-sm text-white uppercase truncate leading-snug block">
                        {equipo.nombre_equipo}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono font-bold text-[#FF5A00]">
                          Busca: {getRoleLabel(equipo.rol_buscado)}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {equipo.integrantes_ubisoft_ids?.length || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/buscar"
                className="block text-center py-2.5 text-[#00f5d4] font-mono text-xs font-bold hover:underline"
              >
                Ver {equipos.length} equipos &#x2192;
              </Link>
            </div>

          </div>
        </section>

        {/* ── CTA FINAL ── */}
        {!user && (
          <section className="w-full max-w-3xl py-8">
            <div className="bg-[#ff5a00] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="text-center sm:text-left">
                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white leading-snug mb-2">
                  &#x00BF;Sin equipo?
                </h3>
                <p className="text-white/90 text-sm font-sans max-w-sm">
                  Publica tu ficha en 30 segundos y deja que los equipos te encuentren.
                </p>
              </div>
              <a
                href="/auth/login"
                className="shrink-0 px-6 py-3.5 bg-white text-black border-4 border-black font-display font-black text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-3px] active:translate-y-[1px] transition-all rounded-xl"
              >
                Entrar con Discord
              </a>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="w-full max-w-3xl border-t-2 border-white/10 py-8 mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
          <span>Tebiinder &mdash; Tebimedia 2026</span>
          <a href="https://x.com/TebiiR6" target="_blank" rel="noopener noreferrer" className="text-[#ff5a00] hover:text-white transition-colors">
            @TebiiR6
          </a>
        </footer>
      </main>
    </>
  );
}
