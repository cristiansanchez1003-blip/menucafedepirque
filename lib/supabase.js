import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Aviso útil en desarrollo si faltan las variables de entorno.
  console.warn(
    'Faltan variables de entorno de Supabase. Copia .env.local.example a .env.local y complétalas.'
  )
}

// Fallbacks inertes para que `next build` no falle si faltan las variables.
// En ejecución real, completa .env.local con tus credenciales de Supabase.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
