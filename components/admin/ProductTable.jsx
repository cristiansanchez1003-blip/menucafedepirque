'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCLP } from '@/lib/format'

function ConfirmDelete({ product, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-cardHover"
          >
            <h3 className="font-playfair text-lg font-bold text-ink">
              ¿Eliminar producto?
            </h3>
            <p className="mt-2 font-lato text-sm text-muted">
              Vas a eliminar <strong>{product.name}</strong>. Esta acción no se
              puede deshacer.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-border py-2.5 font-lato text-sm font-medium text-coffee transition hover:bg-cream"
              >
                Cancelar
              </button>
              <button
                onClick={() => onConfirm(product)}
                className="flex-1 rounded-lg bg-red-600 py-2.5 font-lato text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggle,
}) {
  const [toDelete, setToDelete] = useState(null)

  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-12 text-center">
        <p className="font-lato text-sm text-muted">
          No hay productos en esta categoría. Usa el botón “+” para agregar uno.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-card"
          >
            {/* Thumbnail */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-border">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm">
                  🍽️
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-lato text-sm font-semibold text-ink">
                {p.name}
              </p>
              {p.description && (
                <p className="truncate font-lato text-xs text-muted">
                  {p.description}
                </p>
              )}
            </div>

            {/* Precio */}
            <p className="shrink-0 font-lato text-sm font-bold text-amber">
              {formatCLP(p.price)}
            </p>

            {/* Toggle disponible */}
            <button
              type="button"
              role="switch"
              aria-checked={p.available}
              onClick={() => onToggle(p)}
              title={p.available ? 'Disponible' : 'No disponible'}
              className={[
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
                p.available ? 'bg-coffee' : 'bg-border',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  p.available ? 'translate-x-6' : 'translate-x-1',
                ].join(' ')}
              />
            </button>

            {/* Editar */}
            <button
              onClick={() => onEdit(p)}
              aria-label="Editar"
              className="shrink-0 rounded-lg p-2 text-coffee transition hover:bg-cream"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>

            {/* Eliminar */}
            <button
              onClick={() => setToDelete(p)}
              aria-label="Eliminar"
              className="shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <ConfirmDelete
        product={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={async (p) => {
          await onDelete(p.id)
          setToDelete(null)
        }}
      />
    </>
  )
}
