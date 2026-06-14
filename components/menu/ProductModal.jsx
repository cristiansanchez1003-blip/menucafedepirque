'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCLP } from '@/lib/format'

export default function ProductModal({ product, onClose }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90vw] max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-cardHover"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <div className="relative aspect-video w-full overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-border text-5xl">
                  🍽️
                </div>
              )}
              {!product.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-600/50">
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white">
                    No disponible
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h2 className="font-playfair text-xl font-bold text-ink">
                {product.name}
              </h2>
              {product.description && (
                <p className="mt-2 font-lato text-sm leading-relaxed text-muted">
                  {product.description}
                </p>
              )}
              <p className="mt-4 font-lato text-2xl font-bold text-amber">
                {formatCLP(product.price)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
