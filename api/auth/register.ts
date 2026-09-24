import type { VercelRequest, VercelResponse } from '@vercel/node';

// Backend Registration Controller
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

  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  }

  const userRole = role === 'admin' ? 'admin' : 'customer';

  return res.status(201).json({
    success: true,
    token: `adx_${userRole}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    user: {
      id: `usr_${Date.now().toString(36)}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role: userRole,
      createdAt: new Date().toISOString(),
    },
  });
}
