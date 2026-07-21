const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const menuPath = path.join(root, 'data', 'menu.json')
const platformPath = path.join(root, 'data', 'platform.json')
const envExamplePath = path.join(root, '.env.local.example')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function readTextIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

function walkFiles(dir, matches = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', '.claude'].includes(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(fullPath, matches)
    } else if (/\.(js|jsx|ts|tsx|json|md|env|example)$/i.test(entry.name)) {
      matches.push(fullPath)
    }
  }
  return matches
}

const failures = []
const warnings = []

function check(label, fn) {
  try {
    fn()
  } catch (err) {
    failures.push(`${label}: ${err.message}`)
  }
}

function warn(label, condition) {
  if (condition) warnings.push(label)
}

check('data/menu.json', () => assert(fs.existsSync(menuPath), 'no existe'))
check('data/platform.json', () => assert(fs.existsSync(platformPath), 'no existe'))

const menu = fs.existsSync(menuPath) ? readJson(menuPath) : {}
const platform = fs.existsSync(platformPath) ? readJson(platformPath) : {}

check('Carta demo', () => {
  assert(menu.settings?.business_id, 'settings.business_id debe existir')
  assert(menu.settings?.name, 'settings.name debe existir')
  assert(Array.isArray(menu.categories) && menu.categories.length >= 5, 'deben existir al menos 5 categorias')
  assert(Array.isArray(menu.products) && menu.products.length >= 25, 'deben existir al menos 25 productos')
  assert((menu.promotions || []).some((item) => item.active), 'debe existir al menos una promocion activa')
  assert(menu.products.every((product) => product.business_id === menu.settings.business_id), 'productos deben tener business_id consistente')
  assert(!menu.products.some((product) => product.badges?.includes('sin-stock')), 'no usar etiqueta sin-stock')
})

check('Plataforma demo', () => {
  assert(Array.isArray(platform.businesses) && platform.businesses.length >= 1, 'debe existir un negocio')
  assert(Array.isArray(platform.branches) && platform.branches.length >= 2, 'deben existir al menos dos sucursales')
  assert(Array.isArray(platform.qr_sources) && platform.qr_sources.length >= 5, 'deben existir fuentes QR')
  assert(Array.isArray(platform.events) && platform.events.some((event) => event.type === 'qr_scan'), 'deben existir eventos de QR')
  assert(Array.isArray(platform.newsletter_subscribers), 'newsletter_subscribers debe existir')
  assert(Array.isArray(platform.reservations), 'reservations debe existir')
  assert(Array.isArray(platform.orders), 'orders debe existir')
  assert((platform.integrations || []).every((integration) => integration.status !== 'connected'), 'no marcar integraciones externas como conectadas en demo')
})

check('Variables ejemplo', () => {
  const envExample = readTextIfExists(envExamplePath)
  for (const key of ['ADMIN_USER', 'ADMIN_PASSWORD', 'AUTH_SECRET', 'NEXT_PUBLIC_SITE_URL', 'GITHUB_TOKEN', 'GITHUB_REPO', 'GITHUB_BRANCH']) {
    assert(envExample.includes(`${key}=`), `.env.local.example debe incluir ${key}`)
  }
})

const scannedFiles = walkFiles(root)
const staleReferences = scannedFiles.filter((file) => {
  if (file === __filename) return false
  const text = readTextIfExists(file)
  return /menucafedepirque|cafe-de-pirque|Caf[eé] de Pirque|Pirque/i.test(text)
})
check('Marca demo', () => {
  assert(staleReferences.length === 0, `quedan referencias antiguas en ${staleReferences.map((file) => path.relative(root, file)).join(', ')}`)
})

warn('Configura GITHUB_TOKEN y GITHUB_REPO en Vercel para persistir metricas y cambios del admin.', !process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO)
warn('Configura NEXT_PUBLIC_SITE_URL con la URL final de Vercel antes de generar QR para clientes.', !process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL.includes('localhost'))
warn('Cloudinary es opcional, pero sin sus credenciales el admin solo podra pegar URLs de imagenes.', !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)

if (warnings.length) {
  console.log('Advertencias de produccion:')
  for (const item of warnings) console.log(`- ${item}`)
}

if (failures.length) {
  console.error('Verificacion de produccion fallo:')
  for (const item of failures) console.error(`- ${item}`)
  process.exit(1)
}

console.log('Verificacion de produccion OK.')
