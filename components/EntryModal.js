'use client'
import { useState } from 'react'
const fields = [
  {key:'gasto',label:'Gasto total ($)',section:'principal'},{key:'vendas',label:'Vendas',section:'principal'},
  {key:'clicks',label:'Cliques',section:'principal'},{key:'ic',label:'ICs (checkouts)',section:'principal'},
  {key:'cpm',label:'CPM ($)',section:'custo'},{key:'convCheckout',label:'Conv. Checkout (%)',section:'custo'},
  {key:'viewsVSL',label:'Views VSL',section:'vsl'},{key:'plays',label:'Plays VSL',section:'vsl'},
  {key:'retencao',label:'Retenção pitch (%)',section:'vsl'},
]
const vslFields = [{key:'plays',label:'Plays'},{key:'playRate',label:'Play Rate (%)'},{key:'retencao',label:'Retenção Pitch (%)'},{key:'audienciaPitch',label:'Audiência Pitch'}]
export default function EntryModal({ onClose, onSave, existing }) {
  const today = new Date().toISOString().split('T')[0]
  const [data, setData] = useState(existing || { date: today })
  const [saving, setSaving] = useState(false)
  const [section, setSection] = useState('principal')
  function set(k,v){ setData(d=>({...d,[k]:parseFloat(v)||v})) }
  function setNested(p,k,v){ setData(d=>({...d,[p]:{...(d[p]||{}),[k]:parseFloat(v)||v}})) }
  async function save(){ setSaving(true); await onSave({...data,date:data.date||today}); setSaving(false) }
  const secs = [{id:'principal',l:'Principal'},{id:'custo',l:'Custos'},{id:'vsl',l:'VSL'},{id:'vslFB',l:'VSL FB'},{id:'vslTK',l:'VSL TK'}]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.7)'}}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{background:'#111118',border:'1px solid #2a2a3a'}}>
        <div className="flex items-center justify-between px-5 py-4" style={{borderBottom:'1px solid #1e1e2e'}}>
          <div>
            <h2 className="text-sm font-semibold">Inserir dados do dia</h2>
            <input type="date" value={data.date||today} onChange={e=>set('date',e.target.value)} className="text-xs mt-0.5 outline-none" style={{background:'transparent',color:'#6b6b8a'}}/>
          </div>
          <button onClick={onClose} style={{color:'#6b6b8a',fontSize:18}}>✕</button>
        </div>
        <div className="flex gap-1 px-5 pt-3 overflow-x-auto">
          {secs.map(s=>(
            <button key={s.id} onClick={()=>setSection(s.id)} className="text-xs px-3 py-1.5 rounded-lg whitespace-nowrap" style={{background:section===s.id?'#1e1e3a':'transparent',color:section===s.id?'#a78bfa':'#6b6b8a',border:section===s.id?'1px solid #2a2a4a':'1px solid transparent'}}>{s.l}</button>
          ))}
        </div>
        <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
          {(section==='vslFB'||section==='vslTK')?vslFields.map(f=>(
            <div key={f.key} className="flex items-center justify-between">
              <label className="text-sm" style={{color:'#9090a8'}}>{f.label}</label>
              <input type="number" step="any" value={data[section]?.[f.key]||''} onChange={e=>setNested(section,f.key,e.target.value)} className="w-36 px-3 py-2 rounded-lg text-sm outline-none text-right" style={{background:'#0d0d14',border:'1px solid #2a2a3a',color:'#e8e8f0',fontFamily:'IBM Plex Mono'}} placeholder="0"/>
            </div>
          )):fields.filter(f=>f.section===section).map(f=>(
            <div key={f.key} className="flex items-center justify-between">
              <label className="text-sm" style={{color:'#9090a8'}}>{f.label}</label>
              <input type="number" step="any" value={data[f.key]||''} onChange={e=>set(f.key,e.target.value)} className="w-36 px-3 py-2 rounded-lg text-sm outline-none text-right" style={{background:'#0d0d14',border:'1px solid #2a2a3a',color:'#e8e8f0',fontFamily:'IBM Plex Mono'}} placeholder="0"/>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 flex justify-end gap-2" style={{borderTop:'1px solid #1e1e2e'}}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm" style={{color:'#6b6b8a',border:'1px solid #2a2a3a',background:'transparent'}}>Cancelar</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff'}}>{saving?'Salvando...':'Salvar'}</button>
        </div>
      </div>
    </div>
  )
}
