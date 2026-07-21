'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo iniciar sesión')
      router.replace('/admin/dashboard')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <img
        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-42"
      />
      <div className="absolute inset-0 bg-ink/72" />

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-6 text-center text-white">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/16 bg-white/10 font-playfair text-2xl font-bold text-mint backdrop-blur">
            CR
          </span>
          <h1 className="mt-4 font-playfair text-3xl font-bold">Café Raíz</h1>
          <p className="mt-1 text-[13px] font-bold text-white/55">Panel de administración</p>
        </div>

        <div className="rounded-[24px] border border-white/12 bg-paper p-6 shadow-cardHover">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-bold text-ink/70">Usuario</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                required
                className="w-full rounded-xl border border-linen bg-card px-4 py-3 text-[15px] text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-mint"
                placeholder="marcela"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-bold text-ink/70">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-linen bg-card px-4 py-3 text-[15px] text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-mint"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-xl bg-ink py-3.5 text-[15px] font-bold text-mint shadow-nav transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-white/45">
          Ecosistema SaaS para cafeterías, restaurantes y bares
        </p>
      </motion.div>
    </main>
  )
}
