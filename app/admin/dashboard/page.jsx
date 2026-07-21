'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdmin } from '@/hooks/useAdmin'
import { usePlatform } from '@/hooks/usePlatform'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductForm from '@/components/admin/ProductForm'
import ProductTable from '@/components/admin/ProductTable'
import SettingsForm from '@/components/admin/SettingsForm'
import CategoryManager from '@/components/admin/CategoryManager'
import QRSection from '@/components/admin/QRSection'
import PromotionManager from '@/components/admin/PromotionManager'
import MetricsDashboard from '@/components/admin/MetricsDashboard'
import {
  BranchesPanel,
  CustomersPanel,
  GrowthPanel,
  HealthPanel,
  HomePanel,
  IntegrationsPanel,
  OperationsPanel,
} from '@/components/admin/EcosystemPanel'

const TABS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'productos', label: 'Carta' },
  { id: 'promos', label: 'Promos' },
  { id: 'operaciones', label: 'Operaciones' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'sucursales', label: 'Sucursales' },
  { id: 'metricas', label: 'Analítica' },
  { id: 'crecimiento', label: 'Crecimiento' },
  { id: 'integraciones', label: 'Integraciones' },
  { id: 'salud', label: 'Salud' },
  { id: 'ajustes', label: 'Ajustes' },
  { id: 'qr', label: 'QR' },
]

export default function DashboardPage() {
  const {
    menu,
    loading,
    saving,
    dirty,
    error,
    save,
    uploadImage,
    saveProduct,
    deleteProduct,
    toggleAvailable,
    moveProduct,
    saveCategory,
    deleteCategory,
    saveSettings,
    savePromotion,
    deletePromotion,
    togglePromotion,
  } = useAdmin()

  const [tab, setTab] = useState('inicio')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [daysFilter, setDaysFilter] = useState(7)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)
  const { platform, loading: platformLoading } = usePlatform({ branchId: branchFilter, days: daysFilter })

  const categories = useMemo(
    () => [...(menu?.categories || [])].sort((a, b) => (a.sort || 0) - (b.sort || 0)),
    [menu]
  )

  const filteredByCategory = useMemo(() => {
    const products = menu?.products || []
    const q = search.trim().toLowerCase()
    const visibleCats = categories.filter((c) => filterCat === 'all' || c.id === filterCat)
    return visibleCats
      .map((cat) => ({
        cat,
        items: products
          .filter((p) => p.categoryId === cat.id)
          .filter((p) => !q || p.name.toLowerCase().includes(q))
          .sort((a, b) => (a.sort || 0) - (b.sort || 0)),
      }))
      .filter(({ items }) => items.length > 0)
  }, [menu, categories, search, filterCat])

  const overview = useMemo(() => {
    const products = menu?.products || []
    const promotions = menu?.promotions || []
    const summary = platform?.analytics?.summary || {}
    return [
      { label: 'Productos', value: products.length },
      { label: 'Sucursales', value: platform?.branches?.length || 0 },
      { label: 'Escaneos', value: summary.scansPeriod || 0 },
      { label: 'Conversión', value: `${summary.conversionRate || 0}%` },
      { label: 'Reservas', value: platform?.reservations?.length || 0 },
      { label: 'Pedidos', value: platform?.orders?.length || 0 },
      { label: 'Suscriptores', value: platform?.subscribers?.length || 0 },
      { label: 'Promos activas', value: promotions.filter((p) => p.active !== false).length },
    ]
  }, [menu, platform])

  function showToast(message, ok = true) {
    setToast({ message, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleSave() {
    const result = await save()
    if (result.ok) {
      showToast('Cambios guardados. Visibles en el menú en unos segundos.')
    } else {
      showToast(result.error || 'No se pudo guardar', false)
    }
  }

  function handleDelete(product) {
    if (window.confirm(`¿Eliminar "${product.name}" del menú?`)) {
      deleteProduct(product.id)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-linen border-t-forest" />
      </div>
    )
  }

  if (error || !menu) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        <p className="text-muted">No se pudo cargar el menú. Recarga la página.</p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-xl border border-linen bg-card px-4 py-2.5 text-[14.5px] text-ink shadow-card outline-none transition focus:border-forest focus:ring-2 focus:ring-mint'

  return (
    <div className="min-h-screen bg-paper pb-24">
      <AdminHeader dirty={dirty} saving={saving} onSave={handleSave} />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <section className="rounded-[22px] bg-ink p-5 text-white shadow-cardHover sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-mint">
                Sistema operativo gastronómico
              </p>
              <h1 className="mt-2 font-playfair text-[34px] font-bold leading-tight sm:text-[44px]">
                Admin de {menu.settings?.name || 'Café Raíz'}
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/64">
                Carta, operaciones, QR, clientes, reseñas, campañas y crecimiento desde una sola plataforma.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[620px]">
              {overview.map((item) => (
                <div key={item.label} className="rounded-[16px] border border-white/10 bg-white/8 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/45">
                    {item.label}
                  </p>
                  <p className="mt-1 font-playfair text-2xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-[18px] border border-linen bg-card p-2 shadow-card">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-black transition active:scale-95 ${
                  tab === t.id
                    ? 'bg-ink text-mint shadow-nav'
                    : 'text-ink/58 hover:bg-ink/5 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className={inputCls}>
              <option value="all">Todas las sucursales</option>
              {(platform?.branches || []).map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
            <select value={daysFilter} onChange={(e) => setDaysFilter(Number(e.target.value))} className={inputCls}>
              <option value={1}>Hoy</option>
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={60}>Últimos 60 días</option>
            </select>
          </div>
        </div>

        {platformLoading && <p className="mt-4 text-sm text-muted">Cargando datos operativos...</p>}

        {tab === 'inicio' && <div className="mt-5"><HomePanel platform={platform} /></div>}

        {tab === 'productos' && (
          <div className="mt-5">
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className={inputCls}
              />
              <button
                onClick={() => setEditing({})}
                className="rounded-xl bg-forest px-5 py-2.5 text-[13.5px] font-bold text-white shadow-nav active:scale-95"
              >
                + Nuevo producto
              </button>
            </div>

            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCat('all')}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold ${
                  filterCat === 'all'
                    ? 'bg-ink text-mint'
                    : 'border border-linen bg-card text-ink/60'
                }`}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCat(c.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold ${
                    filterCat === c.id
                      ? 'bg-ink text-mint'
                      : 'border border-linen bg-card text-ink/60'
                  }`}
                >
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-6">
              {filteredByCategory.length === 0 && (
                <p className="py-10 text-center text-[14px] text-muted">
                  No hay productos que coincidan con la búsqueda.
                </p>
              )}
              {filteredByCategory.map(({ cat, items }) => (
                <div key={cat.id}>
                  <h3 className="mb-2 px-1 font-playfair text-[20px] font-bold text-ink">
                    {cat.emoji} {cat.name}
                    <span className="ml-2 text-[12px] font-normal text-muted">
                      {items.length} productos
                    </span>
                  </h3>
                  <ProductTable
                    products={items}
                    onEdit={setEditing}
                    onToggle={toggleAvailable}
                    onMove={moveProduct}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'promos' && (
          <div className="mt-5">
            <PromotionManager
              promotions={menu.promotions || []}
              onSave={savePromotion}
              onDelete={deletePromotion}
              onToggle={togglePromotion}
            />
          </div>
        )}

        {tab === 'operaciones' && <div className="mt-5"><OperationsPanel platform={platform} /></div>}
        {tab === 'clientes' && <div className="mt-5"><CustomersPanel platform={platform} /></div>}
        {tab === 'sucursales' && <div className="mt-5"><BranchesPanel platform={platform} /></div>}
        {tab === 'metricas' && <div className="mt-5"><MetricsDashboard analytics={platform?.analytics} /></div>}
        {tab === 'crecimiento' && <div className="mt-5"><GrowthPanel recommendations={platform?.recommendations || []} /></div>}
        {tab === 'integraciones' && <div className="mt-5"><IntegrationsPanel platform={platform} /></div>}
        {tab === 'salud' && <div className="mt-5"><HealthPanel platform={platform} menu={menu} /></div>}

        {tab === 'ajustes' && (
          <div className="mt-5 flex flex-col gap-5">
            <SettingsForm settings={menu.settings} onSave={saveSettings} />
            <CategoryManager
              categories={categories}
              products={menu.products}
              onSave={saveCategory}
              onDelete={deleteCategory}
            />
          </div>
        )}

        {tab === 'qr' && (
          <div className="mt-5">
            <QRSection sources={platform?.qr_sources || []} branches={platform?.branches || []} />
          </div>
        )}
      </main>

      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="safe-bottom fixed inset-x-0 bottom-0 z-30 px-4 pb-4"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[18px] bg-ink px-4 py-3 shadow-sheet">
              <span className="text-[13px] font-bold text-white">Tienes cambios sin guardar</span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-mint px-4 py-2 text-[13px] font-bold text-ink active:scale-95 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed inset-x-0 top-16 z-50 flex justify-center px-4"
          >
            <div
              className={`rounded-full px-5 py-2.5 text-[13.5px] font-bold shadow-cardHover ${
                toast.ok ? 'bg-forest text-white' : 'bg-red-600 text-white'
              }`}
            >
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductForm
        product={editing}
        categories={categories}
        onSave={saveProduct}
        onClose={() => setEditing(null)}
        uploadImage={uploadImage}
      />
    </div>
  )
}
