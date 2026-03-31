'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setMsg('Verificando...')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg('Error: ' + error.message)
    else window.location.href = '/'
  }

  return (
    <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'black' }}>Paradisaea Admin</h1>
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} style={{ display: 'block', marginBottom: '10px', width: '250px', padding: '10px' }} required />
        <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} style={{ display: 'block', marginBottom: '10px', width: '250px', padding: '10px' }} required />
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>Entrar</button>
        {msg && <p style={{ color: 'red', marginTop: '10px' }}>{msg}</p>}
      </form>
    </div>
  )
}
