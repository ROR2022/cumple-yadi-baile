import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Su pista, su movimiento · Yadi',
  description: 'Una invitación especial para una noche de baile, música y celebración en Jiutepec.',
  openGraph: {
    title: 'Su pista, su movimiento · Yadi',
    description: 'Una tarde para celebrar. Domingo, 6 de diciembre de 2026 a las 3:00 PM en Mi Casa Tu Casa.',
    images: [{ url: '/images/yadi-dance-silhouette.png', width: 1536, height: 1024, alt: 'Silueta de una mujer bailando salsa bajo una luz cálida' }],
  },
  twitter: { card: 'summary_large_image', title: 'Su pista, su movimiento · Yadi', description: 'Una tarde para celebrar.' },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon-salsa.png',
        type: 'image/png',
      },
    ],
    apple: '/favicon-salsa.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#171311',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
