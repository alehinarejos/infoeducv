import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Eye, Server, UserCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Datos | InfoEdu CV',
  description: 'Conoce cómo protegemos tu privacidad, qué datos tratamos conforme al RGPD y la LOPDGDD, y cómo gestionamos las preferencias en InfoEdu CV.',
  alternates: {
    canonical: '/privacidad',
  },
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">Privacidad</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <Lock className="w-3.5 h-3.5" />
          <span>RGPD & LOPDGDD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Política de Privacidad
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          En InfoEdu CV nos tomamos muy en serio la privacidad de las familias y estudiantes. Explicamos de forma clara y transparente el tratamiento de la información técnica al utilizar nuestro buscador.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        
        {/* 1. Responsable */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-primary-600 dark:text-primary-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              1. Responsable del Tratamiento
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            El responsable del tratamiento de los datos técnicos asociados al portal InfoEdu CV es el equipo del proyecto InfoEdu CV.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Para cualquier cuestión, consulta o ejercicio de derechos en materia de protección de datos personales, puedes contactar por correo electrónico en: <a href="mailto:infoeducv.contacto@gmail.com" className="text-primary-600 dark:text-primary-400 underline font-medium">infoeducv.contacto@gmail.com</a>.
          </p>
        </section>

        {/* 2. Minimización de datos */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400">
            <Eye className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              2. Principio de Privacidad por Defecto y Minimización
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-3">
            <strong>InfoEdu CV no solicita registro de usuarios, ni cuentas, ni nombres, ni números de teléfono ni datos bancarios.</strong> El acceso a todos los colegios, institutos y ciclos de FP es totalmente público y anónimo.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Datos que se procesan localmente en tu dispositivo:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>Preferencia de tema:</strong> Modo oscuro o claro para mayor comodidad visual.</li>
              <li><strong>Preferencia de idioma:</strong> Español, Valenciano o Inglés.</li>
              <li><strong>Historial de consentimiento de cookies:</strong> Tu decisión sobre aceptar o rechazar cookies de terceros.</li>
            </ul>
          </div>
        </section>

        {/* 3. Geolocalización */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-sky-600 dark:text-sky-400">
            <MapPin className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              3. Uso de la Geolocalización en el Mapa
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            Cuando utilizas el botón <em>«Mi ubicación»</em> en el buscador o en el mapa interactivo de centros, tu navegador solicita permiso explícito de geolocalización.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Estas coordenadas (latitud y longitud) son procesadas <strong>única y exclusivamente en tu propio navegador</strong> para calcular la distancia y centrar el mapa en tu municipio. <strong>Nunca se transmiten a nuestros servidores ni se almacenan en ninguna base de datos.</strong>
          </p>
        </section>

        {/* 4. Terceros y Publicidad */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
            <Server className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              4. Servicios de Terceros y Redes Publicitarias
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-3">
            Para ofrecer el servicio de manera eficiente y financiar el mantenimiento técnico, utilizamos los siguientes proveedores de confianza:
          </p>
          <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
              <strong>Google Ireland Limited (Google AdSense):</strong> Muestra publicidad en la plataforma. AdSense puede recopilar datos de telemetría y colocar identificadores conforme al consentimiento otorgado en nuestro banner de cookies y la especificación Google Consent Mode v2. Puedes consultar la <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">política de privacidad de Google</a>.
            </li>
            <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
              <strong>Vercel Inc. (Alojamiento Web):</strong> Procesa solicitudes HTTP y registros estándar de conexión a nivel de servidor (dirección IP anonimizada, fecha/hora y agente de usuario) para fines estrictamente técnicos de seguridad y entrega de páginas mediante CDN.
            </li>
            <li className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
              <strong>OpenStreetMap & Leaflet:</strong> Los mosaicos cartográficos del mapa se cargan desde servidores abiertos de OpenStreetMap bajo directrices comunitarias.
            </li>
          </ul>
        </section>

        {/* 5. Derechos RGPD */}
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              5. Derechos de los Usuarios (ARCO+)
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-3">
            El Reglamento General de Protección de Datos (RGPD) confiere a los interesados los derechos de:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4">
            <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5"><strong>Acceso:</strong> Saber si se tratan tus datos.</li>
            <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5"><strong>Rectificación:</strong> Corregir datos inexactos.</li>
            <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5"><strong>Supresión:</strong> Solicitar su eliminación.</li>
            <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5"><strong>Oposición y Limitación:</strong> Oponerse al tratamiento o revocar consentimientos.</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Para ejercitar estos derechos, puedes escribir a <a href="mailto:infoeducv.contacto@gmail.com" className="text-primary-600 dark:text-primary-400 underline">infoeducv.contacto@gmail.com</a>. Asimismo, tienes derecho a presentar una reclamación ante la autoridad de control española (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">Agencia Española de Protección de Datos - AEPD</a>).
          </p>
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
          href="/cookies"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Ver Política de Cookies &rarr;
        </Link>
      </div>
    </div>
  );
}
