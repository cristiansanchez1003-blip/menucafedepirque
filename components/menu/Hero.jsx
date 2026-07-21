'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { localizedField } from '@/lib/i18n'
import { useApp } from '@/contexts/AppContext'

export default function Hero({ settings, productCount = 0, promotionCount = 0 }) {
  const { scrollY } = useScroll()
  const { lang } = useApp()
  const y = useTransform(scrollY, [0, 360], [0, 46])
  const opacity = useTransform(scrollY, [0, 320], [1, 0.32])

  const slogan = settings ? localizedField(settings, 'slogan', lang) : ''
  const hours = settings ? localizedField(settings, 'hours', lang) : ''

  return (
    <header className="relative min-h-[430px] overflow-hidden bg-ink text-white sm:min-h-[500px] lg:min-h-[580px]">
      <img
        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=85"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/68 via-ink/38 to-ink" />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto flex min-h-[430px] max-w-6xl flex-col justify-end px-5 pb-7 pt-7 sm:min-h-[500px] sm:px-8 lg:min-h-[580px] lg:px-10"
      >
        <div className="mb-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 font-playfair text-xl font-bold backdrop-blur">
              CD
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-mint">
                Demo gastronómica
              </p>
              <p className="font-lato text-[14px] font-bold text-white/86">
                {settings?.city || 'Menú digital'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-playfair text-[42px] font-bold leading-[0.94] text-white sm:text-[66px] lg:text-[84px]"
          >
            {settings?.name || 'Café Raíz'}
          </motion.h1>

          {slogan && (
            <motion.p
              className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/78 sm:text-[19px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55 }}
            >
              {slogan}
            </motion.p>
          )}

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-2.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
          >
            {hours && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-4 py-2 text-[13px] font-bold text-white backdrop-blur">
                <svg className="h-4 w-4 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {hours}
              </span>
            )}
            <span className="inline-flex rounded-full border border-white/16 bg-white/12 px-4 py-2 text-[13px] font-bold text-white backdrop-blur">
              {productCount} productos
            </span>
            <span className="inline-flex rounded-full border border-white/16 bg-white/12 px-4 py-2 text-[13px] font-bold text-white backdrop-blur">
              {promotionCount} campañas activas
            </span>
          </motion.div>
        </div>
      </motion.div>
    </header>
  )
}
