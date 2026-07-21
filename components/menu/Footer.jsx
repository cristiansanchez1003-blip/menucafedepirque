'use client'

import { motion } from 'framer-motion'
import { localizedField } from '@/lib/i18n'
import { useApp } from '@/contexts/AppContext'
import { trackEvent } from '@/hooks/usePlatform'

function ContactLink({ href, label, sub, type, branch, qrSourceId, sessionId, children }) {
  async function handleClick() {
    if (!type) return
    await trackEvent({
      type,
      branch_id: branch?.id,
      qr_source_id: qrSourceId,
      session_id: sessionId,
    })
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-3.5 rounded-[18px] bg-white/[0.06] p-4 backdrop-blur transition-colors active:bg-white/[0.12]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint/18 text-mint">
        {children}
      </span>
      <span className="min-w-0">
        <span className="block text-[14.5px] font-bold text-white">{label}</span>
        <span className="block truncate text-[12.5px] text-white/60">{sub}</span>
      </span>
      <svg className="ml-auto h-4 w-4 shrink-0 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </motion.a>
  )
}

export default function Footer({ settings, branch, qrSourceId, sessionId }) {
  const { lang, t } = useApp()
  if (!settings) return null

  const hours = localizedField(settings, 'hours', lang)
  const whatsapp = branch?.whatsapp || settings.whatsapp
  const address = branch?.address || settings.address
  const mapsUrl = branch?.mapsUrl || settings.mapsUrl

  return (
    <footer className="safe-bottom mt-8 bg-ink px-5 pb-10 pt-10 dark:bg-carddark">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-mint">
            {settings.name || 'Café Raíz'}
          </p>
          <motion.h3
            className="mt-3 max-w-md font-playfair text-[32px] font-bold leading-tight text-white"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('contactSectionTitle')}
          </motion.h3>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-white/55">
            {branch?.name ? `${branch.name} · ${t('contactSectionSubtitle')}` : t('contactSectionSubtitle')}
          </p>

          {hours && (
            <div className="mt-6 max-w-sm rounded-[18px] border border-white/10 p-4">
              <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-mint">
                {t('hoursLabel')}
              </span>
              <span className="mt-1 block text-[15px] font-bold text-white">{hours}</span>
            </div>
          )}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {whatsapp && (
            <ContactLink
              href={`https://api.whatsapp.com/send?phone=${whatsapp}`}
              label={t('whatsapp')}
              sub={`+${whatsapp}`}
              type="whatsapp_click"
              branch={branch}
              qrSourceId={qrSourceId}
              sessionId={sessionId}
            >
              <svg className="h-5.5 w-5.5" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
              </svg>
            </ContactLink>
          )}

          {settings.instagram && (
            <ContactLink href={settings.instagram} label={t('instagram')} sub={settings.instagramHandle || '@caferaiz'}>
              <svg className="h-5.5 w-5.5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </ContactLink>
          )}

          {settings.email && (
            <ContactLink href={`mailto:${settings.email}`} label={t('email')} sub={settings.email}>
              <svg className="h-5.5 w-5.5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="5" width="19" height="14" rx="3" />
                <path d="m3.5 7 8.5 6 8.5-6" />
              </svg>
            </ContactLink>
          )}

          {address && (
            <ContactLink
              href={mapsUrl || '#'}
              label={t('directions')}
              sub={address}
              type="maps_click"
              branch={branch}
              qrSourceId={qrSourceId}
              sessionId={sessionId}
            >
              <svg className="h-5.5 w-5.5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </ContactLink>
          )}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-[11.5px] text-white/35">
        © {new Date().getFullYear()} {settings.name || 'Café Raíz'} · {branch?.city || settings.city || 'Chile'}
      </p>
    </footer>
  )
}
