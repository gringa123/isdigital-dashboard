// api/vturb.js — Vercel Serverless Function
// Proxy para a API do VTurb Analytics — evita CORS no browser

export default async function handler(req, res) {
  // CORS — permite o dash acessar
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_KEY = process.env.VTURB_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'VTURB_API_KEY não configurada' });
  }

  const { player_id, from, to, endpoint } = req.query;
  const BASE = 'https://analytics-api.vturb.com.br/v1';

  // Versão 2 — inclui api.vturb.com como fallback
  // Endpoints disponíveis
  // Tentar também api.vturb.com (endpoint interno do app)
  const BASE_INT = 'https://api.vturb.com/vturb/v2/players';
  const ROUTES = {
    summary:  player_id ? `${BASE}/sessions/summary?player_id=${player_id}&from=${from}&to=${to}` : null,
    sessions: player_id ? `${BASE}/sessions?player_id=${player_id}&from=${from}&to=${to}&limit=1` : null,
    players:  `${BASE}/players`,
    quota:    `${BASE}/quota`,
  };

  const ep = endpoint || 'summary';
  const url = ROUTES[ep];

  if (!url) {
    return res.status(400).json({ error: 'endpoint inválido ou player_id ausente' });
  }

  // Headers para testar — Bearer é o mais provável segundo docs
  const authHeaders = [
    { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' },
    { 'x-api-key': API_KEY, 'Accept': 'application/json' },
    { 'Authorization': `Token ${API_KEY}`, 'Accept': 'application/json' },
  ];

  let lastStatus = 0;
  let lastBody = '';

  for (const headers of authHeaders) {
    try {
      const r = await fetch(url, { headers });
      const body = await r.text();
      lastStatus = r.status;
      lastBody = body;
      if (r.ok) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Auth-Header', Object.keys(headers)[0]);
        return res.status(200).send(body);
      }
    } catch (e) {
      lastBody = e.message;
    }
  }

  // Nenhum header funcionou — retornar diagnóstico
  return res.status(lastStatus || 500).json({
    error: 'Todos os headers de auth falharam',
    lastStatus,
    lastBody: lastBody.slice(0, 300),
    url_testada: url.split('?')[0],
  });
}
