import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Tebiinder — LFT/LFG Rainbow Six Siege",
  description:
    "La plataforma de reclutamiento definitiva para Rainbow Six Siege. Conecta con agentes libres (LFT) y escuadras competitivas (LFG) en tiempo real al estilo Neo-Brutalista.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-bg-primary text-text-primary">
        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
