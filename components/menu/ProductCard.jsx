'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatCLP } from '@/lib/format'

export default function ProductCard({ product, onClick }) {
  const unavailable = !product.available

  return (
    <motion.button
      type="button"
      onClick={() => onClick(product)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card transition-shadow duration-300 hover:shadow-cardHover"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-border text-3xl">
            🍽️
          </div>
        )}

        {unavailable && (
          <>
            <div className="absolute inset-0 bg-gray-500/50" />
            <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              No disponible
            </span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-playfair text-base font-semibold text-ink">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 font-lato text-xs text-muted">
            {product.description}
          </p>
        )}
        <p className="mt-2 font-lato text-base font-bold text-amber">
          {formatCLP(product.price)}
        </p>
      </div>
    </motion.button>
  )
}
