'use client'

import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMenu } from '@/hooks/useMenu'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { localizedField } from '@/lib/i18n'
import Hero from '@/components/menu/Hero'
import CategoryNav from '@/components/menu/CategoryNav'
import ProductCard from '@/components/menu/ProductCard'
import PromoBanner from '@/components/menu/PromoBanner'
import ProductModal from '@/components/menu/ProductModal'
import Footer from '@/components/menu/Footer'
import WhatsappFab from '@/components/menu/WhatsappFab'
import BranchSelector from '@/components/menu/BranchSelector'
import NewsletterSection from '@/components/menu/NewsletterSection'
import ReviewsSection from '@/components/menu/ReviewsSection'
import ActionForms from '@/components/menu/ActionForms'
import { trackEvent, usePlatform } from '@/hooks/usePlatform'

function SkeletonMenu() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="skeleton mb-5 h-8 w-52 rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex overflow-hidden rounded-[18px] bg-card shadow-card dark:bg-carddark">
            <div className="skeleton h-36 w-32 shrink-0" />
            <div className="flex-1 p-4">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton mt-3 h-3 w-full rounded" />
              <div className="skeleton mt-2 h-3 w-4/5 rounded" />
              <div className="skeleton mt-6 h-5 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MenuContent() {
  const { settings, categories, products, promotions, loading, error } = useMenu()
  const { platform, reload: reloadPlatform } = usePlatform()
  const { theme, lang, t } = useApp()
  const [activeId, setActiveId] = useState(null)
  const [selected, setSelected] = useState(null)
  const [branchId, setBranchId] = useState(null)
  const [qrSourceId, setQrSourceId] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const storedBranch = window.localStorage.getItem('cafe-digital-branch')
    const branch = params.get('branch') || storedBranch
    const qr = params.get('qr') || ''
    const existingSession = window.localStorage.getItem('cafe-digital-session') || crypto.randomUUID()
    window.localStorage.setItem('cafe-digital-session', existingSession)
    setSessionId(existingSession)
    setQrSourceId(qr)
    if (branch) setBranchId(branch)
  }, [])

  useEffect(() => {
    if (!platform?.branches?.length) return
    if (!branchId || !platform.branches.some((branch) => branch.id === branchId)) {
      const firstBranch = platform.branches[0].id
      setBranchId(firstBranch)
      window.localStorage.setItem('cafe-digital-branch', firstBranch)
    }
  }, [platform, branchId])

  useEffect(() => {
    if (!sessionId || !qrSourceId || !branchId) return
    trackEvent({ type: 'qr_scan', session_id: sessionId, qr_source_id: qrSourceId, branch_id: branchId })
      .then(() => reloadPlatform?.())
  }, [sessionId, qrSourceId, branchId, reloadPlatform])

  const availableProducts = useMemo(
    () => products.filter((product) => product.available !== false && product.sold_out !== true),
    [products]
  )

  const activePromotions = useMemo(
    () => promotions.filter((promotion) => promotion.active !== false),
    [promotions]
  )

  const visibleCategories = useMemo(() => {
    return categories.filter((category) =>
      availableProducts.some((product) => product.categoryId === category.id)
    )
  }, [categories, availableProducts])

  useEffect(() => {
    if ((!activeId || !visibleCategories.some((c) => c.id === activeId)) && visibleCategories.length > 0) {
      setActiveId(visibleCategories[0].id)
    }
  }, [visibleCategories, activeId])

  const activeCategory = useMemo(
    () => visibleCategories.find((c) => c.id === activeId) || null,
    [visibleCategories, activeId]
  )

  const activeProducts = useMemo(
    () =>
      availableProducts
        .filter((p) => p.categoryId === activeId)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0)),
    [availableProducts, activeId]
  )

  const featuredProducts = useMemo(
    () =>
      availableProducts
        .filter((product) => product.badges?.some((badge) => badge === 'recomendado' || badge === 'popular'))
        .slice(0, 6),
    [availableProducts]
  )

  const selectedEmoji = useMemo(() => {
    if (!selected) return '☕'
    return categories.find((c) => c.id === selected.categoryId)?.emoji || '☕'
  }, [selected, categories])

  const selectedBranch = useMemo(
    () => platform?.branches?.find((branch) => branch.id === branchId) || platform?.branches?.[0],
    [platform, branchId]
  )

  function handleBranchSelect(id) {
    setBranchId(id)
    window.localStorage.setItem('cafe-digital-branch', id)
    if (sessionId) trackEvent({ type: 'branch_select', session_id: sessionId, branch_id: id, qr_source_id: qrSourceId })
  }

  function handleCategorySelect(id) {
    setActiveId(id)
    if (sessionId) trackEvent({ type: 'category_view', session_id: sessionId, branch_id: branchId, qr_source_id: qrSourceId, category_id: id })
  }

  function handleProductSelect(product) {
    setSelected(product)
    if (sessionId) {
      trackEvent({
        type: 'product_view',
        session_id: sessionId,
        branch_id: branchId,
        qr_source_id: qrSourceId,
        product_id: product.id,
        category_id: product.categoryId,
      })
    }
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <main className="min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-paperdark dark:text-paper">
        <Hero
          settings={settings}
          productCount={availableProducts.length}
          promotionCount={activePromotions.length}
        />

        {!loading && visibleCategories.length > 0 && (
          <CategoryNav categories={visibleCategories} activeId={activeId} onSelect={handleCategorySelect} />
        )}

        {error ? (
          <div className="px-6 py-20 text-center">
            <p className="text-4xl">☕</p>
            <p className="mt-3 font-lato text-muted dark:text-muteddark">{t('loadError')}</p>
          </div>
        ) : loading ? (
          <SkeletonMenu />
        ) : (
          <>
            <BranchSelector
              branches={platform?.branches || []}
              selectedId={selectedBranch?.id}
              onSelect={handleBranchSelect}
            />

            {activePromotions.length > 0 && (
              <section className="mx-auto max-w-6xl px-4 pt-7 sm:px-6 lg:pt-10">
                <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
                  {activePromotions.map((promotion) => (
                    <PromoBanner key={promotion.id} promotion={promotion} />
                  ))}
                </div>
              </section>
            )}

            {featuredProducts.length > 0 && (
              <section className="mx-auto max-w-6xl px-4 pt-9 sm:px-6 lg:pt-12">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-forest dark:text-mint">
                      Destacados
                    </p>
                    <h2 className="font-playfair text-[28px] font-bold leading-tight text-ink dark:text-paper">
                      {t('featuredTitle')}
                    </h2>
                    <p className="mt-1 text-[13.5px] text-muted dark:text-muteddark">
                      {t('featuredSubtitle')}
                    </p>
                  </div>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      emoji={categories.find((c) => c.id === product.categoryId)?.emoji}
                      onSelect={handleProductSelect}
                      compact
                    />
                  ))}
                </div>
              </section>
            )}

            <AnimatePresence mode="wait">
              <motion.section
                key={activeId}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mx-auto max-w-6xl px-4 pb-10 pt-9 sm:px-6 lg:pb-16 lg:pt-12"
              >
                {activeCategory && (
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-xl dark:bg-forest/40">
                      {activeCategory.emoji}
                    </span>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted dark:text-muteddark">
                        Categoría
                      </p>
                      <h2 className="font-playfair text-[29px] font-bold leading-tight text-ink dark:text-paper">
                        {localizedField(activeCategory, 'name', lang)}
                      </h2>
                    </div>
                    <span className="ml-auto rounded-full bg-ink/5 px-3 py-1.5 text-[12px] font-black text-muted dark:bg-paper/10 dark:text-muteddark">
                      {activeProducts.length}
                    </span>
                  </div>
                )}

                {activeProducts.length === 0 ? (
                  <p className="py-16 text-center text-[14px] text-muted dark:text-muteddark">
                    {t('emptyCategory')}
                  </p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {activeProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        emoji={activeCategory?.emoji}
                        onSelect={handleProductSelect}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            </AnimatePresence>

            <ActionForms
              branchId={selectedBranch?.id}
              qrSourceId={qrSourceId}
              featuredProduct={featuredProducts[0] || availableProducts[0]}
            />
            <NewsletterSection settings={settings} branchId={selectedBranch?.id} qrSourceId={qrSourceId} />
            <ReviewsSection branch={selectedBranch} reviews={platform?.reviews || []} qrSourceId={qrSourceId} />
          </>
        )}

        <ProductModal product={selected} emoji={selectedEmoji} onClose={() => setSelected(null)} />
        <Footer settings={settings} branch={selectedBranch} qrSourceId={qrSourceId} sessionId={sessionId} />
        <WhatsappFab phone={selectedBranch?.whatsapp || settings?.whatsapp} branchId={selectedBranch?.id} qrSourceId={qrSourceId} sessionId={sessionId} />
      </main>
    </div>
  )
}

export default function MenuPage() {
  return (
    <AppProvider>
      <MenuContent />
    </AppProvider>
  )
}
