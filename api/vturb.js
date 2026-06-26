// api/vturb.js — Vercel Serverless Function v4
// Testa múltiplas URLs base descobertas via vturb-mcp open source

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.VTURB_API_KEY;
  if (!TOKEN) return res.status(500).json({ error: 'VTURB_API_KEY não configurada' });

  const { player_id, from, to, debug } = req.query;

  // Período padrão: últimos 30 dias
  const toDate   = to   || new Date().toISOString().split('T')[0];
  const fromDate = from || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
  const pid = player_id || '69fa119081f6128fd958f0a1'; // Tatiane C1 default

  // URLs base a testar — baseadas no vturb-mcp e na documentação
  const BASES = [
    'https://analytics-api.vturb.com.br/v1',
    'https://analytics-api.vturb.com/v1',
    'https://api.vturb.com.br/analytics/v1',
    'https://analytics.vturb.com.br/v1',
  ];

  // Endpoints a testar (baseados nas 15 tools do vturb-mcp)
  const ENDPOINTS = [
    `/sessions/summary?player_id=${pid}&from=${fromDate}&to=${toDate}`,
    `/sessions/summary?video_id=${pid}&from=${fromDate}&to=${toDate}`,
    `/players/${pid}/summary?from=${fromDate}&to=${toDate}`,
    `/stats/summary?player_id=${pid}&from=${fromDate}&to=${toDate}`,
  ];

  // Headers a testar
  const HEADERS_VARIANTS = [
    { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/json' },
    { 'x-api-key': TOKEN, 'Accept': 'application/json' },
    { 'Authorization': `Token ${TOKEN}`, 'Accept': 'application/json' },
    { 'api-token': TOKEN, 'Accept': 'application/json' },
  ];

  if (debug === '1') {
    // Modo diagnóstico — testa todas as combinações
    const results = [];
    for (const base of BASES) {
      for (const ep of ENDPOINTS.slice(0, 2)) { // só 2 endpoints por base
        for (const headers of HEADERS_VARIANTS.slice(0, 2)) { // só 2 headers
          const url = base + ep;
          try {
            const r = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });
            const txt = await r.text();
            results.push({
              url: url.split('?')[0],
              auth: Object.keys(headers)[0],
              status: r.status,
              body: txt.slice(0, 200)
            });
            if (r.ok) {
              return res.status(200).json({ success: true, url, auth: Object.keys(headers)[0], data: JSON.parse(txt) });
            }
          } catch(e) {
            results.push({ url: url.split('?')[0], auth: Object.keys(headers)[0], status: 'NET', body: e.message });
          }
        }
      }
    }
    return res.status(502).json({ diagnostico: results });
  }

  // Modo normal — tenta a combinação mais provável
  const url = `${BASES[0]}/sessions/summary?player_id=${pid}&from=${fromDate}&to=${toDate}`;
  try {
    const r = await fetch(url, {
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000)
    });
    const txt = await r.text();
    if (r.ok) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(txt);
    }
    return res.status(r.status).json({ error: txt, url });
  } catch(e) {
    return res.status(502).json({ error: e.message });
  }
}
