import photosHandler from './photos';
import reelsHandler from './reels';
import plansHandler from './plans';
import settingsHandler from './settings';
import dataHandler from './data';
import loginHandler from './auth/login';
import subscriptionsHandler from './subscriptions';
import plansReorderHandler from './plans-reorder';

export default async function handler(req: any, res: any) {
  // Extract path from req.query.path or req.url
  const pathArray: string[] = Array.isArray(req.query?.path)
    ? req.query.path
    : (req.url || '').split('?')[0].replace(/^\/api\/?/, '').split('/').filter(Boolean);

  const route = pathArray[0] || '';
  const param = pathArray[1] || '';

  if (param) {
    req.query = { ...req.query, id: param };
  }

  switch (route) {
    case 'photos':
      return photosHandler(req, res);
    case 'reels':
      return reelsHandler(req, res);
    case 'plans':
      return plansHandler(req, res);
    case 'plans-reorder':
      return plansReorderHandler(req, res);
    case 'settings':
      return settingsHandler(req, res);
    case 'data':
      return dataHandler(req, res);
    case 'login':
      return loginHandler(req, res);
    case 'auth':
      if (param === 'login') {
        return loginHandler(req, res);
      }
      return loginHandler(req, res);
    case 'subscriptions':
      return subscriptionsHandler(req, res);
    default:
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ success: false, error: `Route /api/${route} not found` });
  }
}
