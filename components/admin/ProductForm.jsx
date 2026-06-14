'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EMPTY = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category_id: '',
  available: true,
}

export default function ProductForm({
  open,
  product,
  categories,
  defaultCategoryId,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (open) {
      setErrors({})
      setServerError('')
      if (product) {
        setForm({
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          price: product.price ?? '',
          image_url: product.image_url || '',
          category_id: product.category_id || defaultCategoryId || '',
          available: product.available ?? true,
          sort_order: product.sort_order ?? 0,
        })
      } else {
        setForm({ ...EMPTY, category_id: defaultCategoryId || '' })
      }
    }
  }, [open, product, defaultCategoryId])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'El nombre es obligatorio.'
    if (form.price === '' || isNaN(parseInt(form.price, 10)) || parseInt(form.price, 10) < 0) {
      next.price = 'Ingresa un precio válido.'
    }
    if (!form.category_id) next.category_id = 'Selecciona una categoría.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setServerError('')
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setServerError(err.message || 'No se pudo guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-cream/40 px-3 py-2 font-lato text-sm text-ink outline-none transition focus:border-amber focus:ring-1 focus:ring-amber'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-cardHover"
          >
            <h2 className="mb-4 font-playfair text-xl font-bold text-coffee">
              {product ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-lato text-sm font-medium text-ink">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-lato text-sm font-medium text-ink">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="mb-1 block font-lato text-sm font-medium text-ink">
                  Precio (CLP) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className={inputClass}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-lato text-sm font-medium text-ink">
                  URL de imagen
                </label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => update('image_url', e.target.value)}
                  placeholder="https://…"
                  className={inputClass}
                />
                {form.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image_url}
                    alt="Vista previa"
                    className="mt-2 h-32 w-full rounded-lg border border-border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>

              <div>
                <label className="mb-1 block font-lato text-sm font-medium text-ink">
                  Categoría *
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => update('category_id', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecciona…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>
                )}
              </div>

              <label className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.available}
                  onClick={() => update('available', !form.available)}
                  className={[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition',
                    form.available ? 'bg-coffee' : 'bg-border',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition',
                      form.available ? 'translate-x-6' : 'translate-x-1',
                    ].join(' ')}
                  />
                </button>
                <span className="font-lato text-sm text-ink">
                  {form.available ? 'Disponible' : 'No disponible'}
                </span>
              </label>

              {serverError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {serverError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-border py-2.5 font-lato text-sm font-medium text-coffee transition hover:bg-cream"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-coffee py-2.5 font-lato text-sm font-semibold text-cream transition hover:bg-coffee/90 disabled:opacity-60"
                >
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
