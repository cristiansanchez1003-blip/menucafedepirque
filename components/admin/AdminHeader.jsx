'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <div className="leading-tight">
            <h1 className="font-playfair text-lg font-bold text-coffee">
              El Café de Pirque
            </h1>
            <p className="font-lato text-xs text-muted">Panel de administración</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-3 py-1.5 font-lato text-sm font-medium text-coffee transition hover:bg-cream"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
