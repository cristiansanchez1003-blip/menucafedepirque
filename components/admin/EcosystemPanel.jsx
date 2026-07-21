'use client'

function SectionShell({ eyebrow, title, children }) {
  return (
    <section className="rounded-[18px] border border-linen bg-card p-5 shadow-card">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-forest">{eyebrow}</p>
      <h2 className="mt-1 font-playfair text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function StatusPill({ status }) {
  const label = {
    active: 'Activo',
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    not_connected: 'No conectado',
    ok: 'Correcto',
    warning: 'Advertencia',
    error: 'Error',
  }[status] || status || 'Sin estado'
  const cls = status === 'ok' || status === 'active' || status === 'confirmed'
    ? 'bg-forest text-white'
    : status === 'error'
      ? 'bg-red-100 text-red-700'
      : 'bg-ink/8 text-muted'
  return <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-black uppercase tracking-[0.1em] ${cls}`}>{label}</span>
}

function MiniList({ items, render }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div key={item.id || item.title || item.email} className="rounded-[16px] border border-linen bg-paper p-3">
          {render(item)}
        </div>
      ))}
    </div>
  )
}

export function HomePanel({ platform }) {
  const a = platform?.analytics?.summary || {}
  const branch = platform?.branches?.[0]
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <SectionShell eyebrow="Estado del negocio" title={branch?.operational?.label || 'Sin sucursal'}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-black text-ink">{branch?.name}</p>
            <p className="mt-1 text-[13px] text-muted">{branch?.address}</p>
          </div>
          <StatusPill status={branch?.operational?.open ? 'ok' : 'warning'} />
        </div>
      </SectionShell>
      <SectionShell eyebrow="Hoy" title={`${a.menuVisitsToday || 0} visitas al menú`}>
        <p className="text-[13px] text-muted">{a.scansToday || 0} escaneos QR registrados hoy.</p>
        <p className="mt-2 text-[13px] font-bold text-forest">{a.topSource || 'Sin fuente principal'}</p>
      </SectionShell>
      <SectionShell eyebrow="Conversión" title={`${a.conversionRate || 0}%`}>
        <p className="text-[13px] text-muted">{a.whatsappClicks || 0} clics a WhatsApp, {a.mapsClicks || 0} a Maps y {a.reviewClicks || 0} a reseñas.</p>
      </SectionShell>
    </div>
  )
}

export function GrowthPanel({ recommendations = [] }) {
  return (
    <SectionShell eyebrow="Crecimiento" title="Recomendaciones accionables">
      <MiniList
        items={recommendations}
        render={(item) => (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-lato text-[15px] font-black text-ink">{item.title}</h3>
              <StatusPill status={item.priority === 'alta' ? 'warning' : 'ok'} />
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.body}</p>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.14em] text-forest">{item.module}</p>
          </>
        )}
      />
    </SectionShell>
  )
}

export function OperationsPanel({ platform }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionShell eyebrow="Sucursales" title="Estado operativo">
        <MiniList
          items={platform?.branches || []}
          render={(branch) => (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black text-ink">{branch.name}</p>
                <p className="text-[12.5px] text-muted">{branch.operational?.label}</p>
              </div>
              <StatusPill status={branch.operational?.open ? 'ok' : 'warning'} />
            </div>
          )}
        />
      </SectionShell>
      <SectionShell eyebrow="Avisos programados" title="Comunicación operativa">
        <MiniList
          items={platform?.notices || []}
          render={(notice) => (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-ink">{notice.title}</p>
                <StatusPill status={notice.active ? 'active' : 'warning'} />
              </div>
              <p className="mt-1 text-[13px] text-muted">{notice.body}</p>
            </>
          )}
        />
      </SectionShell>
    </div>
  )
}

export function CustomersPanel({ platform }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <SectionShell eyebrow="Reservas" title={`${platform?.reservations?.length || 0} reservas`}>
        <MiniList
          items={(platform?.reservations || []).slice(0, 4)}
          render={(item) => (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-ink">{item.name}</p>
                <StatusPill status={item.status} />
              </div>
              <p className="text-[12.5px] text-muted">{item.date} · {item.time} · {item.adults} adultos</p>
            </>
          )}
        />
      </SectionShell>
      <SectionShell eyebrow="Pedidos" title={`${platform?.orders?.length || 0} pedidos`}>
        <MiniList
          items={(platform?.orders || []).slice(0, 4)}
          render={(item) => (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-ink">{item.customer.name}</p>
                <StatusPill status={item.status} />
              </div>
              <p className="text-[12.5px] text-muted">${Number(item.total || 0).toLocaleString('es-CL')} · Pago al retirar</p>
            </>
          )}
        />
      </SectionShell>
      <SectionShell eyebrow="Newsletter" title={`${platform?.subscribers?.length || 0} suscriptores`}>
        <a
          href="/api/admin/subscribers/export"
          className="mb-3 inline-flex rounded-full bg-ink px-4 py-2 text-[12px] font-black text-mint"
        >
          Exportar CSV
        </a>
        <MiniList
          items={(platform?.subscribers || []).slice(0, 4)}
          render={(item) => (
            <>
              <p className="font-black text-ink">{item.email}</p>
              <p className="text-[12.5px] text-muted">{item.preferences?.join(', ') || 'Sin preferencias'}</p>
            </>
          )}
        />
      </SectionShell>
    </div>
  )
}

export function BranchesPanel({ platform }) {
  return (
    <SectionShell eyebrow="Multi-sucursal" title="Sucursales configuradas">
      <div className="grid gap-3 md:grid-cols-2">
        {(platform?.branches || []).map((branch) => (
          <article key={branch.id} className="rounded-[18px] border border-linen bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-lato text-[16px] font-black text-ink">{branch.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{branch.address}</p>
              </div>
              <StatusPill status={branch.operational?.open ? 'ok' : 'warning'} />
            </div>
            <p className="mt-3 text-[12px] text-muted">WhatsApp: +{branch.whatsapp}</p>
            <p className="mt-1 text-[12px] text-muted">Menú: {branch.menu_mode === 'shared' ? 'compartido' : 'propio'}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  )
}

export function IntegrationsPanel({ platform }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(platform?.integrations || []).map((integration) => (
        <SectionShell key={integration.id} eyebrow="Integración" title={integration.provider}>
          <div className="flex items-center justify-between gap-3">
            <StatusPill status={integration.status} />
            <button className="rounded-full border border-linen bg-paper px-4 py-2 text-[12px] font-black text-ink">
              Conectar
            </button>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            {integration.demo_adapter
              ? 'Adaptador de demostración separado del flujo real. Requiere credenciales OAuth para sincronizar datos reales.'
              : 'Preparado para conectar proveedor externo. La funcionalidad interna opera sin esta integración.'}
          </p>
          <p className="mt-2 text-[12px] text-muted">Permisos: {integration.required_permissions?.join(', ')}</p>
          <p className="mt-1 text-[12px] text-muted">Última sincronización: {integration.last_sync_at || 'Nunca'}</p>
        </SectionShell>
      ))}
    </div>
  )
}

export function HealthPanel({ platform, menu }) {
  const checks = [
    { id: 'menu', title: 'Menú operativo', status: menu?.products?.length ? 'ok' : 'error', detail: `${menu?.products?.length || 0} productos` },
    { id: 'qr', title: 'QR operativo', status: platform?.qr_sources?.length ? 'ok' : 'warning', detail: `${platform?.qr_sources?.length || 0} fuentes` },
    { id: 'whatsapp', title: 'WhatsApp operativo', status: platform?.branches?.every((b) => b.whatsapp) ? 'ok' : 'warning', detail: 'Configurado por sucursal' },
    { id: 'maps', title: 'Maps operativo', status: platform?.branches?.every((b) => b.mapsUrl) ? 'ok' : 'warning', detail: 'Links configurados' },
    { id: 'reviews', title: 'Enlace de reseñas', status: platform?.branches?.every((b) => b.reviewUrl) ? 'ok' : 'warning', detail: 'Google Business no conectado' },
    { id: 'images', title: 'Productos sin imagen', status: menu?.products?.some((p) => !p.image) ? 'warning' : 'ok', detail: `${menu?.products?.filter((p) => !p.image).length || 0} pendientes` },
    { id: 'integrations', title: 'Integraciones', status: 'warning', detail: 'Credenciales externas pendientes' },
    { id: 'events', title: 'Último evento recibido', status: platform?.analytics?.summary?.uniqueSessions ? 'ok' : 'warning', detail: `${platform?.analytics?.summary?.uniqueSessions || 0} sesiones` },
  ]
  return (
    <SectionShell eyebrow="Salud digital" title="Semáforo operativo">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {checks.map((check) => (
          <div key={check.id} className="rounded-[16px] border border-linen bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-black text-ink">{check.title}</p>
              <StatusPill status={check.status} />
            </div>
            <p className="mt-2 text-[12.5px] text-muted">{check.detail}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
