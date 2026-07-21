'use client'

import { useState } from 'react'

const PREFERENCES = [
  ['menu-dia', 'Menú del día'],
  ['promociones', 'Promociones'],
  ['eventos', 'Eventos'],
  ['nuevos-productos', 'Nuevos productos'],
  ['temporada', 'Café de temporada'],
]

export default function NewsletterSection({ settings, branchId, qrSourceId }) {
  const [form, setForm] = useState({ email: '', name: '', consent: false, preferences: ['promociones'] })
  const [status, setStatus] = useState(null)

  function set(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function togglePreference(id) {
    setForm((current) => ({
      ...current,
      preferences: current.preferences.includes(id)
        ? current.preferences.filter((item) => item !== id)
        : [...current.preferences, id],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Guardando...' })
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        branch_id: branchId,
        qr_source_id: qrSourceId,
        source: qrSourceId ? 'qr' : 'menu',
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setStatus({ type: 'error', message: data.error || 'No se pudo guardar' })
      return
    }
    setForm({ email: '', name: '', consent: false, preferences: ['promociones'] })
    setStatus({
      type: 'success',
      message: data.duplicate ? 'Actualizamos tu suscripción.' : 'Listo. Te enviaremos novedades relevantes.',
    })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-4 sm:px-6">
      <div className="grid gap-5 rounded-[22px] border border-linen bg-card p-5 shadow-card dark:border-linendark dark:bg-carddark lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-forest dark:text-mint">
            Comunidad
          </p>
          <h2 className="mt-2 font-playfair text-[28px] font-bold leading-tight text-ink dark:text-paper">
            {settings?.newsletterTitle || 'Recibe nuestras novedades'}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted dark:text-muteddark">
            {settings?.newsletterText || 'Entérate del menú del día, eventos y promociones especiales.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="Correo electrónico"
              className="rounded-xl border border-linen bg-paper px-4 py-3 text-[14px] outline-none focus:border-forest focus:ring-2 focus:ring-mint dark:border-linendark dark:bg-paperdark"
            />
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Nombre opcional"
              className="rounded-xl border border-linen bg-paper px-4 py-3 text-[14px] outline-none focus:border-forest focus:ring-2 focus:ring-mint dark:border-linendark dark:bg-paperdark"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map(([id, label]) => {
              const active = form.preferences.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePreference(id)}
                  className={`rounded-full px-3 py-1.5 text-[11.5px] font-black ${
                    active ? 'bg-ink text-mint dark:bg-mint dark:text-ink' : 'border border-linen text-muted dark:border-linendark'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <label className="flex items-start gap-2 text-[12px] leading-relaxed text-muted dark:text-muteddark">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set('consent', e.target.checked)}
              className="mt-1"
            />
            Acepto recibir comunicaciones de este local. Puedo pedir la baja cuando quiera.
          </label>

          <button className="rounded-xl bg-forest px-5 py-3 text-[14px] font-black text-white">
            Suscribirme
          </button>
          {status && (
            <p className={`text-[12.5px] font-bold ${status.type === 'error' ? 'text-red-600' : 'text-forest dark:text-mint'}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
