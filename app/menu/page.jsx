'use client'

import { useState, useEffect, useMemo } from 'react'
import { useMenu } from '@/hooks/useMenu'
import Header from '@/components/menu/Header'
import CategoryNav from '@/components/menu/CategoryNav'
import MenuGrid from '@/components/menu/MenuGrid'
import ProductModal from '@/components/menu/ProductModal'
import Footer from '@/components/menu/Footer'

export default function MenuPage() {
  const { categories, products, loading, error } = useMenu()
  const [activeId, setActiveId] = useState(null)
  const [selected, setSelected] = useState(null)

  // Selecciona la primera categoría apenas cargan los datos.
  useEffect(() => {
    if (!activeId && categories.length > 0) {
      setActiveId(categories[0].id)
    }
  }, [categories, activeId])

  const visibleProducts = useMemo(
    () => products.filter((p) => p.category_id === activeId),
    [products, activeId]
  )

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {!loading && categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeId={activeId}
          onSelect={setActiveId}
        />
      )}

      {error ? (
        <div className="px-4 py-16 text-center">
          <p className="font-lato text-muted">
            No pudimos cargar el menú. Intenta recargar la página.
          </p>
        </div>
      ) : (
        <MenuGrid
          products={visibleProducts}
          loading={loading}
          onSelect={setSelected}
        />
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />

      <Footer />
    </main>
  )
}
