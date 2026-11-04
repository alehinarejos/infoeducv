'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": language === 'va' ? 'ca' : language,
    "mainEntity": t.faq.items.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-16 bg-transparent border-t border-slate-200/30 dark:border-white/5 transition-all">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/20 dark:border-primary-500/10 shadow-sm">
            <HelpCircle className="w-4 h-4" />
            {t.faq.badge}
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.faq.titlePre} <span className="text-primary-700 dark:text-primary-500">{t.faq.titleHighlight}</span>
          </h2>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((faq, index) => (
            <div 
              key={index}
              className="glass-card group rounded-2xl overflow-hidden cursor-pointer"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                aria-expanded={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-700 dark:text-primary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-700 dark:group-hover:text-primary-500" />
                )}
              </button>
              
              <div className={openIndex === index ? 'px-6 pb-5 animate-fade-in' : 'hidden'}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
