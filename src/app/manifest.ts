import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aplikasi Sewa Alat Camping',
    short_name: 'SEWA CAMPING',
    description: 'Aplikasi Khusus Untuk Sewa Alat Camping',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logo333.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}