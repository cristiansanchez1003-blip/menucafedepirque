import crypto from 'crypto'
import { readJsonFile, writeJsonFile } from './repoJsonStore'

const FILE_PATH = 'data/platform.json'
const DEFAULT_BUSINESS_ID = 'cafe-raiz'

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function hourKey(date = new Date()) {
  return String(date.getHours()).padStart(2, '0') + ':00'
}

function inferDevice(userAgent = '') {
  const ua = userAgent.toLowerCase()
  if (/iphone|ipad|ios/.test(ua)) return 'iPhone'
  if (/android/.test(ua)) return 'Android'
  if (/mobile/.test(ua)) return 'Mobile'
  return 'Desktop'
}

function inferBrowser(userAgent = '') {
  if (/edg\//i.test(userAgent)) return 'Edge'
  if (/chrome|crios/i.test(userAgent)) return 'Chrome'
  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return 'Safari'
  if (/firefox|fxios/i.test(userAgent)) return 'Firefox'
  return 'Otro'
}

function inferOs(userAgent = '') {
  if (/windows/i.test(userAgent)) return 'Windows'
  if (/iphone|ipad|ios/i.test(userAgent)) return 'iOS'
  if (/android/i.test(userAgent)) return 'Android'
  if (/mac os/i.test(userAgent)) return 'macOS'
  if (/linux/i.test(userAgent)) return 'Linux'
  return 'Otro'
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export async function readPlatform() {
  return readJsonFile(FILE_PATH)
}

export async function writePlatform(data) {
  await writeJsonFile(FILE_PATH, data, 'Actualizacion de datos de plataforma')
  return data
}

export function getBusiness(platform, businessId = DEFAULT_BUSINESS_ID) {
  return platform.businesses.find((business) => business.id === businessId) || platform.businesses[0]
}

export function getBranch(platform, branchId, businessId = DEFAULT_BUSINESS_ID) {
  const business = getBusiness(platform, businessId)
  return platform.branches.find((branch) => branch.business_id === business.id && branch.id === branchId) ||
    platform.branches.find((branch) => branch.business_id === business.id)
}

export function getQrSource(platform, sourceId, businessId = DEFAULT_BUSINESS_ID) {
  const business = getBusiness(platform, businessId)
  return platform.qr_sources.find((source) => source.business_id === business.id && source.id === sourceId)
}

export function isOpenNow(branch, date = new Date()) {
  if (!branch?.hours) return { open: false, label: 'Horario no configurado' }
  if (branch.operational_override?.active) {
    return {
      open: branch.operational_override.status === 'open',
      label: branch.operational_override.message || 'Estado manual activo',
    }
  }

  const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()]
  const ranges = branch.hours[day] || []
  const minutes = date.getHours() * 60 + date.getMinutes()
  const active = ranges.find((range) => {
    const [openH, openM] = range.open.split(':').map(Number)
    const [closeH, closeM] = range.close.split(':').map(Number)
    return minutes >= openH * 60 + openM && minutes < closeH * 60 + closeM
  })
  if (!active) return { open: false, label: `Abrimos a las ${ranges[0]?.open || '09:00'}` }

  const [closeH, closeM] = active.close.split(':').map(Number)
  const closeMinutes = closeH * 60 + closeM
  if (closeMinutes - minutes <= 30) return { open: true, label: 'Cerramos en menos de 30 minutos' }
  return { open: true, label: 'Abierto ahora' }
}

export function summarizePlatform(platform, menu, filters = {}) {
  const business = getBusiness(platform, filters.businessId)
  const branchId = filters.branchId || 'all'
  const periodDays = Number(filters.days || 7)
  const since = Date.now() - periodDays * 24 * 60 * 60 * 1000
  const events = platform.events.filter((event) => {
    if (event.business_id !== business.id) return false
    if (branchId !== 'all' && event.branch_id !== branchId) return false
    return new Date(event.created_at).getTime() >= since
  })
  const today = todayKey()
  const todayEvents = events.filter((event) => event.created_at.startsWith(today))

  const count = (type, list = events) => list.filter((event) => event.type === type).length
  const by = (list, field) =>
    list.reduce((acc, item) => {
      const key = item[field] || 'sin-dato'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  const topEntry = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]
  const productViews = events.filter((event) => event.type === 'product_view')
  const categoryViews = events.filter((event) => event.type === 'category_view')
  const sourceViews = events.filter((event) => event.qr_source_id)
  const productTop = topEntry(by(productViews, 'product_id'))
  const categoryTop = topEntry(by(categoryViews, 'category_id'))
  const sourceTop = topEntry(by(sourceViews, 'qr_source_id'))
  const promotionTop = topEntry(by(events.filter((event) => event.promotion_id), 'promotion_id'))

  const productName = (id) => menu.products.find((product) => product.id === id)?.name || id || 'Sin datos'
  const categoryName = (id) => menu.categories.find((category) => category.id === id)?.name || id || 'Sin datos'
  const sourceName = (id) => platform.qr_sources.find((source) => source.id === id)?.name || id || 'Sin datos'
  const promotionName = (id) => menu.promotions?.find((promotion) => promotion.id === id)?.title || id || 'Sin datos'

  const devices = Object.entries(by(events, 'device')).map(([label, value]) => ({ label, value }))
  const locations = Object.entries(by(sourceViews, 'qr_source_id')).map(([id, value]) => ({
    label: sourceName(id),
    value,
  }))
  const hours = Object.entries(by(events, 'hour')).map(([label, value]) => ({ label, value })).sort((a, b) => a.label.localeCompare(b.label))
  const branchActivity = Object.entries(by(events, 'branch_id')).map(([id, value]) => ({
    label: platform.branches.find((branch) => branch.id === id)?.name || id,
    value,
  }))

  const uniqueSessions = new Set(events.map((event) => event.session_id).filter(Boolean)).size
  const conversions = events.filter((event) =>
    ['whatsapp_click', 'maps_click', 'review_click', 'newsletter_signup', 'reservation_created', 'order_created'].includes(event.type)
  ).length

  return {
    business,
    filters: { branchId, days: periodDays },
    summary: {
      scansToday: count('qr_scan', todayEvents),
      scansPeriod: count('qr_scan'),
      menuVisitsToday: todayEvents.length,
      uniqueSessions,
      conversionRate: uniqueSessions ? Math.round((conversions / uniqueSessions) * 100) : 0,
      whatsappClicks: count('whatsapp_click'),
      mapsClicks: count('maps_click'),
      reviewClicks: count('review_click'),
      reservations: platform.reservations.filter((item) => item.business_id === business.id).length,
      orders: platform.orders.filter((item) => item.business_id === business.id).length,
      subscribers: platform.newsletter_subscribers.filter((item) => item.business_id === business.id && item.status === 'active').length,
      topProduct: productName(productTop?.[0]),
      topCategory: categoryName(categoryTop?.[0]),
      topPromotion: promotionName(promotionTop?.[0]),
      topSource: sourceName(sourceTop?.[0]),
    },
    devices,
    locations,
    hours,
    branchActivity,
  }
}

export function generateRecommendations(platform, menu, analytics) {
  const recommendations = []
  const productsWithoutImage = menu.products.filter((product) => !product.image)
  const viewsByProduct = platform.events
    .filter((event) => event.type === 'product_view')
    .reduce((acc, event) => {
      acc[event.product_id] = (acc[event.product_id] || 0) + 1
      return acc
    }, {})
  const orderClicks = platform.events
    .filter((event) => event.type === 'order_click' || event.type === 'order_created')
    .reduce((acc, event) => {
      if (event.product_id) acc[event.product_id] = (acc[event.product_id] || 0) + 1
      return acc
    }, {})

  if (analytics.summary.topProduct !== 'Sin datos') {
    recommendations.push({
      id: 'top-product',
      title: `${analytics.summary.topProduct} está captando más atención.`,
      body: 'Muévelo a destacados o combínalo con una promoción de ticket medio alto.',
      priority: 'alta',
      module: 'Carta',
    })
  }

  const lowConversion = Object.entries(viewsByProduct).find(([id, views]) => views >= 5 && (orderClicks[id] || 0) === 0)
  if (lowConversion) {
    const product = menu.products.find((item) => item.id === lowConversion[0])
    recommendations.push({
      id: 'views-low-order',
      title: `${product?.name || 'Un producto'} recibe visitas pero no genera pedidos.`,
      body: 'Revisa precio, foto o descripción. También puedes probar un combo por horario.',
      priority: 'media',
      module: 'Crecimiento',
    })
  }

  if (productsWithoutImage.length > 0) {
    recommendations.push({
      id: 'missing-images',
      title: `${productsWithoutImage.length} productos no tienen fotografía.`,
      body: 'Completar fotos mejora lectura del menú y confianza antes del pedido.',
      priority: 'media',
      module: 'Salud digital',
    })
  }

  const inactivePromo = (menu.promotions || []).find((promo) => promo.active && !platform.events.some((event) => event.promotion_id === promo.id))
  if (inactivePromo) {
    recommendations.push({
      id: 'promo-without-events',
      title: `${inactivePromo.title} aún no registra interacciones.`,
      body: 'Dale mejor ubicación o úsala en un QR de mostrador para medir respuesta.',
      priority: 'baja',
      module: 'Promociones',
    })
  }

  if ((analytics.summary.reviewClicks || 0) < 3) {
    recommendations.push({
      id: 'reviews-low',
      title: 'Los clics hacia reseñas están bajos.',
      body: 'Activa la invitación después de reservas o pedidos para aumentar opiniones reales.',
      priority: 'media',
      module: 'Reseñas',
    })
  }

  return recommendations.slice(0, 6)
}

export async function recordEvent(input, request) {
  const platform = await readPlatform()
  const now = new Date()
  const userAgent = request.headers.get('user-agent') || ''
  const businessId = input.business_id || DEFAULT_BUSINESS_ID
  const source = getQrSource(platform, input.qr_source_id, businessId)
  const branch = getBranch(platform, input.branch_id || source?.branch_id, businessId)
  const sessionId = input.session_id || crypto.randomUUID()
  const dedupeKey = `${input.type}:${businessId}:${branch?.id || 'none'}:${input.qr_source_id || ''}:${input.product_id || ''}:${sessionId}`

  if (input.type === 'qr_scan') {
    const recentDuplicate = platform.events.some((event) => {
      if (event.dedupe_key !== dedupeKey) return false
      return now.getTime() - new Date(event.created_at).getTime() < 30 * 60 * 1000
    })
    if (recentDuplicate) {
      return { platform, event: null, deduped: true }
    }
  }

  const event = {
    id: crypto.randomUUID(),
    business_id: businessId,
    branch_id: branch?.id || null,
    qr_source_id: input.qr_source_id || source?.id || null,
    session_id: sessionId,
    type: input.type,
    product_id: input.product_id || null,
    category_id: input.category_id || null,
    promotion_id: input.promotion_id || null,
    device: inferDevice(userAgent),
    browser: inferBrowser(userAgent),
    os: inferOs(userAgent),
    country: 'Chile',
    city: branch?.city || null,
    hour: hourKey(now),
    created_at: now.toISOString(),
    dedupe_key: dedupeKey,
  }

  platform.events.push(event)
  await writePlatform(platform)
  return { platform, event, deduped: false }
}

export async function addNewsletterSubscriber(input) {
  const platform = await readPlatform()
  const email = normalizeEmail(input.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Ingresa un correo válido' }
  }
  if (!input.consent) {
    return { ok: false, error: 'Debes aceptar recibir comunicaciones' }
  }
  const businessId = input.business_id || DEFAULT_BUSINESS_ID
  const existing = platform.newsletter_subscribers.find(
    (item) => item.business_id === businessId && item.email === email
  )
  if (existing) {
    existing.status = 'active'
    existing.name = input.name || existing.name
    existing.preferences = input.preferences || existing.preferences || []
    existing.consent = true
    existing.updated_at = new Date().toISOString()
    await writePlatform(platform)
    return { ok: true, subscriber: existing, duplicate: true }
  }

  const subscriber = {
    id: crypto.randomUUID(),
    business_id: businessId,
    branch_id: input.branch_id || null,
    qr_source_id: input.qr_source_id || null,
    email,
    name: String(input.name || '').trim(),
    preferences: input.preferences || [],
    consent: true,
    status: 'active',
    source: input.source || 'menu',
    created_at: new Date().toISOString(),
  }
  platform.newsletter_subscribers.push(subscriber)
  await writePlatform(platform)
  return { ok: true, subscriber, duplicate: false }
}

export async function addReservation(input) {
  const platform = await readPlatform()
  const required = ['branch_id', 'date', 'time', 'name', 'phone']
  const missing = required.find((field) => !String(input[field] || '').trim())
  if (missing) return { ok: false, error: 'Completa los datos obligatorios' }
  const reservation = {
    id: crypto.randomUUID(),
    business_id: input.business_id || DEFAULT_BUSINESS_ID,
    branch_id: input.branch_id,
    date: input.date,
    time: input.time,
    adults: Number(input.adults || 2),
    children: Number(input.children || 0),
    occasion: input.occasion || '',
    requirements: input.requirements || '',
    allergies: input.allergies || '',
    name: input.name,
    phone: input.phone,
    email: normalizeEmail(input.email),
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  platform.reservations.push(reservation)
  await writePlatform(platform)
  return { ok: true, reservation }
}

export async function addOrder(input) {
  const platform = await readPlatform()
  if (!input.branch_id || !input.customer?.name || !input.customer?.phone || !input.items?.length) {
    return { ok: false, error: 'Completa cliente, sucursal y productos' }
  }
  const order = {
    id: crypto.randomUUID(),
    business_id: input.business_id || DEFAULT_BUSINESS_ID,
    branch_id: input.branch_id,
    customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: normalizeEmail(input.customer.email),
    },
    items: input.items,
    fulfillment: input.fulfillment || 'pickup',
    payment_method: 'pay_at_pickup',
    status: 'pending',
    notes: input.notes || '',
    total: Number(input.total || 0),
    created_at: new Date().toISOString(),
  }
  platform.orders.push(order)
  await writePlatform(platform)
  return { ok: true, order }
}
