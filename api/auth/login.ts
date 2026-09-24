import type { VercelRequest, VercelResponse } from '@vercel/node';

// Backend Authentication Login Controller
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Admin built-in credential check
  if (cleanEmail === 'a.ahmeed.alisa@gmail.com' && (password === 'Aa+905454850467@AHMED' || password === 'A+905454850467AHMED')) {
    return res.status(200).json({
      success: true,
      token: `adx_adm_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      user: {
        id: 'ahmedalisa',
        email: 'a.ahmeed.alisa@gmail.com',
        name: 'مدير نظام أديكس',
        role: 'admin',
      },
    });
  }

  // Customer authentication success
  return res.status(200).json({
    success: true,
    token: `adx_usr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    user: {
      id: `usr_${Date.now().toString(36)}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'customer',
    },
  });
}
