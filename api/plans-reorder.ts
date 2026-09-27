import { readServerlessDb, writeServerlessDb } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { planIds } = body || {};
  if (!Array.isArray(planIds)) {
    return res.status(400).json({ success: false, error: 'ترتيب الاشتراكات غير صالح' });
  }

  const db = readServerlessDb();
  const planMap = new Map<string, any>((db.plans || []).map((p: any) => [p.id, p]));
  const reordered: any[] = [];

  planIds.forEach((id: string, idx: number) => {
    const plan = planMap.get(id);
    if (plan) {
      plan.order = idx + 1;
      reordered.push(plan);
      planMap.delete(id);
    }
  });

  planMap.forEach((plan: any) => {
    reordered.push(plan);
  });

  db.plans = reordered;
  writeServerlessDb(db);

  return res.status(200).json({ success: true, plans: db.plans });
}
