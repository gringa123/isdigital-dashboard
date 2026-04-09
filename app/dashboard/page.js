'use client'
import { useState, useEffect } from 'react'
import MetricCard from '@/components/MetricCard'
import Funnel from '@/components/Funnel'
import ChartWeekly from '@/components/ChartWeekly'
import CreativeTable from '@/components/CreativeTable'
import VSLMetrics from '@/components/VSLMetrics'
import EntryModal from '@/components/EntryModal'
import StatusBadge from '@/components/StatusBadge'

const METAS = { cpa:168, roas:1.43, budgetDiario:2333, vendas:13.9, ic:63.1, cpc:0.33, cpm:66.59, convCheckout:22, retencao:7, playRate:39, comissao:240 }

export default function DashboardPage() {
  const [entries, setEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try { const res = await fetch('/api/data'); setEntries(await res.json()) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleSave(entry) {
    await fetch('/api/data', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(entry) })
    await fetchData(); setShowModal(false)
  }

  const today = entries[0] || null
  const last7 = entries.slice(0,7).reverse()
  const gasto = today?.gasto || 0
  const vendas = today?.vendas || 0
  const clicks = today?.clicks || 0
  const ic = today?.ic || 0
  const cpa = vendas > 0 ? gasto / vendas : 0
  const receita = vendas * METAS.comissao
  const roas = gasto > 0 ? receita / gasto : 0
  const profit = receita - gasto
  const viewsVSL = today?.viewsVSL || 0
  const plays = today?.plays || 0
  const playRate = viewsVSL > 0 ? (plays/viewsVSL)*100 : 0
  const retencao = today?.retencao || 0
  const convCheckout = today?.convCheckout || 0
  const cpm = today?.cpm || 0

  function getStatus() {
    if(!today) return 'sem-dados'
    if(roas >= METAS.roas && cpa <= METAS.cpa) return 'verde'
    if(roas >= 1.0 && cpa <= METAS.comissao) return 'amarelo'
    return 'vermelho'
  }

  if(loading) return <div className="flex items-center justify-center h-64"><p style={{color:'#6b6b8a'}}>Carregando...</p></div>

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-lg font-semibold">Hoje</h1>
            <StatusBadge status={getStatus()} />
          </div>
          <p className="text-sm" style={{color:'#6b6b8a'}}>
            {today ? `Dados de ${new Date(today.date+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}` : 'Nenhum dado inserido hoje'}
          </p>
        </div>
        <button onClick={()=>setShowModal(true)} className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff'}}>
          <span>+</span> Inserir dados do dia
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Gasto" value={`$${gasto.toFixed(0)}`} meta={`meta $${METAS.budgetDiario.toFixed(0)}`} status={gasto<=METAS.budgetDiario?'ok':'alert'}/>
        <MetricCard label="Receita" value={`$${receita.toFixed(0)}`} meta={`${vendas} vendas`} status={vendas>=METAS.vendas?'ok':'low'}/>
        <MetricCard label="Profit" value={`$${profit.toFixed(0)}`} meta={profit>=0?'positivo':'negativo'} status={profit>=0?'ok':'red'} highlight/>
        <MetricCard label="ROAS" value={`${roas.toFixed(2)}x`} meta={`meta ${METAS.roas}x`} status={roas>=METAS.roas?'ok':roas>=1?'warn':'red'}/>
        <MetricCard label="CPA" value={cpa>0?`$${cpa.toFixed(0)}`:'—'} meta={`meta $${METAS.cpa}`} status={cpa===0?'neutral':cpa<=METAS.cpa?'ok':cpa<=METAS.comissao?'warn':'red'}/>
        <MetricCard label="ICs" value={ic} meta={`meta ${METAS.ic}`} status={ic>=METAS.ic?'ok':ic>=METAS.ic*0.7?'warn':'red'}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1"><Funnel data={{gasto,clicks,viewsVSL,plays,ic,vendas}} metas={METAS}/></div>
        <div className="lg:col-span-2"><ChartWeekly data={last7} metas={METAS}/></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VSLMetrics data={{viewsVSL,plays,playRate,retencao,convCheckout,vslFB:today?.vslFB||{},vslTK:today?.vslTK||{}}} metas={METAS}/>
        <div className="rounded-2xl p-5 space-y-3" style={{background:'#111118',border:'1px solid #1e1e2e'}}>
          <h2 className="text-sm font-medium" style={{color:'#9090a8'}}>Métricas de custo</h2>
          <div className="space-y-2">
            {[
              {label:'CPC',real:clicks>0?gasto/clicks:0,meta:METAS.cpc,fmt:v=>`$${v.toFixed(2)}`,lower:true},
              {label:'CPM',real:cpm,meta:METAS.cpm,fmt:v=>`$${v.toFixed(2)}`,lower:true},
              {label:'Conv. Checkout',real:convCheckout,meta:METAS.convCheckout,fmt:v=>`${v.toFixed(1)}%`,lower:false},
              {label:'Retenção VSL',real:retencao,meta:METAS.retencao,fmt:v=>`${v.toFixed(1)}%`,lower:false},
              {label:'Play Rate',real:playRate,meta:METAS.playRate,fmt:v=>`${v.toFixed(1)}%`,lower:false},
            ].map(m=>(
              <div key={m.label} className="flex items-center justify-between py-2" style={{borderBottom:'1px solid #1a1a2a'}}>
                <span className="text-sm" style={{color:'#9090a8'}}>{m.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{color:'#3a3a5a'}}>meta {m.fmt(m.meta)}</span>
                  <span className="text-sm font-medium mono" style={{color:m.real===0?'#3a3a5a':m.lower?m.real<=m.meta?'#4ade80':m.real<=m.meta*1.3?'#fbbf24':'#f87171':m.real>=m.meta?'#4ade80':m.real>=m.meta*0.7?'#fbbf24':'#f87171'}}>
                    {m.real===0?'—':m.fmt(m.real)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{color:'#6b6b8a'}}>Progresso mensal (vendas)</span>
              <span className="text-xs mono" style={{color:'#9090a8'}}>{entries.reduce((s,e)=>s+(e.vendas||0),0).toFixed(0)} / 417</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:'#1e1e2e'}}>
              <div className="h-full rounded-full" style={{width:`${Math.min(100,(entries.reduce((s,e)=>s+(e.vendas||0),0)/417)*100).toFixed(1)}%`,background:'linear-gradient(90deg,#6366f1,#8b5cf6)'}}/>
            </div>
          </div>
        </div>
      </div>

      <CreativeTable entries={entries} metas={METAS} onRefresh={fetchData}/>

      {showModal && <EntryModal onClose={()=>setShowModal(false)} onSave={handleSave} existing={today} metas={METAS}/>}
    </div>
  )
}
