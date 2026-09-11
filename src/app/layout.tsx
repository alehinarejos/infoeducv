import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1d4ed8" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "InfoEdu CV | Buscador de Colegios, Institutos y FP de la Comunitat Valenciana",
    template: "%s | Guía de Centros InfoEdu CV"
  },
  description: "Buscador oficial de colegios públicos, concertados y privados en Valencia, Alicante y Castellón. Encuentra toda la oferta de FP, Institutos y centros educativos de la GVA con mapa interactivo.",
  keywords: [
    "info edu cv",
    "infoeducv",
    "info edu",
    "colegios valencia",
    "institutos alicante",
    "fp castellon",
    "formación profesional comunitat valenciana",
    "centros educativos gva",
    "educación infantil",
    "bachillerato valencia",
    "colegios comunidad valenciana",
    "institutos comunidad valenciana"
  ],
  authors: [{ name: "InfoEdu CV" }],
  metadataBase: new URL('https://info-edu-cv.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'es': '/',
      'ca-ES': '/?lang=va',
      'en': '/?lang=en',
      'x-default': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "InfoEdu CV | Encuentra el mejor centro educativo en la Comunitat Valenciana",
    description: "Guía oficial y mapa de todos los colegios, institutos y centros de FP de la GVA. Elige el mejor futuro para tus hijos.",
    siteName: "InfoEdu CV",
    locale: "es_ES",
    alternateLocale: ["ca_ES", "en_US"],
    type: "website",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'InfoEdu CV | Buscador de Centros Educativos de la Comunitat Valenciana',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InfoEdu CV | Guía de Centros Educativos de la Comunitat Valenciana",
    description: "Buscador de colegios e institutos de la GVA. Filtros por provincia, nivel y titularidad con localización exacta.",
    creator: "@infoeducv",
    images: ['/logo.png'],
  },
  icons: {
    icon: '/icon.ico',
    apple: '/logo.svg',
  },
  verification: {
    google: 'eYUDCfEfbBEt0co6I_miaE3oSNsAHNzLz3sDzmCvuWY',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              try {
                var consent = localStorage.getItem('infoedu_cookie_consent');
                var parsed = consent ? JSON.parse(consent) : null;
                var adConsent = parsed && parsed.advertising ? 'granted' : 'denied';
                gtag('consent', 'default', {
                  'ad_storage': adConsent,
                  'ad_user_data': adConsent,
                  'ad_personalization': adConsent,
                  'analytics_storage': adConsent
                });
              } catch(e) {
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied'
                });
              }
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2399050855679303"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 dark:from-[#060814] dark:via-[#060814] dark:to-[#060814] text-slate-900 dark:text-slate-100 flex flex-col min-h-screen transition-colors relative overflow-x-hidden`}>
        {/* Ambient background glow elements for Liquid Glass Effect with Teal & Logo Orange accents */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transform-gpu">
          <div className="absolute top-[-5%] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-cyan-200/30 dark:bg-purple-600/15 blur-[60px] md:blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[250px] md:w-[450px] h-[250px] md:h-[450px] rounded-full bg-amber-200/25 dark:bg-amber-600/10 blur-[60px] md:blur-[100px]" />
          <div className="hidden md:block absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-teal-200/20 dark:bg-emerald-600/5 blur-[100px]" />
          <div className="hidden md:block absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] rounded-full bg-amber-100/30 dark:bg-amber-700/10 blur-[100px]" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>
            <LanguageProvider>
              <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Header />
                <main className="flex-grow flex flex-col relative z-10">
                  {children}
                </main>
                <Footer />
                <CookieBanner />
              </div>
            </LanguageProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
