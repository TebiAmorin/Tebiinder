import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase not configured yet — render as guest
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      {/* Header / Logo placeholder */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          {/* PLACEHOLDER: Logo SVG */}
          <div className="w-12 h-12 bg-accent-orange rounded-lg border-2 border-accent-white flex items-center justify-center font-bold text-lg">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Tebiinder</h1>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {user.user_metadata?.full_name ?? "Agente"}
              </span>
              <a
                href="/auth/logout"
                className="px-4 py-2 text-sm font-bold bg-bg-card border-2 border-border-card rounded-lg hover:opacity-80 transition-opacity"
              >
                Salir
              </a>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="px-6 py-2.5 font-bold bg-accent-orange text-white rounded-lg border-2 border-accent-white hover:opacity-90 transition-opacity"
            >
              Login con Discord
            </a>
          )}
        </div>
      </header>

      {/* Título principal */}
      <section className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Encuentra tu equipo.
          <br />
          Encuentra tu jugador.
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          La plataforma LFT/LFG para Rainbow Six Siege. Conecta con equipos y
          free agents para competiciones.
        </p>
      </section>

      {/* Tablones placeholder */}
      <section className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
        {/* Tablón LFT - Free Agents */}
        <div className="bg-bg-card border-[3px] border-border-card rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-accent-orange rounded-full border-2 border-white flex items-center justify-center text-sm">
              J
            </span>
            Free Agents (LFT)
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Jugadores buscando equipo para competir.
          </p>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-white/10 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-20 bg-white/5 rounded mt-2" />
                </div>
                <div className="h-3 w-16 bg-accent-orange/20 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Tablón LFG - Equipos */}
        <div className="bg-bg-card border-[3px] border-border-card rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-accent-orange rounded-full border-2 border-white flex items-center justify-center text-sm">
              E
            </span>
            Equipos (LFG)
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Equipos buscando jugadores para completar su roster.
          </p>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 w-36 bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-white/5 rounded mt-2" />
                </div>
                <div className="h-3 w-16 bg-accent-orange/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
