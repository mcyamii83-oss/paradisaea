'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert('Error: ' + error.message)
    else window.location.reload()
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Panel Administrativo Paradisaea</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
        <input 
          type="email" 
          placeholder="Tu correo de Supabase" 
          className="p-2 border rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="p-2 border rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  )
}
