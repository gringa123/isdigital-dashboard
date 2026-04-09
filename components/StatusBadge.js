export default function StatusBadge({ status }) {
  const m = {verde:{l:'No alvo',bg:'#0f2a1a',c:'#4ade80',d:'#22c55e'},amarelo:{l:'Atenção',bg:'#2a1f0a',c:'#fbbf24',d:'#f59e0b'},vermelho:{l:'Crítico',bg:'#2a0f0f',c:'#f87171',d:'#ef4444'},"sem-dados":{l:'Sem dados',bg:'#1a1a2e',c:'#6b6b8a',d:'#4a4a6a'}}
  const s = m[status]||m['sem-dados']
  return (<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:s.bg,color:s.c}}><span className="w-1.5 h-1.5 rounded-full" style={{background:s.d}}/>{s.l}</span>)
}
