'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCLP } from '@/lib/format'
import { localizedField } from '@/lib/i18n'
import { useApp } from '@/contexts/AppContext'
import ProductImage from './ProductImage'

const BADGE_LABELS = {
  nuevo: 'Nuevo',
  popular: 'Popular',
  recomendado: 'Recomendado',
}

export default function ProductModal({ product, emoji, onClose }) {
  const { lang, t } = useApp()

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [product])

  const name = product ? localizedField(product, 'name', lang) : ''
  const description = product ? localizedField(product, 'description', lang) : ''
  const badges = (product?.badges || []).filter((badge) => BADGE_LABELS[badge])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/65 backdrop-blur-[3px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={name}
            className="safe-bottom relative w-full max-w-lg overflow-hidden rounded-t-[26px] bg-card shadow-sheet dark:bg-carddark sm:rounded-[26px]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose()
            }}
          >
            <div className="absolute left-1/2 top-2.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/55 sm:hidden" />
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/55 text-white backdrop-blur transition-transform active:scale-90"
            >
              <svg className="h-4.5 w-4.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <ProductImage
              src={product.image}
              alt={name}
              emoji={emoji}
              className="h-64 w-full sm:h-72"
            />

            <div className="px-6 pb-7 pt-5">
              {badges.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-mintsoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-forest dark:bg-forest/25 dark:text-mint"
                    >
                      {BADGE_LABELS[badge]}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="font-playfair text-[28px] font-bold leading-tight text-ink dark:text-paper">
                {name}
              </h3>

              {description && (
                <p className="mt-3 text-[15px] leading-relaxed text-muted dark:text-muteddark">
                  {description}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between">
                <span className="font-playfair text-[30px] font-bold text-forest dark:text-mint">
                  {formatCLP(product.price)}
                </span>
                <span className="rounded-full bg-ink px-4 py-2 text-[12px] font-black text-mint dark:bg-mint dark:text-ink">
                  {t('available')}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
