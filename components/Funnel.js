export default function Funnel({ data, metas }) {
  const steps = [
    {l:'Cliques',v:data.clicks,sub:`CPC $${data.clicks>0?(data.gasto/data.clicks).toFixed(2):'—'}`,c:'#6366f1'},
    {l:'Views VSL',v:data.viewsVSL,sub:`${data.clicks>0?((data.viewsVSL/data.clicks)*100).toFixed(0):0}% dos cliques`,c:'#8b5cf6'},
    {l:'Plays VSL',v:data.plays,sub:`${data.viewsVSL>0?((data.plays/data.viewsVSL)*100).toFixed(0):0}% play rate`,c:'#a78bfa'},
    {l:'ICs',v=data.ic,sub:`meta ${metas.ic}`,c:'#c4b5fd',ok:data.ic>=metas.ic},
    {l:'Vendas',v=data.vendas,sub:`meta ${metas.vendas.toFixed(0)}/dia`,c:'#4ade80',ok:data.vendas>=metas.vendas}
  ]
  const max = Math.max(...steps.map(s=>s.v||0),1)
  return (
    <div className="rounded-2xl p-5 h-full" style={{background:'#111118',border:'1px solid #1e1e2e'}}>
      <h2 className="text-sm font-medium mb-5" style={{color:'#9090a8'}}>Funil do dia</h2>
      <div className="space-y-3">
        {steps.map((s,i)=>{
          const p = max>0?Math.max(20,(s.v/max)*100):20
          return(<div key={s.l}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs" style={{color:'#6b6b8a'}}>{s.l}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{color:'#3a3a5a'}}>{s.sub}</span>
                <span className="text-sm font-semibold mono" style={{color:s.ok===undefined?s.c:s.ok?'#4ade80':'#f87171'}}>{sv.toLocaleString('pt-BR')||'—'}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:'#1e1e2e'}}>
              <div className="h-full rounded-full" style={{width:`${p}%`,background:s.ok===false?'#ef4444':s.c,opacity:s.v?1:0x}}/>
            </div>
          </div>)
        })}
      </div>
    </div>
  )
}
