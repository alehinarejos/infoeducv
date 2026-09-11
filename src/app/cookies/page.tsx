'use client';

import Link from 'next/link';
import { Cookie, ArrowLeft, Sliders, ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { openCookiePreferences } from '@/components/CookieBanner';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">Política de Cookies</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
          <Cookie className="w-3.5 h-3.5" />
          <span>Gestión de Cookies & LSSI 22.2</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Política de Cookies
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Transparencia absoluta sobre el uso de tecnologías de almacenamiento local, cookies técnicas y cookies publicitarias en InfoEdu CV.
        </p>
      </div>

      {/* Call to action to reconfigure cookies */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary-600/10 via-indigo-600/10 to-amber-600/10 border border-primary-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            ¿Deseas cambiar tu configuración actual?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Puedes modificar o revocar tu consentimiento sobre las cookies publicitarias en cualquier momento.
          </p>
        </div>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary-600/20 transition-all shrink-0 active:scale-[0.98]"
        >
          <Sliders className="w-4 h-4" />
          <span>Configurar Cookies</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        
        {/* 1. Qué es una cookie */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-primary-600 dark:text-primary-400">
            <Info className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              1. ¿Qué son las cookies y para qué se utilizan?
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-3">
            Una cookie es un pequeño archivo de texto que un sitio web descarga en tu navegador o dispositivo al visitarlo. Las cookies permiten a las páginas web almacenar y recuperar información sobre tus hábitos de navegación, recordar tus preferencias técnicas (como el idioma o el modo oscuro) y, en su caso, mostrarte contenido publicitario adaptado.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            En InfoEdu CV limitamos el uso de cookies al mínimo imprescindible para ofrecer una experiencia rápida, accesible y financiar el mantenimiento de la plataforma.
          </p>
        </section>

        {/* 2. Tipos de cookies utilizadas */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              2. Categorías de Cookies en InfoEdu CV
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                A. Cookies Técnicas y Funcionales (Estrictamente Necesarias)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
                Son aquellas necesarias para la navegación y el funcionamiento de la web. Permiten recordar la selección de tema visual (claro u oscuro), el idioma de la interfaz (valenciano, castellano o inglés) y registrar tu estado de consentimiento de cookies.
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                Siempre activas &bull; Exentas de consentimiento según Art. 22.2 LSSI
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                B. Cookies Publicitarias y de Medición (Google AdSense)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
                Son gestionadas por Google Ireland Limited para desplegar anuncios en la web. Permiten limitar la frecuencia con que ves un anuncio, evitar fraudes y, si das tu consentimiento, ofrecerte publicidad contextualizada o personalizada.
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                Requieren tu consentimiento expreso &bull; Configurables
              </span>
            </div>
          </div>
        </section>

        {/* 3. Tabla de cookies */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
            3. Detalle de Almacenamiento y Cookies Utilizadas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Identificador</th>
                  <th className="pb-3 font-semibold">Proveedor</th>
                  <th className="pb-3 font-semibold">Finalidad</th>
                  <th className="pb-3 font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 font-mono text-xs">infoedu_cookie_consent</td>
                  <td className="py-3">Propia (InfoEdu CV)</td>
                  <td className="py-3">Almacena la preferencia de consentimiento de cookies del usuario.</td>
                  <td className="py-3">1 año</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">infoedu_lang / NEXT_LOCALE</td>
                  <td className="py-3">Propia (InfoEdu CV)</td>
                  <td className="py-3">Guarda el idioma preferido seleccionado (Castellano, Valenciano, Inglés).</td>
                  <td className="py-3">1 año</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">theme</td>
                  <td className="py-3">Propia (next-themes)</td>
                  <td className="py-3">Recuerda si se prefiere tema oscuro, claro o del sistema.</td>
                  <td className="py-3">Persistente</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">__gads, __gpi, IDE</td>
                  <td className="py-3">Google AdSense (Tercero)</td>
                  <td className="py-3">Medición de impresiones publicitarias, prevención de fraude de clics y anuncios personalizados (si se aceptan).</td>
                  <td className="py-3">13 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Cómo desactivar en navegadores */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
            4. Cómo gestionar o bloquear cookies desde tu navegador
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4 text-xs sm:text-sm">
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador web:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-semibold text-center flex flex-col items-center gap-1.5 transition-colors"
            >
              <span>Google Chrome</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-semibold text-center flex flex-col items-center gap-1.5 transition-colors"
            >
              <span>Mozilla Firefox</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-semibold text-center flex flex-col items-center gap-1.5 transition-colors"
            >
              <span>Apple Safari</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-semibold text-center flex flex-col items-center gap-1.5 transition-colors"
            >
              <span>Microsoft Edge</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </section>

      </div>

      {/* Bottom navigation */}
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-sm transition-colors text-slate-800 dark:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al buscador</span>
        </Link>

        <Link
          href="/aviso-legal"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Ver Aviso Legal &rarr;
        </Link>
      </div>
    </div>
  );
}
