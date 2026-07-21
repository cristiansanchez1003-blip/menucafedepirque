'use client'

import { useMemo, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRSection({ sources = [], branches = [] }) {
  const wrapperRef = useRef(null)
  const [sourceId, setSourceId] = useState(sources[0]?.id || 'mesa-01')

  const source = sources.find((item) => item.id === sourceId) || sources[0]
  const branch = branches.find((item) => item.id === source?.branch_id) || branches[0]
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  const menuUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (branch?.id) params.set('branch', branch.id)
    if (source?.id) params.set('qr', source.id)
    return `${siteUrl}/menu${params.toString() ? `?${params.toString()}` : ''}`
  }, [siteUrl, source, branch])

  function handleDownload() {
    const canvas = wrapperRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `qr-${source?.id || 'menu'}-cafe-raiz.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function handleDownloadSvg() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="360"><rect width="100%" height="100%" fill="#F7F4EE"/><text x="24" y="38" font-family="Arial" font-size="18" font-weight="700" fill="#24282A">${source?.name || 'QR menú'}</text><text x="24" y="62" font-family="Arial" font-size="12" fill="#6E7370">${menuUrl}</text></svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `qr-${source?.id || 'menu'}-rotulo.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <section className="rounded-[18px] border border-linen bg-card p-5 shadow-card">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-forest">
            Punto de entrada
          </p>
          <h2 className="mt-1 font-playfair text-2xl font-bold text-ink">Códigos QR del menú</h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
            Cada QR tiene una URL única. Al abrirla registra escaneo, sucursal, origen, dispositivo,
            sesión anónima y comportamiento posterior.
          </p>

          <label className="mt-5 block max-w-md">
            <span className="mb-1 block text-[12.5px] font-bold text-ink/70">
              Fuente QR
            </span>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full rounded-xl border border-linen bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-mint"
            >
              {sources.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {branches.find((b) => b.id === item.branch_id)?.name || item.branch_id}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {sources.map((item) => (
              <button
                key={item.id}
                onClick={() => setSourceId(item.id)}
                className={`rounded-[16px] border p-3 text-left ${
                  item.id === source?.id ? 'border-forest bg-mintsoft' : 'border-linen bg-paper'
                }`}
              >
                <span className="block text-[13.5px] font-black text-ink">{item.name}</span>
                <span className="mt-1 block text-[12px] text-muted">{item.type} · {item.branch_id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div ref={wrapperRef} className="rounded-[18px] border border-linen bg-white p-5">
            <QRCodeCanvas
              value={menuUrl}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#24282A"
              level="M"
              includeMargin={false}
            />
          </div>

          <p className="break-all text-center text-xs text-muted">{menuUrl}</p>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={handleDownload}
              className="rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-mint shadow-nav active:scale-95"
            >
              Descargar PNG
            </button>
            <button
              onClick={handleDownloadSvg}
              className="rounded-full border border-linen bg-paper px-5 py-3 text-[13px] font-bold text-ink active:scale-95"
            >
              Descargar rótulo SVG
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
