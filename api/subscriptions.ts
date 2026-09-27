import { readServerlessDb, writeServerlessDb } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  const db = readServerlessDb();

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // GET /api/subscriptions
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, subscriptions: db.subscriptions || [] });
  }

  // POST /api/subscriptions
  if (req.method === 'POST') {
    const { fullName, phoneNumber, country, countryCode, subscriptionDuration, price, paymentMethod } = body || {};

    const sub = {
      id: 'sub-' + Date.now(),
      fullName: fullName || '',
      phoneNumber: phoneNumber || '',
      country: country || '',
      countryCode: countryCode || '',
      subscriptionDuration: subscriptionDuration || '',
      price: Number(price) || 0,
      paymentMethod: paymentMethod || 'Vodafone Cash',
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(db.subscriptions)) {
      db.subscriptions = [];
    }

    db.subscriptions.unshift(sub);
    writeServerlessDb(db);

    return res.status(200).json({ success: true, subscription: sub });
  }

  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
