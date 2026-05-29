/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Database, UserRole } from "@/types/database";
import ProfileModal from "./ProfileModal";
import TebiinderLogo from "./TebiinderLogo";

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

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "ojeador":
        return "Ojeador";
      case "jugador":
        return "Jugador";
      case "capitan":
        return "Capitán";
      default:
        return "Invitado";
    }
  };

  return (
    <>
      <header className="w-full border-b-4 border-white bg-[#150a24] sticky top-0 z-40 shadow-[0_4px_0_0_rgba(0,0,0,0.25)]">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">

          {/* Logo + Nav Links */}
          <div className="flex items-center gap-6 sm:gap-10">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl group-hover:scale-105 transition-transform">
                <TebiinderLogo size={48} className="sm:w-[56px] sm:h-[56px]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-black text-2xl sm:text-3xl tracking-wide uppercase text-white leading-none">
                  Tebiinder
                </span>
                <span className="font-mono text-[9px] text-[#00f5d4] uppercase tracking-widest font-black mt-1">
                  Encuentra equipo R6
                </span>
              </div>
            </Link>

            {/* Nav Links — Buscar first, Torneo second */}
            <nav className="flex items-center gap-2 sm:gap-2.5">
              <Link
                href="/"
                className={`hidden md:block px-4 py-2.5 rounded-xl text-sm font-display font-black uppercase tracking-wider transition-all ${
                  pathname === "/"
                    ? "bg-[#ff5a00] text-white border-3 border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/10 border-3 border-transparent"
                }`}
              >
                Inicio
              </Link>

              <Link
                href="/buscar"
                className={`px-4 py-2.5 rounded-xl text-sm font-display font-black uppercase tracking-wider transition-all ${
                  pathname === "/buscar"
                    ? "bg-[#ff5a00] text-white border-3 border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/10 border-3 border-transparent"
                }`}
              >
                Buscar
              </Link>

              <Link
                href="/torneo"
                className={`px-4 py-2.5 rounded-xl text-sm font-display font-black uppercase tracking-wider transition-all shrink-0 ${
                  pathname === "/torneo"
                    ? "bg-[#00f5d4] text-black border-3 border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/10 border-3 border-transparent"
                }`}
              >
                Torneo
              </Link>
            </nav>
          </div>

          {/* User Auth Area */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Compact User profile */}
                <div className="hidden sm:flex items-center gap-2.5 bg-[#0a0414] border-3 border-white p-1.5 pr-3.5 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || "Gamer"}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-lg object-cover border border-white"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-zinc-800 rounded-lg border border-white flex items-center justify-center font-display font-bold text-xs text-white uppercase">
                      {user.user_metadata?.full_name?.substring(0, 1) || "U"}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-[10px] truncate max-w-[80px] leading-tight">
                      {user.user_metadata?.full_name || "Agente"}
                    </span>
                    <span className="text-[8px] font-bold text-[#ff5a00] uppercase tracking-wider">
                      {getRoleLabel(userRole)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-5 py-3 bg-[#ff5a00] text-white border-3 border-black rounded-xl text-sm font-display font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[1px] transition-all"
                >
                  Ficha
                </button>
                <a
                  href="/auth/logout"
                  className="px-3.5 py-2.5 border-3 border-white/20 text-zinc-400 hover:text-white hover:border-white rounded-xl text-[10px] font-bold uppercase transition-all flex items-center bg-[#0a0414]"
                >
                  Salir
                </a>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="px-5 py-3 bg-[#ff5a00] text-white border-3 border-black font-display font-black text-sm uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-3px] hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] active:translate-y-[1px] transition-all flex items-center gap-2 rounded-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.077.077 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                Discord Login
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
