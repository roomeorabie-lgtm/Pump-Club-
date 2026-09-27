import { readServerlessDb, writeServerlessDb } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  const db = readServerlessDb();

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const idFromQuery = req.query?.id as string | undefined;

  // GET /api/reels
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, reels: db.reels });
  }

  // POST /api/reels -> Add new reel with direct video URL
  if (req.method === 'POST') {
    const url = body?.url;
    const title = body?.title;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ success: false, error: 'رابط الفيديو مطلوب' });
    }

    const newReel = {
      id: 'reel-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      url: url.trim(),
      title: (title || '').trim(),
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(db.reels)) {
      db.reels = [];
    }

    db.reels.unshift(newReel);
    writeServerlessDb(db);

    return res.status(200).json({
      success: true,
      reel: newReel,
      reels: db.reels
    });
  }

  // PUT /api/reels -> Update reel
  if (req.method === 'PUT') {
    const id = idFromQuery || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'معرف الفيديو مطلوب' });
    }

    const idx = db.reels.findIndex((r: any) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'الفيديو غير موجود' });
    }

    if (body?.url) db.reels[idx].url = String(body.url).trim();
    if (body?.title !== undefined) db.reels[idx].title = String(body.title).trim();

    writeServerlessDb(db);
    return res.status(200).json({
      success: true,
      reel: db.reels[idx],
      reels: db.reels
    });
  }

  // DELETE /api/reels -> Delete reel
  if (req.method === 'DELETE') {
    const id = idFromQuery || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'معرف الفيديو مطلوب' });
    }

    db.reels = db.reels.filter((r: any) => r.id !== id);
    writeServerlessDb(db);
    return res.status(200).json({ success: true, reels: db.reels });
  }

  return res.status(405).json({
    success: false,
    error: `الطريقة ${req.method} غير مدعومة`
  });
}
