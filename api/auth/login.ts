export default async function handler(req: any, res: any) {
  // Always enforce JSON Content-Type
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'طريقة الطلب غير مسموح بها (Method Not Allowed)'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const username = (body?.username || '').trim();
    const password = (body?.password || '').trim();

    if (username === 'Pump' && password === '104070') {
      return res.status(200).json({
        success: true,
        token: 'pump-auth-authenticated-session-key',
        user: { username: 'Pump', role: 'admin' }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'اسم المستخدم أو كلمة المرور غير صحيحة'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ غير متوقع في الخادم'
    });
  }
}
