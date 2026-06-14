'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Guard de autenticación del lado del cliente.
// Protege todo /admin/* excepto /admin/login.
export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  const isLoginRoute = pathname === '/admin/login'

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      if (!session && !isLoginRoute) {
        router.replace('/admin/login')
      } else if (session && isLoginRoute) {
        router.replace('/admin/dashboard')
      }
      setChecking(false)
    }

    checkSession()

    // Reacciona a cambios de sesión (login/logout).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (!session && !isLoginRoute) {
        router.replace('/admin/login')
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [isLoginRoute, router])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-coffee" />
          <p className="font-lato text-sm text-muted">Cargando…</p>
        </div>
      </div>
    )
  }

  return <div className="min-h-screen bg-cream">{children}</div>
}
