import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tebiinder — LFT/LFG Rainbow Six Siege",
  description:
    "La plataforma de reclutamiento táctico definitiva para Rainbow Six Siege. Conecta con agentes libres (LFT) y equipos competitivos (LFG) en tiempo real.",
  keywords: ["Rainbow Six Siege", "R6S", "LFT", "LFG", "Esports", "Competición", "Tebiinder", "Ubisoft"],
  authors: [{ name: "Tebimedia" }],
  openGraph: {
    title: "Tebiinder — LFT/LFG Rainbow Six Siege",
    description: "Encuentra tu equipo o recluta jugadores de primer nivel para Rainbow Six Siege.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-bg-primary text-text-primary">
        {/* Animated Scanning Line HUD Element */}
        <div className="hud-scanline" />
        
        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
