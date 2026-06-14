'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (authError) {
      setError('Correo o contraseña incorrectos. Intenta nuevamente.')
      return
    }

    router.replace('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-card"
      >
        <div className="mb-6 text-center">
          <span className="text-3xl">☕</span>
          <h1 className="mt-2 font-playfair text-2xl font-bold text-coffee">
            El Café de Pirque
          </h1>
          <p className="mt-1 font-lato text-sm text-muted">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-lato text-sm font-medium text-ink">
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elcafedepirque.cl"
              className="w-full rounded-lg border border-border bg-cream/40 px-3 py-2 font-lato text-sm text-ink outline-none transition focus:border-amber focus:ring-1 focus:ring-amber"
            />
          </div>

          <div>
            <label className="mb-1 block font-lato text-sm font-medium text-ink">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-cream/40 px-3 py-2 font-lato text-sm text-ink outline-none transition focus:border-amber focus:ring-1 focus:ring-amber"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 font-lato text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-coffee py-2.5 font-lato text-sm font-semibold text-cream transition hover:bg-coffee/90 disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
