// Diccionario de textos de interfaz. Los productos y categorías se traducen
// en data/menu.json con los campos name_en / description_en / name_es, etc.
export const translations = {
  es: {
    heroSlogan: 'Menús digitales premium para cafeterías, restaurantes y bares.',
    hoursBadge: 'hours',
    contactSectionTitle: 'Canales del local',
    contactSectionSubtitle: 'Reservas, pedidos y consultas rápidas',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    email: 'Correo',
    directions: 'Cómo llegar',
    hoursLabel: 'Horario de atención',
    available: 'Disponible hoy',
    loadError: 'No pudimos cargar el menú. Revisa tu conexión e intenta de nuevo.',
    products: 'productos',
    product: 'producto',
    langToggle: 'EN',
    themeToggleLight: 'Modo claro',
    themeToggleDark: 'Modo oscuro',
    emptyCategory: 'Todavía no hay productos en esta categoría.',
    featuredTitle: 'Recomendados de la casa',
    featuredSubtitle: 'Lo que el local quiere empujar hoy.',
  },
  en: {
    heroSlogan: 'Premium digital menus for cafés, restaurants, and bars.',
    hoursBadge: 'hours',
    contactSectionTitle: 'Contact channels',
    contactSectionSubtitle: 'Reservations, orders, and quick questions',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    email: 'Email',
    directions: 'Directions',
    hoursLabel: 'Opening hours',
    available: 'Available today',
    loadError: "We couldn't load the menu. Check your connection and try again.",
    products: 'items',
    product: 'item',
    langToggle: 'ES',
    themeToggleLight: 'Light mode',
    themeToggleDark: 'Dark mode',
    emptyCategory: 'No items in this category yet.',
    featuredTitle: 'House picks',
    featuredSubtitle: 'What the venue wants to highlight today.',
  },
}

export function translate(lang, key) {
  return translations[lang]?.[key] ?? translations.es[key] ?? key
}

// Helpers para leer campos traducibles de productos/categorías del menú,
// con fallback al español si falta la traducción en inglés.
export function localizedField(entity, field, lang) {
  if (!entity) return ''
  if (lang === 'en') {
    return entity[`${field}_en`] || entity[field] || ''
  }
  return entity[field] || ''
}
