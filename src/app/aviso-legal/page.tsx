import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Building2, Scale, ExternalLink, Database, AlertCircle, FileCode } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aviso Legal y Condiciones de Uso | InfoEdu CV',
  description: 'Información legal, titularidad, condiciones de uso y fuentes de datos del buscador independiente de centros educativos InfoEdu CV.',
  alternates: {
    canonical: '/aviso-legal',
  },
};

export default function AvisoLegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">Aviso Legal</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Información Legal & LSSI-CE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Aviso Legal y Condiciones de Uso
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        
        {/* 1. Datos Identificativos */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-primary-600 dark:text-primary-400">
            <Building2 className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              1. Datos Identificativos del Responsable
            </h2>
          </div>
          <p className="mb-3 text-slate-600 dark:text-slate-300">
            El portal web accesible en la dirección <strong>https://info-edu-cv.vercel.app</strong> (en adelante, <em>«InfoEdu CV»</em> o <em>«el Sitio Web»</em>) es una iniciativa independiente y de código abierto orientada a facilitar la consulta pública y geolocalización de centros educativos en la Comunitat Valenciana.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
            <li><strong>Denominación del proyecto:</strong> InfoEdu CV</li>
            <li><strong>Finalidad:</strong> Directorio educativo, visualizador cartográfico y buscador de oferta de FP.</li>
            <li><strong>Contacto general y notificaciones:</strong> <a href="mailto:infoeducv.contacto@gmail.com" className="text-primary-600 dark:text-primary-400 underline underline-offset-2">infoeducv.contacto@gmail.com</a></li>
            <li><strong>Repositorio del código fuente:</strong> <a href="https://github.com/J4ndro/infoEdu" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 hover:underline">GitHub J4ndro/infoEdu <ExternalLink className="w-3 h-3" /></a></li>
          </ul>
        </section>

        {/* 2. Naturaleza y Fuentes de Datos */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
            <Database className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              2. Origen de los Datos Públicos y Licencia
            </h2>
          </div>
          <p className="mb-3 text-slate-600 dark:text-slate-300">
            La información expuesta en este sitio web (códigos de centro, direcciones, tipología, oferta formativa de ciclos de Formación Profesional y enlaces institucionales) se recopila a partir de los conjuntos de datos abiertos proporcionados por la <strong>Generalitat Valenciana</strong> a través de su portal oficial <strong>Dades Obertes GVA</strong> (<a href="https://dadesobertes.gva.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">dadesobertes.gva.es</a>).
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Dichos datos se publican conforme a la <strong>Ley 37/2007, de 16 de noviembre, sobre reutilización de la información del sector público (RISP)</strong> y la licencia internacional <strong>Creative Commons Reconocimiento 4.0 (CC BY 4.0)</strong>, la cual autoriza expresamente su reutilización, agregación, transformación y explotación legítima con fines de divulgación y valor añadido.
          </p>
        </section>

        {/* 3. Descargo de Responsabilidad Oficial */}
        <section className="bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl p-6 sm:p-8 border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              3. Exención de Vinculación Oficial
            </h2>
          </div>
          <p className="mb-3 text-slate-700 dark:text-slate-300 font-medium">
            InfoEdu CV es un proyecto privado, cívico e independiente. No guarda vinculación administrativa, dependencia orgánica ni patrocinio alguno con la Generalitat Valenciana, la Conselleria d’Educació, Universitats i Ocupació, ni con ninguno de los centros docentes referenciados.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Aunque nos esforzamos por procesar y mantener actualizados los conjuntos de datos de forma rigurosa, la información ofrecida tiene carácter puramente divulgativo y no vinculante. Para trámites administrativos oficiales (admisión escolar, matriculaciones, plazas vacantes o certificados), los usuarios deben dirigirse a la secretaría del centro educativo correspondiente o a la sede electrónica oficial de la Generalitat Valenciana.
          </p>
        </section>

        {/* 4. Publicidad y Financiación */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
            <Scale className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              4. Financiación y Redes Publicitarias
            </h2>
          </div>
          <p className="mb-3 text-slate-600 dark:text-slate-300">
            Para garantizar el acceso 100% gratuito y libre a todos los usuarios, los costes derivados del alojamiento web, servidores de mapas, dominios y mantenimiento técnico pueden sufragarse mediante la inserción de espacios publicitariosgestionados por redes de terceros, principalmente <strong>Google AdSense</strong> (operado por Google Ireland Limited).
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            La presencia de anuncios no implica recomendación, respaldo ni acuerdo de ningún tipo con los productos o servicios anunciados. La gestión de cookies asociadas a la publicidad se rige estrictamente por el consentimiento expresado por el usuario a través de nuestro banner de cookies y la <Link href="/cookies" className="text-primary-600 dark:text-primary-400 underline font-semibold">Política de Cookies</Link>.
          </p>
        </section>

        {/* 5. Propiedad Intelectual */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400">
            <FileCode className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              5. Propiedad Intelectual y Licencia de Software
            </h2>
          </div>
          <p className="mb-3 text-slate-600 dark:text-slate-300">
            El código fuente de este desarrollo web se distribuye libremente bajo los términos de la <strong>Licencia MIT</strong>, permitiendo su estudio, reutilización y bifurcación con fines constructivos.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Los nombres comerciales, marcas registradas, logotipos y enlaces web de los centros escolares pertenecen a sus respectivos titulares e instituciones públicas. Su inclusión responde exclusivamente a fines informativos y de indexación en el directorio.
          </p>
        </section>

        {/* 6. Ley Aplicable */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
            6. Legislación Aplicable y Fuero
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Las presentes condiciones se rigen por la legislación española y comunitaria europea vigente. Para cualquier discrepancia o controversia legal que pudiera derivarse del uso de esta plataforma, las partes intentarán una resolución amistosa a través del correo de contacto antes de someterse a los juzgados y tribunales competentes.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Última actualización: Septiembre de 2026.
          </p>
        </section>

      </div>

      {/* Back to Home Button */}
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-sm transition-colors text-slate-800 dark:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al buscador de centros</span>
        </Link>

        <Link
          href="/privacidad"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Ver Política de Privacidad &rarr;
        </Link>
      </div>
    </div>
  );
}
