import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#150a24",
};

const siteUrl = "https://tebiinder.tebimedia.com";

export const metadata: Metadata = {
  title: "Tebiinder — Encuentra Equipo para OWN Masters R6 Siege",
  description:
    "Arma tu roster de 5 jugadores y clasifícate para la OWN Valencia. +1.500€ en premios, viaje a Valencia. Torneo organizado por Ubisoft x OWN. Inscríbete ya en los clasificatorios.",
  keywords: [
    "Rainbow Six Siege", "R6S", "LFT", "LFG", "Esports", "OWN Masters",
    "OWN Valencia", "Tebiinder", "Ubisoft", "Clasificatorio", "Torneo R6",
    "Buscar equipo R6", "Competición España",
  ],
  authors: [{ name: "Tebimedia" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Tebiinder — Encuentra Equipo para OWN Masters R6 Siege",
    description: "Arma tu roster y clasifícate para la OWN Valencia. +1.500€ en premios. Clasificatorios: 5 y 13 de Junio.",
    type: "website",
    url: siteUrl,
    siteName: "Tebiinder",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 675,
        alt: "OWN Masters Rainbow Six Siege 2026 — Tebiinder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tebiinder — Encuentra Equipo para OWN Masters R6 Siege",
    description: "Arma tu roster y clasifícate para la OWN Valencia. +1.500€ en premios. QL1: 5 Jun / QL2: 13 Jun.",
    images: ["/og-image.png"],
    creator: "@TebiiR6",
  },
  icons: {
    icon: "/icon.svg",
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
