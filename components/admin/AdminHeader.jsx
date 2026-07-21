'use client'

import { useRouter } from 'next/navigation'

export default function AdminHeader({ dirty, saving, onSave }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-linen bg-paper/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-playfair text-lg font-bold text-mint">
          CR
        </span>
        <div>
          <p className="font-lato text-[14px] font-black leading-tight text-ink">Café Raíz</p>
          <p className="hidden text-[12px] font-bold text-muted sm:block">Panel de administración</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {dirty && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[13px] font-bold text-white shadow-nav transition active:scale-95 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                    <path d="M17 21v-8H7v8M7 3v5h8" />
                  </svg>
                  Guardar
                </>
              )}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full border border-linen bg-card px-4 py-2 text-[13px] font-bold text-ink/70 transition active:scale-95"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
