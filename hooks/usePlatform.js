'use client'

import { useCallback, useEffect, useState } from 'react'

export function usePlatform({ branchId = 'all', days = 7 } = {}) {
  const [platform, setPlatform] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (branchId) params.set('branch', branchId)
      if (days) params.set('days', String(days))
      const res = await fetch(`/api/platform?${params.toString()}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo cargar la plataforma')
      setPlatform(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [branchId, days])

  useEffect(() => {
    load()
  }, [load])

  return { platform, loading, error, reload: load }
}

export async function trackEvent(payload) {
  const res = await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json().catch(() => ({ ok: false }))
}
