'use client'

import { motion } from 'framer-motion'
import { formatCLP } from '@/lib/format'
import { localizedField } from '@/lib/i18n'
import { useApp } from '@/contexts/AppContext'
import ProductImage from './ProductImage'

const BADGE_LABELS = {
  nuevo: 'Nuevo',
  popular: 'Popular',
  recomendado: 'Recomendado',
}

export default function ProductCard({ product, emoji, onSelect, compact = false }) {
  const { lang } = useApp()
  const name = localizedField(product, 'name', lang)
  const description = localizedField(product, 'description', lang)
  const badges = (product.badges || []).filter((badge) => BADGE_LABELS[badge])

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(product)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileTap={{ scale: 0.975 }}
      className={`group flex w-full overflow-hidden rounded-[18px] border border-linen/80 bg-card text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover dark:border-linendark/80 dark:bg-carddark ${
        compact ? 'min-w-[245px] flex-col sm:min-w-[280px]' : 'items-stretch'
      }`}
    >
      <ProductImage
        src={product.image}
        alt={name}
        emoji={emoji}
        className={compact ? 'h-36 w-full' : 'h-auto min-h-[132px] w-[118px] shrink-0 sm:w-[150px]'}
      />

      <div className="flex min-w-0 flex-1 flex-col p-4">
        {badges.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-mintsoft px-2.5 py-1 text-[10.5px] font-black uppercase tracking-[0.12em] text-forest dark:bg-forest/25 dark:text-mint"
              >
                {BADGE_LABELS[badge]}
              </span>
            ))}
          </div>
        )}

        <h4 className="font-lato text-[15.5px] font-black leading-snug text-ink dark:text-paper sm:text-[16px]">
          {name}
        </h4>
        {description && (
          <p className="mt-1.5 line-clamp-2 text-[12.8px] leading-relaxed text-muted dark:text-muteddark">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <span className="font-playfair text-[18px] font-bold text-forest dark:text-mint">
            {formatCLP(product.price)}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-mint transition group-hover:bg-forest dark:bg-mint dark:text-ink">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  )
}
