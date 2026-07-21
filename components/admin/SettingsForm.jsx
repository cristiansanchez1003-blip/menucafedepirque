'use client'

import { useState, useEffect } from 'react'

export default function SettingsForm({ settings, onSave }) {
  const [form, setForm] = useState(settings || {})

  useEffect(() => {
    setForm(settings || {})
  }, [settings])

  function set(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    onSave(next)
  }

  const inputCls =
    'w-full rounded-xl border border-linen bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-mint'

  const fields = [
    { key: 'name', label: 'Nombre de la marca', type: 'text' },
    { key: 'slogan', label: 'Slogan visible en el menú', type: 'text' },
    { key: 'city', label: 'Ciudad o zona', type: 'text' },
    { key: 'hours', label: 'Horario', type: 'text' },
    { key: 'address', label: 'Dirección', type: 'text' },
    { key: 'mapsUrl', label: 'Link de Google Maps', type: 'url' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { key: 'instagram', label: 'Link de Instagram', type: 'url' },
    { key: 'instagramHandle', label: 'Usuario de Instagram', type: 'text' },
    { key: 'email', label: 'Correo de contacto', type: 'email' },
  ]

  return (
    <section className="rounded-[18px] border border-linen bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-forest">
            Marca del cliente
          </p>
          <h2 className="mt-1 font-playfair text-2xl font-bold text-ink">Datos del local</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
            Estos datos alimentan portada, footer, contacto y piezas comerciales del menú.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3.5 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={f.key === 'slogan' ? 'block md:col-span-2' : 'block'}>
            <span className="mb-1 block text-[12.5px] font-bold text-ink/70">{f.label}</span>
            <input
              type={f.type}
              value={form[f.key] || ''}
              onChange={(e) => set(f.key, e.target.value)}
              className={inputCls}
            />
          </label>
        ))}
      </div>
    </section>
  )
}
