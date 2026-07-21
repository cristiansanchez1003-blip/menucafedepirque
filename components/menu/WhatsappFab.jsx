'use client'

import { motion } from 'framer-motion'
import { trackEvent } from '@/hooks/usePlatform'

export default function WhatsappFab({ phone, branchId, qrSourceId, sessionId }) {
  if (!phone) return null

  async function handleClick() {
    await trackEvent({
      type: 'whatsapp_click',
      branch_id: branchId,
      qr_source_id: qrSourceId,
      session_id: sessionId,
    })
  }

  return (
    <motion.a
      href={`https://api.whatsapp.com/send?phone=${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={handleClick}
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-cardHover"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', damping: 15 }}
      whileTap={{ scale: 0.88 }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
      </svg>
    </motion.a>
  )
}
