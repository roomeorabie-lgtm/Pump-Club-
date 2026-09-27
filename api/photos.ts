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

  // Helper to parse body safely
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Support ID from query string or URL or body
  const idFromQuery = req.query?.id as string | undefined;

  // GET /api/photos
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, photos: db.photos });
  }

  // POST /api/photos -> Add new photo with direct URL
  if (req.method === 'POST') {
    const url = body?.url;
    const title = body?.title;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ success: false, error: 'رابط الصورة مطلوب' });
    }

    const newPhoto = {
      id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      url: url.trim(),
      title: (title || '').trim(),
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(db.photos)) {
      db.photos = [];
    }

    db.photos.unshift(newPhoto);
    writeServerlessDb(db);

    return res.status(200).json({
      success: true,
      photo: newPhoto,
      photos: db.photos
    });
  }

  // PUT /api/photos -> Update photo
  if (req.method === 'PUT') {
    const id = idFromQuery || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'معرف الصورة مطلوب' });
    }

    const idx = db.photos.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'الصورة غير موجودة' });
    }

    if (body?.url) db.photos[idx].url = String(body.url).trim();
    if (body?.title !== undefined) db.photos[idx].title = String(body.title).trim();

    writeServerlessDb(db);
    return res.status(200).json({
      success: true,
      photo: db.photos[idx],
      photos: db.photos
    });
  }

  // DELETE /api/photos -> Delete photo
  if (req.method === 'DELETE') {
    const id = idFromQuery || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'معرف الصورة مطلوب' });
    }

    db.photos = db.photos.filter((p: any) => p.id !== id);
    writeServerlessDb(db);
    return res.status(200).json({ success: true, photos: db.photos });
  }

  return res.status(405).json({
    success: false,
    error: `الطريقة ${req.method} غير مدعومة`
  });
}
