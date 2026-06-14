'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductTable from '@/components/admin/ProductTable'
import ProductForm from '@/components/admin/ProductForm'
import QRSection from '@/components/admin/QRSection'

export default function DashboardPage() {
  const {
    categories,
    products,
    loading,
    error,
    saveProduct,
    deleteProduct,
    toggleAvailable,
  } = useAdmin()

  const [activeId, setActiveId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (!activeId && categories.length > 0) {
      setActiveId(categories[0].id)
    }
  }, [categories, activeId])

  const visibleProducts = useMemo(
    () => products.filter((p) => p.category_id === activeId),
    [products, activeId]
  )

  function openNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(product) {
    setEditing(product)
    setFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Sección 1 — Gestión de productos */}
        <section>
          <h2 className="mb-3 font-playfair text-xl font-bold text-coffee">
            Gestión de productos
          </h2>

          {/* Tabs por categoría */}
          <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
            {categories.map((cat) => {
              const isActive = cat.id === activeId
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveId(cat.id)}
                  className={[
                    'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-coffee text-cream'
                      : 'bg-white text-muted hover:bg-border/40',
                  ].join(' ')}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-16 w-full rounded-xl"
                />
              ))}
            </div>
          ) : error ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : (
            <ProductTable
              products={visibleProducts}
              onEdit={openEdit}
              onDelete={deleteProduct}
              onToggle={toggleAvailable}
            />
          )}
        </section>

        {/* Sección 2 — Código QR */}
        <section className="mt-10">
          <QRSection />
        </section>
      </main>

      {/* Botón flotante para agregar */}
      <button
        onClick={openNew}
        aria-label="Agregar producto"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-coffee text-3xl text-cream shadow-cardHover transition hover:bg-coffee/90"
      >
        +
      </button>

      <ProductForm
        open={formOpen}
        product={editing}
        categories={categories}
        defaultCategoryId={activeId}
        onSave={saveProduct}
        onClose={() => setFormOpen(false)}
      />
    </div>
  )
}
