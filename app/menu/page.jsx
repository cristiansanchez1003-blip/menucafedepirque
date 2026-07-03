'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useMenu } from '@/hooks/useMenu'
import Hero from '@/components/menu/Hero'
import CategoryNav from '@/components/menu/CategoryNav'
import CategorySection from '@/components/menu/CategorySection'
import ProductModal from '@/components/menu/ProductModal'
import Footer from '@/components/menu/Footer'
import WhatsappFab from '@/components/menu/WhatsappFab'

function SkeletonMenu() {
  return (
    <div className="px-4 pt-8">
      <div className="skeleton mb-4 h-7 w-40 rounded-lg" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card">
            <div className="flex-1">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton mt-2 h-3 w-full rounded" />
              <div className="skeleton mt-2 h-4 w-16 rounded" />
            </div>
            <div className="skeleton h-[76px] w-[76px] shrink-0 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MenuPage() {
  const { settings, categories, products, loading, error } = useMenu()
  const [activeId, setActiveId] = useState(null)
  const [selected, setSelected] = useState(null)
  const sectionRefs = useRef({})
  const scrollingTo = useRef(null)

  const productsByCategory = useMemo(() => {
    const map = {}
    for (const cat of categories) {
      map[cat.id] = products.filter((p) => p.categoryId === cat.id)
    }
    return map
  }, [categories, products])

  const selectedEmoji = useMemo(() => {
    if (!selected) return '☕'
    return categories.find((c) => c.id === selected.categoryId)?.emoji || '☕'
  }, [selected, categories])

  useEffect(() => {
    if (!activeId && categories.length > 0) setActiveId(categories[0].id)
  }, [categories, activeId])

  // Scrollspy: marca la categoría visible mientras el usuario se desplaza
  useEffect(() => {
    if (loading || categories.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingTo.current) return // no interferir durante el scroll programado
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.dataset.category)
        }
      },
      { rootMargin: '-64px 0px -55% 0px', threshold: 0 }
    )
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [loading, categories])

  const handleSelectCategory = useCallback((catId) => {
    setActiveId(catId)
    const el = sectionRefs.current[catId]
    if (el) {
      scrollingTo.current = catId
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // libera el bloqueo del scrollspy cuando termina la animación
      setTimeout(() => {
        scrollingTo.current = null
      }, 900)
    }
  }, [])

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-paper">
      <Hero settings={settings} />

      {!loading && categories.length > 0 && (
        <CategoryNav
          categories={categories.filter((c) => (productsByCategory[c.id] || []).length > 0)}
          activeId={activeId}
          onSelect={handleSelectCategory}
        />
      )}

      {error ? (
        <div className="px-6 py-20 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-3 font-lato text-muted">
            No pudimos cargar el menú. Revisa tu conexión e intenta de nuevo.
          </p>
        </div>
      ) : loading ? (
        <SkeletonMenu />
      ) : (
        <div className="pb-6">
          {categories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              products={productsByCategory[cat.id] || []}
              onSelect={setSelected}
              sectionRef={(el) => (sectionRefs.current[cat.id] = el)}
            />
          ))}
        </div>
      )}

      <ProductModal product={selected} emoji={selectedEmoji} onClose={() => setSelected(null)} />

      <Footer settings={settings} />
      <WhatsappFab phone={settings?.whatsapp} />
    </main>
  )
}
