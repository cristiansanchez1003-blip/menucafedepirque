import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata = {
  title: 'Café Raíz · Ecosistema Gastronómico',
  description:
    'Demo funcional de un ecosistema SaaS para cafeterías, restaurantes y bares con carta, QR, analítica, reservas, pedidos y crecimiento.',
  openGraph: {
    title: 'Café Raíz',
    description: 'Carta digital y sistema operativo gastronómico para locales modernos.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#24282A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen bg-paper font-lato text-ink">{children}</body>
    </html>
  )
}
