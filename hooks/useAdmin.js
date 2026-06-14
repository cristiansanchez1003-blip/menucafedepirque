'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// Hook para el panel admin: trae categorías y productos, y expone el CRUD.
export function useAdmin() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
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
      console.error('Error cargando datos:', err)
      setError(err.message || 'No se pudieron cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Crea o actualiza un producto. Si el objeto trae "id", hace UPDATE.
  const saveProduct = useCallback(
    async (product) => {
      const payload = {
        category_id: product.category_id,
        name: product.name?.trim(),
        description: product.description?.trim() || null,
        price: parseInt(product.price, 10) || 0,
        image_url: product.image_url?.trim() || null,
        available: !!product.available,
        sort_order: product.sort_order ?? 0,
      }

      let res
      if (product.id) {
        res = await supabase.from('products').update(payload).eq('id', product.id)
      } else {
        res = await supabase.from('products').insert(payload)
      }
      if (res.error) throw res.error
      await fetchAll()
    },
    [fetchAll]
  )

  // Elimina un producto por id.
  const deleteProduct = useCallback(
    async (id) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      await fetchAll()
    },
    [fetchAll]
  )

  // Alterna disponible / no disponible.
  const toggleAvailable = useCallback(
    async (product) => {
      const { error } = await supabase
        .from('products')
        .update({ available: !product.available })
        .eq('id', product.id)
      if (error) throw error
      await fetchAll()
    },
    [fetchAll]
  )

  return {
    categories,
    products,
    loading,
    error,
    refetch: fetchAll,
    saveProduct,
    deleteProduct,
    toggleAvailable,
  }
}
