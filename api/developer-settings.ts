import type { VercelRequest, VercelResponse } from '@vercel/node';

// Developer Settings Backend Controller
const DEFAULT_SETTINGS = {
  name: 'Ahmeed Alisa',
  description: 'مطوّر ADIX — نصنع تجربة رقمية عربية، بتفاصيل أبسط ولمسة مختلفة.',
  avatar: '',
  icon: 'code-slash-outline',
  instagram: 'https://www.instagram.com/ahmeed_alisa/',
  tiktok: 'https://www.tiktok.com/@ahmeed_alisa',
  x: 'https://x.com/Ahmeedalisa',
  website: '',
  enabled: true,
  showHome: false,
  showAbout: true,
  showMenu: false,
  showFooter: false,
  showSocialIcons: true,
  showName: true,
  showDescription: true,
  homePosition: 'beforeFooter',
};

// In-memory / process store fallback
let currentSettings = { ...DEFAULT_SETTINGS };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const adminKey = process.env.ADIX_DEVELOPER_ADMIN_KEY || process.env.ADMIN_KEY || 'ADIX-ADMIN-SECRET-KEY-2026';

  // GET: Fetch current developer settings
  if (req.method === 'GET') {
    return res.status(200).json({
      settings: currentSettings,
      storage: process.env.DATABASE_URL ? 'database' : 'local',
      adminConfigured: true,
    });
  }

  // POST: Admin Authorization Check
  if (req.method === 'POST') {
    const { action, key } = req.body || {};

    if (action === 'authorize') {
      if (!key || key.trim() !== adminKey.trim()) {
        return res.status(401).json({ error: 'مفتاح الإدارة غير صحيح. يرجى التأكد من المفتاح السري.' });
      }

      return res.status(200).json({
        token: `adm_tok_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        expires: Date.now() + 1000 * 60 * 60 * 2, // 2 hours
        storage: process.env.DATABASE_URL ? 'database' : 'local',
      });
    }

    if (action === 'verify') {
      return res.status(200).json({
        settings: currentSettings,
        storage: process.env.DATABASE_URL ? 'database' : 'local',
        adminConfigured: true,
      });
    }
  }

  // PUT: Update Developer Settings (Admin Only)
  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer adm_tok_') && req.headers['x-admin-key'] !== adminKey) {
      return res.status(403).json({ error: 'غير مصرح لك بتعديل إعدادات المطور' });
    }

    const { settings } = req.body || {};
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'بيانات غير صالحة' });
    }

    currentSettings = {
      ...currentSettings,
      name: String(settings.name || '').slice(0, 100),
      description: String(settings.description || '').slice(0, 600),
      avatar: String(settings.avatar || ''),
      icon: String(settings.icon || 'code-slash-outline'),
      instagram: String(settings.instagram || ''),
      tiktok: String(settings.tiktok || ''),
      x: String(settings.x || ''),
      website: String(settings.website || ''),
      enabled: Boolean(settings.enabled),
      showHome: Boolean(settings.showHome),
      showAbout: Boolean(settings.showAbout),
      showMenu: Boolean(settings.showMenu),
      showFooter: Boolean(settings.showFooter),
      showSocialIcons: Boolean(settings.showSocialIcons),
      showName: Boolean(settings.showName),
      showDescription: Boolean(settings.showDescription),
      homePosition: ['top', 'beforeServices', 'afterServices', 'beforeFooter', 'footer'].includes(
        settings.homePosition
      )
        ? settings.homePosition
        : 'beforeFooter',
    };

    return res.status(200).json({
      success: true,
      settings: currentSettings,
      storage: process.env.DATABASE_URL ? 'database' : 'local',
      envelope: {
        savedAt: new Date().toISOString(),
        settings: currentSettings,
      },
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
