'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{background:'#111118',border:'1px solid #2a2a3a',borderRadius:10,padding:'8px 12px',fontSize:12}}>
      <p style={{color:'#6b6b8a',marginBottom:4}}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{color:p.color}}>{p.name}: <span style={{fontFamily:'IBM Plex Mono'}}>{p.value?.toFixed(2)}</span></p>
      ))}
    </div>
  )
}

export default function ChartWeekly({ data, metas }) {
  const formatted = data.map(d => ({
    dia: new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', {weekday:'short', day:'2-digit'}),
    roas: d.vendas > 0 && d.gasto > 0 ? parseFloat(((d.vendas * metas.comissao) / d.gasto).toFixed(2)) : 0,
    vendas: d.vendas || 0,
    gasto: d.gasto || 0,
  }))

  return (
    <div className="rounded-2xl p-5 h-full" style={{background:'#111118',border:'1px solid #1e1e2e'}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium" style={{color:'#9090a8'}}>Últimos 7 dias — ROAS</h2>
      </div>
      {formatted.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={formatted} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="roasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dia" tick={{fontSize:11,fill:'#3a3a5a'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#3a3a5a'}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <ReferenceLine y={metas.roas} stroke="#6366f1" strokeDasharray="4 4" strokeOpacity={0.4}/>
            <ReferenceLine y={1} stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.3}/>
            <Area type="monotone" dataKey="roas" name="ROAS" stroke="#6366f1" strokeWidth={2} fill="url(#roasGrad)" dot={{fill:'#6366f1',r:3}} activeDot={{r:5}}/>
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm" style={{color:'#3a3a5a'}}>Sem dados suficientes</p>
        </div>
      )}
      {formatted.length > 0 && (
        <div className="mt-4 space-y-1">
          {[...formatted].reverse().slice(0,5).map((d,i) => (
            <div key={i} className="flex items-center justify-between py-1.5" style={{borderBottom:'1px solid #1a1a2a'}}>
              <span className="text-xs" style={{color:'#6b6b8a'}}>{d.dia}</span>
              <div className="flex gap-4">
                <span className="text-xs mono" style={{color:'#9090a8'}}>${d.gasto.toFixed(0)} gasto</span>
                <span className="text-xs mono" style={{color:'#9090a8'}}>{d.vendas} vendas</span>
                <span className="text-xs mono font-medium" style={{color:d.roas>=metas.roas?'#4ade80':d.roas>=1?'#fbbf24':'#f87171'}}>{d.roas.toFixed(2)}x</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
