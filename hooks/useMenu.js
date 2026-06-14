'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// Hook para la vista pública del menú:
// trae las categorías (ordenadas) y todos los productos (ordenados).
export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMenu = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('products').select('*').order('sort_order', { ascending: true }),
      ])

      if (catRes.error) throw catRes.error
      if (prodRes.error) throw prodRes.error

      setCategories(catRes.data || [])
      setProducts(prodRes.data || [])
    } catch (err) {
      console.error('Error cargando el menú:', err)
      setError(err.message || 'No se pudo cargar el menú.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  return { categories, products, loading, error, refetch: fetchMenu }
}
