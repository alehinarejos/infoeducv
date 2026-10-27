'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Language, Translations, translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Sync HTML lang attribute
function updateHtmlLang(lang: Language) {
  if (typeof document !== 'undefined') {
    const htmlLangMap: Record<Language, string> = {
      es: 'es',
      va: 'ca-ES',
      en: 'en',
    };
    document.documentElement.lang = htmlLangMap[lang] || 'es';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const searchParams = useSearchParams();

  // Set language handler
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    updateHtmlLang(newLang);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('infoedu_lang', newLang);
        document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000;SameSite=Lax`;
      } catch (e) {
        console.error('Failed to persist language preference', e);
      }

      const currentParams = new URLSearchParams(window.location.search);
      if (newLang === 'es') {
        currentParams.delete('lang');
      } else {
        currentParams.set('lang', newLang);
      }
      const qs = currentParams.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  // Initialization: only change language if explicitly requested via ?lang= or saved in localStorage.
  // Never auto-switch to 'en' via navigator.language because Googlebot crawls with navigator.language = 'en-US'!
  useEffect(() => {
    const urlLang = searchParams.get('lang') as Language;
    if (urlLang && (urlLang === 'es' || urlLang === 'va' || urlLang === 'en')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(urlLang);
      updateHtmlLang(urlLang);
      return;
    }

    try {
      const savedLang = localStorage.getItem('infoedu_lang') as Language;
      if (savedLang && (savedLang === 'es' || savedLang === 'va' || savedLang === 'en')) {
        setLanguageState(savedLang);
        updateHtmlLang(savedLang);
        return;
      }
    } catch {
      // localStorage may fail in private mode
    }

    updateHtmlLang('es');
  }, [searchParams]);

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.es,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: translations.es,
    };
  }
  return context;
}
