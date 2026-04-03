import { createClient } from '@supabase/supabase-js'

// 1. Buscamos primero la versión _V2 (Vercel) y si no existe, la normal (Local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_V2 || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_V2 || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 2. Si no encuentra ninguna de las dos, lanza el error
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Error: No se encontraron las variables de Supabase en .env.local ni en Vercel")
}

// 3. Conectamos
export const supabase = createClient(supabaseUrl, supabaseAnonKey)