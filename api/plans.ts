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

  // GET /api/plans
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, plans: db.plans });
  }

  // POST /api/plans -> Add new plan
  if (req.method === 'POST') {
    const { duration, price, features, badge, isPopular } = body || {};

    if (!duration || price === undefined) {
      return res.status(400).json({ success: false, error: 'مدة الاشتراك والسعر مطلوبان' });
    }

    const newPlan = {
      id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      duration: String(duration).trim(),
      price: Number(price),
      currency: 'EGP',
      features: Array.isArray(features) ? features : [],
      badge: badge ? String(badge).trim() : undefined,
      isPopular: Boolean(isPopular),
      order: (db.plans?.length || 0) + 1
    };

    if (!Array.isArray(db.plans)) {
      db.plans = [];
    }

    db.plans.push(newPlan);
    writeServerlessDb(db);

    return res.status(200).json({
      success: true,
      plan: newPlan,
      plans: db.plans
    });
  }

  // PUT /api/plans -> Update plan
  if (req.method === 'PUT') {
    const id = idFromQuery || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'معرف الاشتراك مطلوب' });
    }

    const idx = db.plans.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'الاشتراك غير موجود' });
    }

    const { duration, price, features, badge, isPopular, order } = body;
    if (duration !== undefined) db.plans[idx].duration = String(duration).trim();
    if (price !== undefined) db.plans[idx].price = Number(price);
    if (features !== undefined) db.plans[idx].features = Array.isArray(features) ? features : [];
    if (badge !== undefined) db.plans[idx].badge = badge ? String(badge).trim() : undefined;
    if (isPopular !== undefined) db.plans[idx].isPopular = Boolean(isPopular);
    if (order !== undefined) db.plans[idx].order = Number(order);

    writeServerlessDb(db);
    return res.status(200).json({
      success: true,
      plan: db.plans[idx],
      plans: db.plans
    });
  }

  // DELETE /api/plans -> Delete plan
  if (req.method === 'DELETE') {
    const id = idFromQuery || body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'معرف الاشتراك مطلوب' });
    }

    db.plans = db.plans.filter((p: any) => p.id !== id);
    writeServerlessDb(db);
    return res.status(200).json({ success: true, plans: db.plans });
  }

  return res.status(405).json({
    success: false,
    error: `الطريقة ${req.method} غير مدعومة`
  });
}
