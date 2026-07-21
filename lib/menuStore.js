import { readJsonFile, writeJsonFile } from './repoJsonStore'

const FILE_PATH = 'data/menu.json'

export async function readMenu() {
  return readJsonFile(FILE_PATH)
}

export async function writeMenu(menu) {
  return writeJsonFile(FILE_PATH, menu, 'Actualizacion del menu desde el panel admin')
}

export function validateMenu(menu) {
  if (!menu || typeof menu !== 'object') return 'Estructura invalida'
  if (!menu.settings || typeof menu.settings !== 'object') return 'Faltan los ajustes'
  if (!Array.isArray(menu.categories) || menu.categories.length === 0) return 'Faltan las categorias'
  if (!Array.isArray(menu.products)) return 'Faltan los productos'

  for (const product of menu.products) {
    if (!product.id || !product.name || typeof product.price !== 'number' || !product.categoryId) {
      return `Producto invalido: ${product.name || product.id || '?'}`
    }
  }

  return null
}
