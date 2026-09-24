import type { VercelRequest, VercelResponse } from '@vercel/node';

// Backend Orders Controller
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      orders: [],
      total: 0,
    });
  }

  if (req.method === 'POST') {
    const { product, target, amount, kind, method, transaction, proof } = req.body || {};
    if (!product || !target || amount === undefined) {
      return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
    }

    const orderId = `ADX-${Date.now().toString().slice(-7)}`;
    const newOrder = {
      id: orderId,
      product,
      target,
      amount: Number(amount),
      kind: kind || 'order',
      method: method || 'sham',
      status: method === 'wallet' ? 'processing' : 'review',
      transaction,
      proof,
      date: new Date().toISOString(),
    };

    return res.status(201).json({ success: true, order: newOrder });
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {};
    if (!id || !status) {
      return res.status(400).json({ error: 'معرّف الطلب والحالة مطلوبان' });
    }
    return res.status(200).json({ success: true, id, status });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
