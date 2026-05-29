import Link from "next/link";
import Image from "next/image";
import { fetchPageData } from "@/lib/fetchPageData";
import Navbar from "@/components/Navbar";

export default async function TorneoPage() {
  const { user, userRole, existingPlayer, existingTeam } = await fetchPageData();

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

      <main className="flex-1 flex flex-col items-center px-4 relative max-w-4xl w-full mx-auto pb-20 pt-10">

        {/* ── HEADER ── */}
        <section className="w-full bg-[#150a24] border-4 border-white rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-12">
          <Image
            src="/R6 Masters Fotos/HEADERWEB_OWNMASTERS_RAINBOWSIX_2026.png"
            alt="OWN Masters Rainbow Six Siege 2026"
            width={1200}
            height={400}
            className="w-full h-36 sm:h-52 object-cover object-center"
            priority
          />
          <div className="absolute top-0 left-0 right-0 h-36 sm:h-52 bg-gradient-to-t from-[#150a24] via-[#150a24]/30 to-transparent" />

          <div className="p-6 sm:p-10 space-y-4 relative -mt-6 sm:-mt-10">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#00f5d4] text-black border-2 border-black text-[10px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                OWN Masters 2026
              </span>
              <span className="px-3 py-1 bg-white/10 text-white border border-white/20 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg">
                Ubisoft x OWN
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-wide uppercase text-white leading-tight">
              OWN MASTERS<br />RAINBOW SIX SIEGE
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base max-w-xl font-sans leading-relaxed">
              Torneo oficial organizado por <strong className="text-white">Ubisoft</strong> en colaboración con <strong className="text-white">OWN</strong>. Clasifícate online y compite en el <strong className="text-[#00f5d4]">R6 Showdown de OWN Valencia</strong> (3-5 Julio).
            </p>
          </div>
        </section>

        {/* ── CALENDARIO + INSCRIPCIÓN ── */}
        <section className="w-full space-y-6 mb-12">
          <div className="border-b-2 border-white/10 pb-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wide text-white leading-snug">
              Calendario e Inscripción
            </h2>
            <p className="text-zinc-400 font-mono text-xs mt-1.5">
              Inscríbete en Challengermode
            </p>
          </div>

          <div className="space-y-5">

            {/* QL 1 */}
            <div className="bg-[#150a24] border-3 border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#ff5a00] border-2 border-black rounded text-[10px] font-mono font-black uppercase text-white">
                    1&#x00BA; Clasificatorio
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">BO1</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase leading-snug">
                  Jueves 5 de Junio — 18:00H
                </h3>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed max-w-md">
                  Primer clasificatorio online. Llaves directas BO1. Los 2 mejores equipos clasifican a Playoffs.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <span className="font-display font-black text-sm uppercase border-2 border-white/20 bg-black/30 text-[#00f5d4] px-4 py-2 rounded-xl text-center">
                  2 Plazas
                </span>
                <a
                  href="https://www.challengermode.com/s/own/tournaments/d546f505-fe8e-4adc-9aec-08deaf628dd5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#ff5a00] text-white border-3 border-black rounded-xl font-display font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[1px] transition-all text-center"
                >
                  Inscribirse QL1
                </a>
              </div>
            </div>

            {/* QL 2 */}
            <div className="bg-[#150a24] border-3 border-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#ff5a00] border-2 border-black rounded text-[10px] font-mono font-black uppercase text-white">
                    2&#x00BA; Clasificatorio
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">BO1</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase leading-snug">
                  Viernes 13 de Junio — 14:00H
                </h3>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed max-w-md">
                  Segunda oportunidad. Equipos no clasificados en QL1 pueden re-apuntarse. 2 equipos más clasifican.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <span className="font-display font-black text-sm uppercase border-2 border-white/20 bg-black/30 text-[#00f5d4] px-4 py-2 rounded-xl text-center">
                  2 Plazas
                </span>
                <a
                  href="https://www.challengermode.com/s/own/tournaments/835ecd48-649c-43cf-ba45-08deba39a012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#ff5a00] text-white border-3 border-black rounded-xl font-display font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[1px] transition-all text-center"
                >
                  Inscribirse QL2
                </a>
              </div>
            </div>

            {/* Playoffs */}
            <div className="bg-[#150a24] border-3 border-[#00f5d4] rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#00f5d4] text-black border-2 border-black rounded text-[10px] font-mono font-black uppercase">
                    Playoffs
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">BO3</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase leading-snug">
                  Jueves 19 de Junio
                </h3>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed max-w-md">
                  Los 4 equipos clasificados se enfrentan en playoffs BO3 para determinar el podio final.
                </p>
              </div>
              <span className="font-display font-black text-sm uppercase border-2 border-[#00f5d4]/30 bg-black/30 text-[#00f5d4] px-4 py-2 rounded-xl text-center shrink-0">
                4 Equipos
              </span>
            </div>

            {/* Showmatch OWN Valencia */}
            <div className="bg-gradient-to-r from-[#150a24] to-[#2d1b54] border-3 border-white rounded-2xl p-6 text-center space-y-2">
              <span className="px-3 py-1 bg-[#00f5d4] text-black border-2 border-black text-[10px] font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg inline-block">
                Showmatch Presencial
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-snug">
                R6 Showdown — OWN Valencia
              </h3>
              <p className="font-display font-black text-lg text-[#ff5a00]">3 — 5 de Julio</p>
              <p className="text-zinc-400 text-xs font-sans max-w-md mx-auto">
                El equipo ganador viaja a Valencia para el showmatch presencial en OWN Valencia.
              </p>
            </div>
          </div>
        </section>

        {/* ── PREMIOS ── */}
        <section className="w-full mb-12">
          <div className="border-b-2 border-white/10 pb-3 mb-6">
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wide text-white leading-snug">
              Premios
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 1er puesto */}
            <div className="bg-[#150a24] border-3 border-[#ffd700] rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
              <span className="text-4xl">&#x1F947;</span>
              <h3 className="font-display font-black text-xl text-white uppercase leading-snug">1er Puesto</h3>
              <div className="space-y-1.5">
                <p className="font-display font-black text-2xl text-[#FF5A00]">1.000 &#x20AC;</p>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  + Viaje y alojamiento para participar en el evento de OWN Valencia
                </p>
              </div>
            </div>

            {/* 2do puesto */}
            <div className="bg-[#150a24] border-3 border-[#c0c0c0] rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
              <span className="text-4xl">&#x1F948;</span>
              <h3 className="font-display font-black text-xl text-white uppercase leading-snug">2do Puesto</h3>
              <div className="space-y-1.5">
                <p className="font-display font-black text-2xl text-[#FF5A00]">500 &#x20AC;</p>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  + 10 entradas de fin de semana para OWN
                </p>
              </div>
            </div>

            {/* 3er puesto */}
            <div className="bg-[#150a24] border-3 border-[#cd7f32] rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
              <span className="text-4xl">&#x1F949;</span>
              <h3 className="font-display font-black text-xl text-white uppercase leading-snug">3er Puesto</h3>
              <div className="space-y-1.5">
                <p className="font-display font-black text-lg text-[#00f5d4]">Pack Juegos Ubisoft</p>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  + 5 entradas LAN
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── REQUISITOS ── */}
        <section className="w-full mb-12">
          <div className="bg-[#150a24] border-3 border-white rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
            <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white leading-snug border-b-2 border-white/10 pb-3">
              Requisitos
            </h2>
            <ul className="space-y-4 font-mono text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a00] font-bold text-lg leading-snug shrink-0">&#x00BB;</span>
                <span>Roster de <strong className="text-white">5 jugadores</strong> + 1 suplente (opcional).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a00] font-bold text-lg leading-snug shrink-0">&#x00BB;</span>
                <span>Inscripción del equipo en <strong className="text-white">Challengermode</strong> antes de la fecha del QL.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a00] font-bold text-lg leading-snug shrink-0">&#x00BB;</span>
                <span>Estar presente y conectado el día del clasificatorio para los emparejamientos.</span>
              </li>
            </ul>
            <div className="pt-3 border-t-2 border-white/10">
              <a
                href="https://discord.gg/pjHnV9fQw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white border-2 border-black rounded-lg font-mono font-bold text-xs hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                Dudas &#x2192; Discord de OWN
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA BUSCAR EQUIPO ── */}
        <section className="w-full mb-10">
          <div className="bg-[#ff5a00] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left">
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white leading-snug mb-2">
                &#x00BF;Necesitas equipo?
              </h3>
              <p className="text-white/90 text-sm font-sans max-w-sm">
                Usa Tebiinder para encontrar jugadores o un equipo que busque completar roster.
              </p>
            </div>
            <Link
              href="/buscar"
              className="shrink-0 px-6 py-3.5 bg-white text-black border-4 border-black font-display font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-3px] active:translate-y-[1px] transition-all rounded-xl"
            >
              Buscar Equipo
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
