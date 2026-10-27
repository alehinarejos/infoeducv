import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InfoEdu CV - Guía de Centros Educativos Comunitat Valenciana',
    short_name: 'InfoEdu CV',
    description: 'Buscador de centros educativos y FP de la Comunitat Valenciana',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#114b5f',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon.ico',
        sizes: '256x256',
        type: 'image/x-icon',
      },
    ],
  };
}
