'use client'

export default function Footer() {
  return (
    <footer className="mt-8 bg-coffee px-6 py-10 text-cream">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-2xl">☕</span>
        <h2 className="mt-2 font-playfair text-2xl font-bold">El Café de Pirque</h2>

        <div className="mt-4 space-y-1 font-lato text-sm text-cream/90">
          <p>Av. Ramón Subercaseaux 560, Pirque</p>
          <p>
            <a
              href="https://instagram.com/elcafedepirque"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 transition hover:underline"
            >
              @elcafedepirque
            </a>
          </p>
          <p>Lunes a Domingo · 09:00 – 20:00 hrs</p>
        </div>

        <div className="mt-6 border-t border-cream/20 pt-4 font-lato text-xs text-cream/70">
          Menú digital por Espíritu Digital
        </div>
      </div>
    </footer>
  )
}
