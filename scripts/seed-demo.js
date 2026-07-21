const fs = require('fs')
const path = require('path')

const root = process.cwd()
const menuPath = path.join(root, 'data', 'menu.json')
const platformPath = path.join(root, 'data', 'platform.json')

const BUSINESS_ID = 'cafe-raiz'
const branches = [
  {
    id: 'providencia',
    business_id: BUSINESS_ID,
    name: 'Casa Providencia',
    city: 'Santiago',
    address: 'Av. Providencia 2148, Providencia',
    phone: '+56224567890',
    whatsapp: '56912345678',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Providencia+Santiago+Chile',
    reviewUrl: 'https://www.google.com/search?q=Cafe+Raiz+Providencia+reviews',
    coordinates: { lat: -33.4267, lng: -70.6112 },
    menu_mode: 'shared',
    status: 'auto',
    operational_override: { active: false },
    hours: {
      mon: [{ open: '08:30', close: '21:00' }],
      tue: [{ open: '08:30', close: '21:00' }],
      wed: [{ open: '08:30', close: '21:00' }],
      thu: [{ open: '08:30', close: '22:00' }],
      fri: [{ open: '08:30', close: '23:00' }],
      sat: [{ open: '09:30', close: '23:00' }],
      sun: [{ open: '10:00', close: '18:00' }],
    },
  },
  {
    id: 'nunoa',
    business_id: BUSINESS_ID,
    name: 'Terraza Ñuñoa',
    city: 'Santiago',
    address: 'Av. Irarrázaval 3490, Ñuñoa',
    phone: '+56226789123',
    whatsapp: '56987654321',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Irarr%C3%A1zaval+%C3%91u%C3%B1oa+Chile',
    reviewUrl: 'https://www.google.com/search?q=Cafe+Raiz+Nunoa+reviews',
    coordinates: { lat: -33.4543, lng: -70.5994 },
    menu_mode: 'shared',
    status: 'auto',
    operational_override: { active: false },
    hours: {
      mon: [{ open: '09:00', close: '20:30' }],
      tue: [{ open: '09:00', close: '20:30' }],
      wed: [{ open: '09:00', close: '20:30' }],
      thu: [{ open: '09:00', close: '22:00' }],
      fri: [{ open: '09:00', close: '23:30' }],
      sat: [{ open: '10:00', close: '23:30' }],
      sun: [{ open: '10:00', close: '19:00' }],
    },
  },
]

const extraProducts = [
  ['roll-canela', 'cafeteria', 'Roll de canela', 'Masa suave, canela, glaseado cítrico y nueces tostadas.', 3900, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80', ['popular']],
  ['chai-avena', 'cafeteria', 'Chai latte avena', 'Té especiado con leche de avena, canela y cardamomo.', 4100, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=80', ['nuevo']],
  ['granola-casa', 'brunch', 'Granola de la casa', 'Yogurt natural, granola, fruta de estación y miel.', 5900, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80', ['recomendado']],
  ['ensalada-quinoa', 'fondos', 'Ensalada tibia de quinoa', 'Quinoa, zapallo asado, hojas verdes, almendras y dressing cítrico.', 8600, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', ['nuevo']],
  ['gnocchi-pesto', 'fondos', 'Gnocchi al pesto', 'Gnocchi de papa, pesto de albahaca, tomates confitados y parmesano.', 9900, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80', []],
  ['sandwich-veggie', 'sandwiches', 'Sándwich veggie', 'Pan ciabatta, hummus, berenjena asada, rúcula y tomate.', 7900, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', ['recomendado']],
  ['brownie-nueces', 'postres', 'Brownie con nueces', 'Chocolate intenso, nueces y salsa tibia de manjar.', 4700, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', ['popular']],
  ['tarta-limon', 'postres', 'Tarta de limón', 'Masa sablé, crema de limón y merengue italiano.', 5100, 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=80', []],
  ['jugo-temporada', 'bebidas', 'Jugo de temporada', 'Fruta de estación prensada al momento.', 4300, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80', ['nuevo']],
  ['negroni-cafe', 'bar', 'Negroni café', 'Gin, vermut, bitter y cold brew de la casa.', 7900, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80', ['recomendado']],
]

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function addDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function event(id, type, daysAgo, hour, branchId, qrSourceId, extra = {}) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, (id * 7) % 60, 0, 0)
  return {
    id: `seed-${id}`,
    business_id: BUSINESS_ID,
    branch_id: branchId,
    qr_source_id: qrSourceId,
    session_id: `seed-session-${Math.floor(id / 3)}`,
    type,
    product_id: extra.product_id || null,
    category_id: extra.category_id || null,
    promotion_id: extra.promotion_id || null,
    device: extra.device || ['iPhone', 'Android', 'Desktop'][id % 3],
    browser: extra.browser || ['Safari', 'Chrome', 'Edge'][id % 3],
    os: extra.os || ['iOS', 'Android', 'Windows'][id % 3],
    country: 'Chile',
    city: 'Santiago',
    hour: String(hour).padStart(2, '0') + ':00',
    created_at: date.toISOString(),
    dedupe_key: `seed-${id}`,
  }
}

function seedMenu() {
  const menu = readJson(menuPath, {})
  menu.settings = {
    ...menu.settings,
    business_id: BUSINESS_ID,
    name: 'Café Raíz',
    slogan: 'Cocina de estación, café de especialidad y encuentros de barrio.',
    address: branches[0].address,
    city: 'Santiago',
    whatsapp: branches[0].whatsapp,
    reviewCta: 'Déjanos tu opinión',
    newsletterTitle: 'Recibe nuestras novedades',
    newsletterText: 'Entérate del menú del día, eventos y promociones especiales.',
    theme: {
      logoUrl: '',
      colors: {
        paper: '#F7F4EE',
        ink: '#24282A',
        forest: '#2F6B47',
        mint: '#BFE5CB',
        accent: '#D6A85A',
      },
      radius: '18px',
      buttonStyle: 'pill',
      cardStyle: 'soft-shadow',
      tone: 'cercano, cálido y gastronómico',
    },
  }

  menu.promotions = (menu.promotions || []).map((promo) => ({
    ...promo,
    business_id: BUSINESS_ID,
    branch_ids: ['providencia', 'nunoa'],
    starts_at: promo.starts_at || addDays(-7),
    ends_at: promo.ends_at || addDays(14),
  }))

  const products = menu.products || []
  for (const [id, categoryId, name, description, price, image, badges] of extraProducts) {
    if (!products.some((product) => product.id === id)) {
      const siblings = products.filter((product) => product.categoryId === categoryId)
      products.push({
        id,
        business_id: BUSINESS_ID,
        categoryId,
        name,
        description,
        price,
        image,
        available: true,
        badges,
        sort: siblings.length + 1,
      })
    }
  }

  menu.products = products.map((product) => ({
    business_id: BUSINESS_ID,
    branch_ids: product.branch_ids || ['providencia', 'nunoa'],
    variants: product.variants || [
      { id: 'regular', name: 'Regular', price_delta: 0 },
      ...(product.categoryId === 'cafeteria' ? [{ id: 'grande', name: 'Grande', price_delta: 700 }] : []),
    ],
    extras: product.extras || (product.categoryId === 'cafeteria'
      ? [{ id: 'leche-avena', name: 'Leche de avena', price: 600 }]
      : [{ id: 'extra-palta', name: 'Extra palta', price: 1200 }]),
    allergens: product.allergens || (product.categoryId === 'postres' ? ['gluten', 'lácteos'] : []),
    dietary: product.dietary || (product.name.toLowerCase().includes('veggie') || product.name.toLowerCase().includes('quinoa') ? ['vegano'] : []),
    available_days: product.available_days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    available_hours: product.available_hours || null,
    seasonal: product.seasonal || false,
    sold_out: product.sold_out || false,
    ...product,
  }))

  fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2), 'utf8')
}

function seedPlatform() {
  const menu = readJson(menuPath, {})
  const productIds = menu.products.map((product) => product.id)
  const categoryIds = menu.categories.map((category) => category.id)
  const promoIds = (menu.promotions || []).map((promo) => promo.id)
  const qrSources = [
    ['mesa-01', 'Mesa 1', 'providencia', 'table'],
    ['mesa-02', 'Mesa 2', 'providencia', 'table'],
    ['mostrador', 'Mostrador', 'providencia', 'counter'],
    ['terraza-nunoa', 'Terraza Ñuñoa', 'nunoa', 'table'],
    ['instagram-bio', 'Instagram Bio', 'providencia', 'social'],
    ['google-business', 'Google Business', 'nunoa', 'external'],
    ['evento-cata', 'Evento cata de café', 'providencia', 'event'],
  ].map(([id, name, branch_id, type]) => ({
    id,
    business_id: BUSINESS_ID,
    branch_id,
    name,
    type,
    url: `/menu?branch=${branch_id}&qr=${id}`,
    active: true,
    created_at: addDays(-45),
  }))

  const events = []
  for (let i = 1; i <= 360; i++) {
    const branch = branches[i % branches.length]
    const source = qrSources[i % qrSources.length]
    const product_id = productIds[i % productIds.length]
    const category_id = categoryIds[i % categoryIds.length]
    const promotion_id = promoIds[i % Math.max(1, promoIds.length)] || null
    const type = ['qr_scan', 'menu_view', 'product_view', 'category_view', 'whatsapp_click', 'maps_click', 'review_click'][i % 7]
    events.push(event(i, type, i % 45, 9 + (i % 13), branch.id, source.id, { product_id, category_id, promotion_id }))
  }

  const platform = {
    version: 1,
    businesses: [
      {
        id: BUSINESS_ID,
        name: 'Café Raíz',
        legal_name: 'Café Raíz SpA',
        plan: 'growth',
        status: 'active',
        story: 'Café Raíz nació como una cafetería de barrio que mezcla café de especialidad, cocina de estación y una agenda pequeña de encuentros culturales.',
        description: 'Cafetería-restaurante con brunch, almuerzos, pastelería, bar de tarde y productos para llevar.',
        created_at: addDays(-90),
      },
    ],
    users: [
      { id: 'user-superadmin', business_id: null, name: 'Equipo Plataforma', email: 'superadmin@cafedigital.cl', role: 'superadmin' },
      { id: 'user-owner', business_id: BUSINESS_ID, name: 'Isidora Valdés', email: 'duena@caferaiz.cl', role: 'owner' },
      { id: 'user-admin', business_id: BUSINESS_ID, name: 'Tomás Rojas', email: 'admin@caferaiz.cl', role: 'admin' },
      { id: 'user-editor', business_id: BUSINESS_ID, name: 'Camila Soto', email: 'encargada@caferaiz.cl', role: 'editor' },
    ],
    roles: ['superadmin', 'owner', 'admin', 'editor'],
    branches,
    qr_sources: qrSources,
    events,
    reservations: [
      { id: 'res-001', business_id: BUSINESS_ID, branch_id: 'providencia', date: addDays(1).slice(0, 10), time: '12:30', adults: 3, children: 0, occasion: 'Almuerzo', requirements: 'Mesa interior', allergies: 'Nueces', name: 'Fernanda Muñoz', phone: '+56944445555', email: 'fernanda@example.com', status: 'pending', created_at: addDays(-1) },
      { id: 'res-002', business_id: BUSINESS_ID, branch_id: 'nunoa', date: addDays(2).slice(0, 10), time: '19:00', adults: 2, children: 1, occasion: 'Cumpleaños', requirements: 'Terraza', allergies: '', name: 'Diego Pérez', phone: '+56933334444', email: 'diego@example.com', status: 'confirmed', created_at: addDays(-2) },
    ],
    orders: [
      { id: 'ord-001', business_id: BUSINESS_ID, branch_id: 'providencia', customer: { name: 'María López', phone: '+56922221111', email: '' }, items: [{ product_id: 'flat-white', name: 'Flat white', quantity: 2, price: 3600 }], fulfillment: 'pickup', payment_method: 'pay_at_pickup', status: 'pending', notes: 'Sin azúcar', total: 7200, created_at: addDays(0) },
    ],
    newsletter_subscribers: [
      { id: 'sub-001', business_id: BUSINESS_ID, branch_id: 'providencia', qr_source_id: 'instagram-bio', email: 'ana@example.com', name: 'Ana', preferences: ['promociones', 'eventos'], consent: true, status: 'active', source: 'menu', created_at: addDays(-12) },
      { id: 'sub-002', business_id: BUSINESS_ID, branch_id: 'nunoa', qr_source_id: 'terraza-nunoa', email: 'luis@example.com', name: 'Luis', preferences: ['menu-dia'], consent: true, status: 'active', source: 'qr', created_at: addDays(-5) },
    ],
    loyalty_customers: [
      { id: 'loy-001', business_id: BUSINESS_ID, email: 'ana@example.com', phone: '+56911112222', points: 120, visits: 6, benefits: ['Café gratis en la visita 8'], birthday_coupon: true, preferred_branch_id: 'providencia', last_visit_at: addDays(-3) },
    ],
    reviews: [
      { id: 'rev-001', business_id: BUSINESS_ID, branch_id: 'providencia', author: 'Catalina', rating: 5, text: 'Muy buen café y atención rápida.', source: 'demo', featured: true, created_at: addDays(-20) },
      { id: 'rev-002', business_id: BUSINESS_ID, branch_id: 'nunoa', author: 'Matías', rating: 4, text: 'La terraza es cómoda y el brunch vale la pena.', source: 'demo', featured: true, created_at: addDays(-14) },
    ],
    notices: [
      { id: 'notice-001', business_id: BUSINESS_ID, branch_id: 'providencia', title: 'Cata de café este jueves', body: 'Cupos limitados desde las 19:00.', type: 'event', active: true, starts_at: addDays(-1), ends_at: addDays(3) },
    ],
    integrations: [
      { id: 'google-business', business_id: BUSINESS_ID, provider: 'Google Business Profile', status: 'not_connected', account: null, last_sync_at: null, required_permissions: ['business.manage'], errors: [], demo_adapter: true },
      { id: 'google-ads', business_id: BUSINESS_ID, provider: 'Google Ads', status: 'not_connected', account: null, last_sync_at: null, required_permissions: ['ads.readonly'], errors: [], demo_adapter: true },
      { id: 'meta-ads', business_id: BUSINESS_ID, provider: 'Meta Ads', status: 'not_connected', account: null, last_sync_at: null, required_permissions: ['ads_read'], errors: [], demo_adapter: true },
      { id: 'mailchimp', business_id: BUSINESS_ID, provider: 'Mailchimp/Brevo', status: 'not_connected', account: null, last_sync_at: null, required_permissions: ['contacts.write'], errors: [], demo_adapter: false },
    ],
    audit_logs: [
      { id: 'audit-001', business_id: BUSINESS_ID, branch_id: 'providencia', user_id: 'user-admin', action: 'seed_demo', entity: 'platform', previous_value: null, new_value: 'Datos demo iniciales', created_at: new Date().toISOString() },
    ],
  }

  fs.writeFileSync(platformPath, JSON.stringify(platform, null, 2), 'utf8')
}

seedMenu()
seedPlatform()
console.log('Seed demo aplicado: Café Raíz, 2 sucursales, QR, eventos, reservas, pedidos y newsletter.')
