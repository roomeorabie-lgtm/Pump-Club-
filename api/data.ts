import { readServerlessDb } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  const db = readServerlessDb();
  return res.status(200).json({
    settings: db.settings,
    photos: db.photos,
    reels: db.reels,
    plans: db.plans
  });
}
