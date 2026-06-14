'use client'

import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRSection() {
  const wrapperRef = useRef(null)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const menuUrl = `${siteUrl}/menu`

  function handleDownload() {
    const canvas = wrapperRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'qr-menu-cafe-pirque.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <h2 className="font-playfair text-lg font-bold text-coffee">Código QR del menú</h2>
      <p className="mt-1 font-lato text-sm text-muted">
        Imprime este QR y colócalo en las mesas y mostrador. Tus clientes lo
        escanean y ven el menú al instante.
      </p>

      <div className="mt-5 flex flex-col items-center gap-4">
        <div
          ref={wrapperRef}
          className="rounded-xl border border-border p-4"
          style={{ backgroundColor: '#FDF6EC' }}
        >
          <QRCodeCanvas
            value={menuUrl}
            size={200}
            bgColor="#FDF6EC"
            fgColor="#6B3A2A"
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="break-all text-center font-lato text-xs text-muted">
          {menuUrl}
        </p>

        <button
          onClick={handleDownload}
          className="rounded-lg bg-coffee px-5 py-2.5 font-lato text-sm font-semibold text-cream transition hover:bg-coffee/90"
        >
          Descargar QR
        </button>
      </div>
    </section>
  )
}
