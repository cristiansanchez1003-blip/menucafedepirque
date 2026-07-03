'use client'

import { motion } from 'framer-motion'
import { formatCLP } from '@/lib/format'
import ProductImage from './ProductImage'

export default function ProductCard({ product, emoji, onSelect }) {
  const unavailable = product.available === false

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(product)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileTap={{ scale: 0.975 }}
      className={`flex w-full items-center gap-3.5 rounded-2xl border border-linen/80 bg-card p-3 text-left shadow-card transition-shadow ${
        unavailable ? 'opacity-60 saturate-50' : ''
      }`}
    >
      <div className="min-w-0 flex-1 py-0.5">
        <h4 className="font-lato text-[15px] font-bold leading-snug text-ink">
          {product.name}
        </h4>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
            {product.description}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-playfair text-[15.5px] font-bold text-forest">
            {formatCLP(product.price)}
          </span>
          {unavailable && (
            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-ink/60">
              No disponible
            </span>
          )}
        </div>
      </div>

      <ProductImage
        src={product.image}
        alt={product.name}
        emoji={emoji}
        className="h-[76px] w-[76px] shrink-0 rounded-xl"
      />
    </motion.button>
  )
}
