// api/vturb.js — Vercel Serverless Function v3
// Proxy para a API do VTurb — usa api.vturb.com (URL real do app)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.VTURB_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'VTURB_API_KEY não configurada' });

  const { player_id, from, to } = req.query;
  if (!player_id) return res.status(400).json({ error: 'player_id obrigatório' });

  // URL real descoberta via network inspection do app.vturb.com
  const BASE = 'https://api.vturb.com/vturb/v2/players';
  const url  = `${BASE}/${player_id}/analytics_stream/player_stats`;

  // O app usa XHR — testar headers possíveis
  const authVariants = [
    { 'x-api-key': API_KEY, 'Accept': 'application/json' },
    { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
    { 'Authorization': `Token ${API_KEY}`, 'Accept': 'application/json' },
    { 'X-Auth-Token': API_KEY, 'Accept': 'application/json' },
  ];

  const results = [];

  for (const headers of authVariants) {
    try {
      // Tentar GET
      const rg = await fetch(url, { method: 'GET', headers });
      const tg  = await rg.text();
      results.push({ method: 'GET', auth: Object.keys(headers)[0], status: rg.status, body: tg.slice(0, 300) });
      if (rg.ok) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Auth', Object.keys(headers)[0]);
        return res.status(200).send(tg);
      }

      // Tentar POST com body de período
      const body = JSON.stringify({ start_date: from, end_date: to, from, to });
      const rp   = await fetch(url, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body });
      const tp   = await rp.text();
      results.push({ method: 'POST', auth: Object.keys(headers)[0], status: rp.status, body: tp.slice(0, 300) });
      if (rp.ok) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Auth', 'POST+' + Object.keys(headers)[0]);
        return res.status(200).send(tp);
      }
    } catch (e) {
      results.push({ error: e.message, auth: Object.keys(headers)[0] });
    }
  }

  // Nenhum funcionou — retornar diagnóstico completo
  return res.status(502).json({ diagnostico: results, url_testada: url });
}
