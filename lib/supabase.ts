import { createClient } from '@supabase/supabase-js'

// Estas variables buscarán las llaves en tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_V2 || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_V2 || ''

// Si no las encuentra, nos avisará en la consola del navegador
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Falta configurar las llaves de Supabase en el archivo .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
