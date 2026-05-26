import Link from "next/link";
import { fetchPageData } from "@/lib/fetchPageData";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { user, userRole, existingPlayer, existingTeam, jugadores, equipos } =
    await fetchPageData();

  return (
    <>
      <Navbar
        user={user}
        userRole={userRole}
        existingPlayer={existingPlayer}
        existingTeam={existingTeam}
      />

      <main className="flex-1 flex flex-col items-center px-4 relative">
        {/* ── HERO SECTION ── */}
        <section className="w-full max-w-4xl text-center pt-10 pb-12 sm:pt-16 sm:pb-16 space-y-5">
          {/* R6 Badge */}
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center gap-3 bg-[#150a24] border-4 border-white rounded-3xl px-5 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-[1deg] transition-transform duration-200">
              <span className="font-display font-bold text-3xl sm:text-4xl text-[#00F5D4]">6</span>
              <span className="w-2 h-5 bg-white rounded-full rotate-[15deg]"></span>
              <span className="font-display font-bold text-3xl sm:text-4xl text-[#FF5A00]">LFT/LFG</span>
            </div>
          </div>

          {/* Giant Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight uppercase leading-[0.85] text-white">
            TEBIINDER
          </h1>

          <p className="text-zinc-200 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
            La central de reclutamiento definitiva para escuadras competitivas y free agents de Rainbow Six Siege en
            Espa&ntilde;a.
          </p>

          {/* Stats Counters */}
          <div className="flex flex-wrap justify-center gap-3 font-mono text-xs font-bold">
            <span className="px-3.5 py-1.5 bg-[#150a24] border-2 border-white rounded-full text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00] border border-black" />
              {jugadores.length} Agentes LFT
            </span>
            <span className="px-3.5 py-1.5 bg-[#150a24] border-2 border-white rounded-full text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F5D4] border border-black" />
              {equipos.length} Escuadras LFG
            </span>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/buscar"
              className="px-6 sm:px-8 py-4 bg-[#FF5A00] text-white border-4 border-black font-display font-bold text-lg sm:text-2xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 flex items-center gap-2 sm:gap-3 rounded-xl"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Equipo / Jugador
            </Link>

            {!user && (
              <a
                href="/auth/login"
                className="px-6 py-4 bg-[#5865F2] text-white border-4 border-black font-display font-bold text-lg sm:text-2xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 flex items-center gap-2 sm:gap-3 rounded-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
                Entrar con Discord
              </a>
            )}
          </div>

          {/* Mobile login tip — only visible on small screens */}
          {!user && (
            <p className="block md:hidden text-xs text-purple-300 mt-3 text-center max-w-xs mx-auto">
              💡 Tip: Si la web te pide contraseña en el móvil, ábrela en tu PC para entrar al instante escaneando el código QR.
            </p>
          )}
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="w-full max-w-4xl mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wide text-white text-center mb-8 leading-none">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                emoji: "1",
                title: "Entra con Discord",
                desc: "Login en un clic. Sin registros, sin emails. Tu perfil de Discord es tu identidad.",
                color: "bg-[#5865F2]",
              },
              {
                emoji: "2",
                title: "Crea tu Ficha",
                desc: "Elige si buscas equipo (LFT) o jugador (LFG). Tu rango y K/D se sincronizan con R6 Tracker.",
                color: "bg-[#FF5A00]",
              },
              {
                emoji: "3",
                title: "Conecta en Discord",
                desc: "Encuentra tu match y contacta directamente por Discord. Sin intermediarios.",
                color: "bg-[#00F5D4]",
              },
            ].map((step) => (
              <div
                key={step.emoji}
                className="bg-bg-card border-4 border-white rounded-2xl p-5 neo-shadow flex flex-col items-center text-center gap-3"
              >
                <div
                  className={`w-12 h-12 ${step.color} border-3 border-black rounded-xl font-display font-bold text-2xl text-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                >
                  {step.emoji}
                </div>
                <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white leading-none">
                  {step.title}
                </h3>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOURNAMENTS / STREAM INFO ── */}
        <section className="w-full max-w-4xl mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wide text-white text-center mb-8 leading-none">
            Torneos y Directos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Next Stream Card */}
            <div className="bg-bg-card border-4 border-white rounded-2xl overflow-hidden neo-shadow">
              <div className="h-2 w-full bg-[#FF5A00]" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 border border-black animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                    Proximo Directo
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-white leading-none">
                  Torneo Tebiinder S1
                </h3>
                <p className="text-xs font-mono text-zinc-300">
                  Fecha por confirmar. Sigue nuestras redes para enterarte del dia y hora del proximo directo.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="px-3 py-1 bg-black/60 border-2 border-white/20 rounded-lg text-[10px] font-mono font-bold text-[#00F5D4] uppercase">
                    Proximamente
                  </span>
                </div>
              </div>
            </div>

            {/* Tournament Info Card */}
            <div className="bg-bg-card border-4 border-white rounded-2xl overflow-hidden neo-shadow">
              <div className="h-2 w-full bg-[#00F5D4]" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#00F5D4] uppercase tracking-wider">
                    Competicion
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-white leading-none">
                  Liga Tebiinder
                </h3>
                <p className="text-xs font-mono text-zinc-300">
                  Inscripciones abiertas para equipos de 5. Crea tu equipo en la plataforma y apuntate al torneo.
                </p>
                <Link
                  href="/buscar"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00F5D4] text-black border-3 border-black rounded-xl text-xs font-display font-bold uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 mt-1"
                >
                  Buscar Jugadores
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        {!user && (
          <section className="w-full max-w-4xl mb-16">
            <div className="bg-[#FF5A00] border-4 border-black rounded-2xl neo-shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-3xl sm:text-4xl uppercase tracking-wide text-white leading-none mb-2">
                  Empieza Ya
                </h3>
                <p className="text-sm text-white/80 max-w-md font-sans">
                  Entra con Discord y publica tu ficha de jugador o equipo en menos de 30 segundos. Es gratis.
                </p>
              </div>
              <a
                href="/auth/login"
                className="shrink-0 px-6 py-3 bg-white text-black border-4 border-black font-display font-bold text-xl uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 rounded-xl"
              >
                Discord Login
              </a>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="w-full max-w-4xl border-t-4 border-white/10 py-6 mb-4 text-center">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Tebiinder &mdash; Tebimedia &copy; 2025 &middot; Rainbow Six Siege es marca registrada de Ubisoft
          </p>
        </footer>
      </main>
    </>
  );
}
