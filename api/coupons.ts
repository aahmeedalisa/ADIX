import type { VercelRequest, VercelResponse } from '@vercel/node';

// Backend Coupons Validation Controller
const COUPONS: Record<string, { percent: number; minAmount: number; title: string }> = {
  ADIX10: { percent: 0.1, minAmount: 0, title: 'خصم الترحيب في أديكس 10%' },
  SAVE5: { percent: 0.05, minAmount: 10, title: 'خصم الطلبات الكبيرة 5%' },
  GOOGLE20: { percent: 0.2, minAmount: 0, title: 'خصم حساب Google الخاص 20%' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { code, amount } = req.body || {};
    const normalized = String(code || '').trim().toUpperCase();
    const coupon = COUPONS[normalized];

    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'كود الخصم غير موجود' });
    }

    if (amount !== undefined && Number(amount) < coupon.minAmount) {
      return res.status(400).json({
        valid: false,
        message: `الحد الأدنى لاستخدام الكود هو $${coupon.minAmount}`,
      });
    }

    return res.status(200).json({
      valid: true,
      code: normalized,
      percent: coupon.percent,
      title: coupon.title,
    });
  }

  return res.status(200).json({
    coupons: Object.entries(COUPONS).map(([code, c]) => ({
      code,
      percent: `${c.percent * 100}%`,
      title: c.title,
      minAmount: c.minAmount,
    })),
  });
}
