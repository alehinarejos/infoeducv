import Link from 'next/link';
import { Search, Home, GraduationCap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada | InfoEdu CV',
  description: 'El centro educativo o página que buscas no existe o ha sido trasladado.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-8 h-8" />
        </div>
        
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full border border-primary-200/50 dark:border-primary-800/50">
          Error 404
        </span>

        <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-4 mb-2 tracking-tight">
          Centro o página no encontrada
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          El centro educativo que estás buscando ha podido cambiar de código oficial, cambiar de nombre o la dirección no es válida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm transition-all shadow-md shadow-primary-700/20"
          >
            <Search className="w-4 h-4" />
            Buscar centros
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
