'use client'

import { useState } from 'react'

function slugify(value) {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `promo-${Date.now()}`
  )
}

export default function PromotionManager({ promotions = [], onSave, onDelete, onToggle }) {
  const [editingId, setEditingId] = useState(null)

  function update(promotion, field, value) {
    onSave({ ...promotion, [field]: value })
  }

  function createPromotion() {
    const promotion = {
      id: `promo-${Date.now()}`,
      title: 'Nueva promoción',
      subtitle: 'Describe el beneficio o campaña para el cliente.',
      badge: 'Hoy',
      cta: 'Ver más',
      image: '',
      active: true,
      sort: Math.max(0, ...promotions.map((p) => p.sort || 0)) + 1,
    }
    onSave(promotion)
    setEditingId(promotion.id)
  }

  const sorted = [...promotions].sort((a, b) => (a.sort || 0) - (b.sort || 0))
  const inputCls =
    'w-full rounded-xl border border-linen bg-paper px-3.5 py-2.5 text-[14px] text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-mint'

  return (
    <section className="rounded-[18px] border border-linen bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-forest">
            Campañas
          </p>
          <h2 className="mt-1 font-playfair text-2xl font-bold text-ink">Banners promocionales</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
            Activa campañas como menú del día, brunch, happy hour o lanzamientos especiales.
          </p>
        </div>
        <button
          onClick={createPromotion}
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-black text-mint active:scale-95"
        >
          + Nueva promo
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {sorted.map((promotion) => {
          const editing = editingId === promotion.id
          return (
            <article key={promotion.id} className="overflow-hidden rounded-[18px] border border-linen bg-paper">
              <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                <div className="h-28 w-full overflow-hidden rounded-[14px] bg-mintsoft sm:w-44">
                  {promotion.image ? (
                    <img src={promotion.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">☕</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-forest">
                      {promotion.badge || 'Promo'}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                      promotion.active ? 'bg-forest text-white' : 'bg-ink/10 text-muted'
                    }`}>
                      {promotion.active ? 'Activa' : 'Pausada'}
                    </span>
                  </div>
                  <h3 className="mt-2 truncate font-lato text-[16px] font-black text-ink">
                    {promotion.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                    {promotion.subtitle}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onToggle(promotion.id)}
                    className="rounded-full border border-linen bg-card px-3.5 py-2 text-[12.5px] font-bold text-ink/70"
                  >
                    {promotion.active ? 'Pausar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => setEditingId(editing ? null : promotion.id)}
                    className="rounded-full bg-forest px-3.5 py-2 text-[12.5px] font-bold text-white"
                  >
                    {editing ? 'Cerrar' : 'Editar'}
                  </button>
                </div>
              </div>

              {editing && (
                <div className="grid gap-3 border-t border-linen p-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-bold text-ink/70">Título</span>
                    <input
                      value={promotion.title || ''}
                      onChange={(e) => update(promotion, 'title', e.target.value)}
                      onBlur={(e) => !promotion.id && update(promotion, 'id', slugify(e.target.value))}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-bold text-ink/70">Badge</span>
                    <input
                      value={promotion.badge || ''}
                      onChange={(e) => update(promotion, 'badge', e.target.value)}
                      className={inputCls}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-[12px] font-bold text-ink/70">Descripción</span>
                    <input
                      value={promotion.subtitle || ''}
                      onChange={(e) => update(promotion, 'subtitle', e.target.value)}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-bold text-ink/70">Texto del botón</span>
                    <input
                      value={promotion.cta || ''}
                      onChange={(e) => update(promotion, 'cta', e.target.value)}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-bold text-ink/70">Orden</span>
                    <input
                      type="number"
                      value={promotion.sort || 0}
                      onChange={(e) => update(promotion, 'sort', Number(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-[12px] font-bold text-ink/70">URL de imagen</span>
                    <input
                      type="url"
                      value={promotion.image || ''}
                      onChange={(e) => update(promotion, 'image', e.target.value)}
                      className={inputCls}
                    />
                  </label>
                  <div className="flex justify-end md:col-span-2">
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${promotion.title}"?`)) onDelete(promotion.id)
                      }}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[12.5px] font-bold text-red-600"
                    >
                      Eliminar promoción
                    </button>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
