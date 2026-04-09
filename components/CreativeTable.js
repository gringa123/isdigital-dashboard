'use client'
import { useState } from 'react'
function decide(c,m){
  const sp=parseFloat(c.spend)||0,ic=parseInt(c.ic)||0,s=parseInt(c.sales)||0,cpa=parseFloat(c.cpa)||0,d=parseInt(c.day)||1,cut=c.platform==='TK'?30:50
  if(ic===0&&sp>=cut) return{code:'cut',label:'Cortar',color:'#f87171',bg:'#1f1010'}
  if(ic===0&&sp>=100) return{code:'cut',label:'Cortar',color:'#f87171',bg:'#1f1010'}
  if(s>=1&&cpa<=m.comissao) return{code:'scale',label:'Escalar +2',color:'#4ade80',bg:'#0f2010'}
  if(s>=1&&cpa>m.comissao) return{code:'wait',label:'Aguardar',color:'#fbbf24',bg:'#1f1a0a'}
  if(s===0&&ic>0&&sp>=100&&d>=3) return{code:'pause',label:'Pausar',color:'#fb923c',bg:'#1f1208'}
  if(s===0&&ic>0&&sp<100) return{code:'wait',label:'Aguardar',color:'#fbbf24',bg:'#1f1a0a'}
  if(s===0&&ic>0&&sp>=100) return{code:'monitor',label:'Monitorar',color:'#60a5fa',bg:'#0a1220'}
  return{code:'test',label:'Em teste',color:'#a78bfa',bg:'#16102a'}
}
export default function CreativeTable({entries,metas,onRefresh}){
  const today=entries[0],criativos=today?.criativos||[]
  const [show,setShow]=useState(false)
  const [form,setForm]=useState({name:'',platform:'TK',day:1,spend:'',ic:'',sales:'',cpa:''})
  async function add(){
    if(!form.name||!form.spend) return
    const u={...(today||{date:new Date().toISOString().split('T')[0]})}
    u.criativos=[...(u.criativos||[]),{...form,id:Date.now()}]
    await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(u)})
    setForm({name:'',platform:'TK',day:1,spend:'',ic:'',sales:'',cpa:''});setShow(false);onRefresh()
  }
  async function rem(id){
    const u={...today};u.criativos=(u.criativos||[]).filter(c=>c.id!==id)
    await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(u)});onRefresh()
  }
  const esc=criativos.filter(c=>decide(c,metas).code==='scale').length
  const cut=criativos.filter(c=>decide(c,metas).code==='cut').length
  return(
    <div className="rounded-2xl p-5" style={{background:'#111118',border:'1px solid #1e1e2e'}}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium" style={{color:'#9090a8'}}>Criativos em teste</h2>
          {esc>0&&<span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#0f2010',color:'#4ade80'}}>↑ {esc} escalando</span>}
          {cut>0&&<span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#1f1010',color:'#f87171'}}>✕ {cut} cortar</span>}
        </div>
        <button onClick={()=>setShow(!show)} className="text-xs px-3 py-1.5 rounded-lg" style={{background:'#1a1a2e',color:'#a78bfa',border:'1px solid #2a2a4a'}}>+ Criativo</button>
      </div>
      {show&&(
        <div className="mb-4 p-4 rounded-xl flex flex-wrap gap-2" style={{background:'#0d0d14',border:'1px solid #1e1e2e'}}>
          <input className="px-3 py-2 rounded-lg text-sm outline-none w-32" style={{background:'#111118',border:'1px solid #2a2a3a',color:'#e8e8f0',fontFamily:'IBM Plex Mono'}} placeholder="ED0025" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <select className="px-3 py-2 rounded-lg text-sm outline-none" style={{background:'#111118',border:'1px solid #2a2a3a',color:'#e8e8f0'}} value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option>TK</option><option>FB</option></select>
          <select className="px-3 py-2 rounded-lg text-sm outline-none" style={{background:'#111118',border:'1px solid #2a2a3a',color:'#e8e8f0'}} value={form.day} onChange={e=>setForm({...form,day:e.target.value})}><option value={1}>Dia 1</option><option value={2}>Dia 2</option><option value={3}>Dia 3</option></select>
          {['spend','ic','sales','cpa'].map(f=>(<input key={f} type="number" className="px-3 py-2 rounded-lg text-sm outline-none w-24" style={{background:'#111118',border:'1px solid #2a2a3a',color:'#e8e8f0',fontFamily:'IBM Plex Mono'}} placeholder={{spend:'Spend $',ic:'ICs',sales:'Vendas',cpa:'CPA $'}[f]} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>))}
          <button onClick={add} className="px-4 py-2 rounded-lg text-sm font-medium" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff'}}>Adicionar</button>
        </div>
      )}
      {criativos.length===0?(
        <div className="py-8 text-center"><p className="text-sm" style={{color:'#3a3a5a'}}>Nenhum criativo em teste hoje</p></div>
      ):(
        <div className="overflow-x-auto">
          <table className="w-full" style={{fontSize:13}}>
            <thead><tr style={{borderBottom:'1px solid #1e1e2e'}}>{['Criativo','Plat.','Dia','Spend','ICs','Vendas','CPA','Decisão',''].map(h=>(<th key={h} className="text-left pb-2 pr-3" style={{color:'#3a3a5a',fontWeight:500,fontSize:11}}>{h}</th>))}</tr></thead>
            <tbody>{criativos.map(cr=>{const d=decide(cr,metas);return(
              <tr key={cr.id} style={{borderBottom:'1px solid #111118'}}>
                <td className="py-2.5 pr-3 font-medium mono" style={{color:'#e8e8f0',fontSize:12}}>{cr.name}</td>
                <td className="py-2.5 pr-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{background:cr.platform==='FB'?'#1a1a3a':'#0f1f2a',color:cr.platform==='FB'?'#818cf8':'#38bdf8'}}>{cr.platform}</span></td>
                <td className="py-2.5 pr-3"><span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-medium" style={{background:['','#16102a','#1f1a0a','#1f1010'][cr.day],color:['','#a78bfa','#fbbf24','#f87171'][cr.day]}}>{cr.day}</span></td>
                <td className="py-2.5 pr-3 mono" style={{color:'#9090a8'}}>${parseFloat(cr.spend||0).toFixed(0)}</td>
                <td className="py-2.5 pr-3 mono" style={{color:'#9090a8'}}>{cr.ic||0}</td>
                <td className="py-2.5 pr-3 mono" style={{color:'#9090a8'}}>{cr.sales||0}</td>
                <td className="py-2.5 pr-3 mono" style={{color:'#9090a8'}}>{cr.cpa?`$${parseFloat(cr.cpa).toFixed(0)}`:'—'}</td>
                <td className="py-2.5 pr-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{background:d.bg,color:d.color}}>{d.label}</span></td>
                <td><button onClick={()=>rem(cr.id)} style={{color:'#3a3a5a'}} onMouseEnter={e=>e.target.style.color='#f87171'} onMouseLeave={e=>e.target.style.color='#3a3a5a'}>✕</button></td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
