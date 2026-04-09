'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) { router.push('/dashboard') }
    else { setError('Senha incorreta.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'radial-gradient(ellipse at 50% 0%,#1a1a2e 0%,#0a0a0f 70%)'}}>
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <span className="text-white text-sm font-bold">is</span>
            </div>
            <span className="text-xl font-semibold">isdigital</span>
          </div>
          <p className="text-sm" style={{color:'#6b6b8a'}}>Dashboard Operacional</p>
        </div>
        <div className="rounded-2xl p-6" style={{background:'#111118',border:'1px solid #1e1e2e'}}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{color:'#9090a8'}}>Senha de acesso</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{background:'#0a0a0f',border:'1px solid #2a2a3a',color:'#e8e8f0',fontFamily:'IBM Plex Mono,monospace'}}
                onFocus={e => e.target.style.borderColor='#6366f1'}
                onBlur={e => e.target.style.borderColor='#2a2a3a'}
              />
            </div>
            {error && <p className="text-xs py-2 px-3 rounded-lg" style={{color:'#f87171',background:'#1f1010'}}>{error}</p>}
            <button type="submit" disabled={loading || !password}
              className="w-full py-3 rounded-xl text-sm font-medium"
              style={{background:loading||!password?'#2a2a3a':'linear-gradient(135deg,#6366f1,#8b5cf6)',color:loading||!password?'#6b6b8a':'#fff',cursor:loading||!password?'not-allowed':'pointer'}}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-6" style={{color:'#3a3a4a'}}>isdigital © {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
