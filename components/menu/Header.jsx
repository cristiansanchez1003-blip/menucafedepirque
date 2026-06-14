'use client'

import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="relative h-[220px] md:h-[280px] w-full overflow-hidden">
      {/* Imagen de fondo cálida de cafetería */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      {/* Overlay oscuro sutil para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/55" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <span className="mb-2 text-3xl">☕</span>
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-cream drop-shadow-md">
          El Café de Pirque
        </h1>
        <p className="mt-2 font-lato text-sm md:text-base text-cream/90 drop-shadow">
          Av. Ramón Subercaseaux 560, Pirque
        </p>
      </motion.div>
    </header>
  )
}
