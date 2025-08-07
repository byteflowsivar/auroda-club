import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/auth/SessionProvider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    template: "%s | SGD",
    default: "SGD - Sistema de Gestión Deportiva",
  },
  description: "Sistema completo para la gestión de atletas, tutores y actividades deportivas. Administra tu club deportivo de manera eficiente y profesional.",
  keywords: [
    "sistema deportivo",
    "gestión atletas", 
    "club deportivo",
    "administración deportiva",
    "tutores",
    "SGD"
  ],
  authors: [{ name: "SGD Team" }],
  creator: "SGD",
  publisher: "SGD",
  robots: {
    index: false, // No indexar en desarrollo
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://sgd.local",
    title: "SGD - Sistema de Gestión Deportiva",
    description: "Plataforma completa para la gestión de atletas y actividades deportivas",
    siteName: "SGD",
  },
  twitter: {
    card: "summary_large_image",
    title: "SGD - Sistema de Gestión Deportiva",
    description: "Plataforma completa para la gestión de atletas y actividades deportivas",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
