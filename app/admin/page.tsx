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

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/'
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', color: 'black', background: 'white', minHeight: '100vh' }}>
      <h1>Panel Paradisaea</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ border: '1px solid #ccc', padding: '10px' }} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ border: '1px solid #ccc', padding: '10px' }} />
        <button type="submit" style={{ background: 'black', color: 'white', padding: '10px' }}>Entrar</button>
      </form>
    </div>
  )
}
