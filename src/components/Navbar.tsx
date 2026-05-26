/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Database, UserRole } from "@/types/database";
import ProfileModal from "./ProfileModal";

type Jugador = Database["public"]["Tables"]["jugadores"]["Row"];
type Equipo = Database["public"]["Tables"]["equipos"]["Row"];

interface NavbarProps {
  user: any | null;
  userRole?: UserRole;
  existingPlayer?: Jugador | null;
  existingTeam?: Equipo | null;
}

export default function Navbar({
  user,
  userRole = "invitado",
  existingPlayer = null,
  existingTeam = null,
}: NavbarProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const pathname = usePathname();

  const handleSaveSuccess = () => {
    setShowProfileModal(false);
    if (pathname === "/buscar") {
      window.location.reload();
    } else {
      window.location.href = "/buscar";
    }
  };

  return (
    <>
      <header className="w-full border-b-4 border-white/20 bg-[#150a24]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo + Nav Links */}
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#FF5A00] to-orange-600 border-3 border-white font-display font-bold text-2xl sm:text-3xl text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform flex items-center justify-center select-none">
                T
              </div>
              <span className="hidden sm:block font-display font-bold text-2xl tracking-wide uppercase text-white leading-none">
                Tebiinder
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1 ml-1 sm:ml-2">
              {/* Inicio hidden on mobile — T logo already links to / */}
              <Link
                href="/"
                className={`hidden sm:block px-3 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  pathname === "/"
                    ? "bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-zinc-400 hover:text-white border-2 border-transparent"
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/buscar"
                className={`px-3 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  pathname === "/buscar"
                    ? "bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-zinc-400 hover:text-white border-2 border-transparent"
                }`}
              >
                Buscar
              </Link>
              {userRole === "ojeador" && (
                <Link
                  href="/admin"
                  className={`px-2 sm:px-3 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    pathname === "/admin"
                      ? "bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "text-red-400 hover:text-red-300 border-2 border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">Admin</span>
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* User Auth Area */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User badge compact */}
                <div className="hidden sm:flex items-center gap-2 bg-[#150a24] border-2 border-white/30 p-1.5 pr-3 rounded-xl">
                  {user.user_metadata?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || "Gamer"}
                      className="w-7 h-7 rounded-lg object-cover border border-white/50"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-zinc-800 rounded-lg border border-white/50 flex items-center justify-center font-display font-bold text-sm text-white uppercase">
                      {user.user_metadata?.full_name?.substring(0, 1) || "U"}
                    </div>
                  )}
                  <span className="font-bold text-white text-xs truncate max-w-[80px]">
                    {user.user_metadata?.full_name || "Agente"}
                  </span>
                </div>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-3 py-2 bg-[#FF5A00] text-white border-3 border-black rounded-xl text-xs font-display font-bold uppercase tracking-wide neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100"
                >
                  Ficha
                </button>
                <a
                  href="/auth/logout"
                  className="px-3 py-2.5 border-2 border-white/30 text-zinc-400 hover:text-white hover:border-white rounded-xl text-[10px] font-bold uppercase transition-colors min-h-[44px] flex items-center"
                >
                  Salir
                </a>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="px-4 py-2 bg-[#FF5A00] text-white border-3 border-black font-display font-bold text-sm uppercase tracking-wider neo-shadow hover:scale-105 active:scale-95 transition-transform duration-100 flex items-center gap-2 rounded-xl"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <ProfileModal
          user={user}
          existingUserRole={userRole}
          existingPlayer={existingPlayer}
          existingTeam={existingTeam}
          onClose={() => setShowProfileModal(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </>
  );
}
