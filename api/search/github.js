// api/search/github.js
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed', items: [] });
  }

  // parse body safely
  let body = req.body || {};
  if (!body || Object.keys(body).length === 0) {
    try {
      const raw = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', c => data += c);
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {};
    }
  }

  const query = body.query || req.query?.query || '';
  const page = Number(body.page || req.query?.page || 1);
  const perPage = Math.min(30, Number(body.perPage || req.query?.perPage || 10)); // limit size

  if (!query) return res.status(400).json({ ok: false, error: 'Missing query', items: [] });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ ok: false, error: 'GITHUB_TOKEN not set', items: [] });

  try {
    const q = encodeURIComponent(`${query} extension:ahk`);
    const url = `https://api.github.com/search/code?q=${q}&page=${page}&per_page=${perPage}`;
    const ghRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'AHK-Script-Finder' }
    });
    const data = await ghRes.json();

    const items = (data.items || []).map(item => ({
      name: item.name || item.path || null,
      path: item.path || null,
      html_url: item.html_url || null,
      repository_name: item.repository?.full_name || null,
      repository_url: item.repository?.html_url || null,
      score: item.score || null
    }));

    return res.status(200).json({ ok: true, total_count: data.total_count || 0, items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err), items: [] });
  }
}
