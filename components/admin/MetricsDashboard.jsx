'use client'

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-[18px] border border-linen bg-card p-4 shadow-card">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-playfair text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-[12.5px] text-muted">{sub}</p>}
    </div>
  )
}

function BarList({ title, items = [], suffix = '' }) {
  const max = Math.max(1, ...items.map((item) => item.value || 0))

  return (
    <section className="rounded-[18px] border border-linen bg-card p-5 shadow-card">
      <h3 className="font-playfair text-xl font-bold text-ink">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.length === 0 && <p className="text-[13px] text-muted">Aún no hay datos para este filtro.</p>}
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-[12.5px]">
              <span className="font-bold text-ink">{item.label}</span>
              <span className="font-black text-forest">
                {item.value}{suffix}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full bg-forest"
                style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function MetricsDashboard({ analytics }) {
  const summary = analytics?.summary || {}

  return (
    <div className="grid gap-4">
      <section className="rounded-[18px] border border-linen bg-ink p-5 text-white shadow-card">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-mint">
          Analítica real
        </p>
        <h2 className="mt-1 font-playfair text-3xl font-bold">Métricas del ecosistema</h2>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/65">
          Los datos vienen de eventos registrados por QR, vistas de productos, clics, reservas, pedidos y newsletter.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Escaneos hoy" value={summary.scansToday ?? 0} sub="Con deduplicación por sesión" />
        <StatCard label="Escaneos período" value={summary.scansPeriod ?? 0} sub="Según filtro activo" />
        <StatCard label="Sesiones únicas" value={summary.uniqueSessions ?? 0} sub="Usuarios aproximados" />
        <StatCard label="Conversión" value={`${summary.conversionRate ?? 0}%`} sub="Clicks, reservas, pedidos o suscripción" />
        <StatCard label="Producto más visto" value={summary.topProduct || 'Sin datos'} />
        <StatCard label="Categoría principal" value={summary.topCategory || 'Sin datos'} />
        <StatCard label="Fuente principal" value={summary.topSource || 'Sin datos'} />
        <StatCard label="Promoción líder" value={summary.topPromotion || 'Sin datos'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BarList title="Dispositivos" items={analytics?.devices || []} />
        <BarList title="Origen del QR" items={analytics?.locations || []} />
        <BarList title="Horas con más actividad" items={analytics?.hours || []} />
      </div>
      <BarList title="Actividad por sucursal" items={analytics?.branchActivity || []} />
    </div>
  )
}
