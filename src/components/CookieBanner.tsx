'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Sliders, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface CookieConsentData {
  timestamp: number;
  technical: boolean;
  advertising: boolean;
}

export const COOKIE_STORAGE_KEY = 'infoedu_cookie_consent';

export function openCookiePreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open_cookie_settings'));
  }
}

export default function CookieBanner() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [advertisingAllowed, setAdvertisingAllowed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const applyConsent = (adConsent: boolean) => {
    const data: CookieConsentData = {
      timestamp: Date.now(),
      technical: true,
      advertising: adConsent,
    };

    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore localStorage errors (e.g. strict private mode)
    }

    // Update Google Consent Mode v2 dynamically
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
      const consentState = adConsent ? 'granted' : 'denied';
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
        ad_storage: consentState,
        ad_user_data: consentState,
        ad_personalization: consentState,
        analytics_storage: consentState,
      });
    }

    window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: data }));
    setIsOpen(false);
    setIsCustomizing(false);
  };

  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!saved) {
        // Delay opening slightly for smooth entrance
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      } else {
        const parsed: CookieConsentData = JSON.parse(saved);
        setAdvertisingAllowed(parsed.advertising ?? false);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      try {
        const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
        if (saved) {
          const parsed: CookieConsentData = JSON.parse(saved);
          setAdvertisingAllowed(parsed.advertising ?? false);
        }
      } catch {
        // Ignore
      }
      setIsCustomizing(true);
      setIsOpen(true);
    };

    window.addEventListener('open_cookie_settings', handleOpen);
    return () => window.removeEventListener('open_cookie_settings', handleOpen);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-lg w-auto transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl shadow-indigo-950/20 dark:shadow-black/60 p-5 sm:p-6 text-slate-800 dark:text-slate-200">
        
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                {t.cookiesBanner.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                InfoEdu CV &bull; Privacidad y RGPD
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label={t.cookiesBanner.close}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {t.cookiesBanner.description}{' '}
          <Link
            href="/cookies"
            className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
          >
            {t.footer.cookiePolicy}
          </Link>
          {' '}&bull;{' '}
          <Link
            href="/privacidad"
            className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
          >
            {t.footer.privacyPolicy}
          </Link>.
        </p>

        {/* Detailed Options when customizing */}
        {isCustomizing && (
          <div className="mb-4 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            {/* Technical Cookies */}
            <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{t.cookiesBanner.technicalTitle}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {t.cookiesBanner.technicalDesc}
                </p>
              </div>
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                Siempre Activas
              </span>
            </div>

            {/* Advertising Cookies */}
            <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                  <Cookie className="w-4 h-4 text-amber-500" />
                  <span>{t.cookiesBanner.advertisingTitle}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {t.cookiesBanner.advertisingDesc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={advertisingAllowed}
                  onChange={(e) => setAdvertisingAllowed(e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          {!isCustomizing ? (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizing(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{t.cookiesBanner.customize}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => applyConsent(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                {t.cookiesBanner.rejectNonEssential}
              </button>

              <button
                type="button"
                onClick={() => applyConsent(true)}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-xl shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 transition-all active:scale-[0.98]"
              >
                {t.cookiesBanner.acceptAll}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={() => applyConsent(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                {t.cookiesBanner.rejectNonEssential}
              </button>

              <button
                type="button"
                onClick={() => applyConsent(advertisingAllowed)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 transition-all active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.cookiesBanner.savePreferences}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
