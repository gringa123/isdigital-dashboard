export default function VSLMetrics({ data, metas }) {
  const vsls = [
    {nome:'VSL 15 — Emily (FB)',plataforma:'FB',plays:data.vslFB?.plays||0,playRate:data.vslFB?.playRate||0,retencao:data.vslFB?.retencao||0,audienciaPitch:data.vslFB?.audienciaPitch||0},
    {nome:'VSL TK — ED TK',plataforma:'TK',plays:data.vslTK?.plays||0,playRate:data.vslTK?.playRate||0,retencao:data.vslTK?.retencao||0,audienciaPitch:data.vslTK?.audienciaPitch||0},
  ]
  function retColor(v) {
    if(!v) return '#3a3a5a'
    if(v>=metas.retencao*1.3) return '#4ade80'
    if(v>=metas.retencao) return '#86efac'
    if(v>=metas.retencao*0.7) return '#fbbf24'
    return '#f87171'
  }
  return (
    <div className="rounded-2xl p-5" style={{background:'#111118',border:'1px solid #1e1e2e'}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium" style={{color:'#9090a8'}}>Métricas de VSL</h2>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#1a1a2e',color:'#6b6b8a',border:'1px solid #2a2a3a'}}>meta ret. {metas.retencao}%</span>
      </div>
      <div className="space-y-4">
        {vsls.map((vsl,i)=>(
          <div key={i} className="p-4 rounded-xl" style={{background:'#0d0d14',border:'1px solid #1a1a2a'}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{color:'#e8e8f0'}}>{vsl.nome}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{background:vsl.plataforma==='FB'?'#1a1a3a':'#0f1f2a',color:vsl.plataforma==='FB'?'#818cf8':'#38bdf8'}}>{vsl.plataforma}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                {label:'Plays',value:vsl.plays?.toLocaleString('pt-BR')||'—'},
                {label:'Play Rate',value:vsl.playRate?`${vsl.playRate.toFixed(1)}%`:'—',color:vsl.playRate>=metas.playRate?'#4ade80':'#fbbf24'},
                {label:'Ret. Pitch',value:vsl.retencao?`${vsl.retencao.toFixed(1)}%`:'—',color:retColor(vsl.retencao)},
                {label:'Aud. Pitch',value:vsl.audienciaPitch?.toLocaleString()||'—'},
              ].map(m=>(
                <div key={m.label} className="text-center">
                  <p className="text-lg font-semibold mono" style={{color:m.color||'#9090a8'}}>{m.value}</p>
                  <p className="text-xs mt-0.5" style={{color:'#3a3a5a'}}>{m.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="h-1 rounded-full overflow-hidden" style={{background:'#1e1e2e'}}>
                <div className="h-full rounded-full" style={{width:`${Math.min(100,(vsl.retencao/20)*100)}%`,background:retColor(vsl.retencao)}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
