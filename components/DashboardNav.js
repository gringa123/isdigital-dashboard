'use client'
import { useRouter } from 'next/navigation'
export default function DashboardNav() {
  const router = useRouter()
  async function handleLogout() {
    await fetch('/api/auth',{ method:'DELETE' })
    router.push('/login')
  }
  const today = new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})
  return (
    <nav className="sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between" style={{background:'rgba(10,10,15,0.95)',borderBottom:'1px solid #1e1e2e',backdropFilter:'blur(10px)'}}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          <span className="text-white text-xs font-bold">is</span>
        </div>
        <span className="font-semibold text-sm">isdigital</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#1a1a2e',color:'#6b6b8a',border:'1px solid #2a2a3a'}}>dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs capitalize hidden sm:block" style={{color:'#6b6b8a'}}>{today}</span>
        <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg" style={{color:'#9090a8',border:'1px solid #2a2a3a',background:'transparent'}}>Sair</button>
      </div>
    </nav>
  )
}
