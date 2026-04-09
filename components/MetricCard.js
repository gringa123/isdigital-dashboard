export default function MetricCard({ label, value, meta, status, highlight }) {
  const colors = {
    ok: '#4ade80', warn: '#fbbf24', alert: '#fbbf24',
    red: '#f87171', low: '#f87171', neutral: '#6b6b8a',
  }
  const color = colors[status] || '#9090a8'
  return (
    <div className="rounded-xl p-4 transition-all" style={{
      background: highlight ? 'linear-gradient(135deg,#1a1a2e,#16162a)' : '#111118',
      border: highlight ? '1px solid #2a2a4a' : '1px solid #1e1e2e',
    }}>
      <p className="text-xs mb-1" style={{color:'#6b6b8a'}}>{label}</p>
      <p className="text-xl font-semibold mono" style={{color}}>{value}</p>
      {meta && <p className="text-xs mt-1" style={{color:'#3a3a5a'}}>{meta}</p>}
    </div>
  )
}
