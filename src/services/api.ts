import { DeveloperSettings, Order, SupportTicket } from '../types';

const API_BASE = ''; // Same origin on web/Vercel

export const api = {
  // Google OAuth backend call
  async getGoogleOAuthUrl() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch {
      return { configured: false, authUrl: '' };
    }
  },

  async exchangeGoogleCode(code?: string, demoProfile?: { name: string; email: string }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          demoName: demoProfile?.name,
          demoEmail: demoProfile?.email,
        }),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        user: {
          id: `usr_g_${Date.now().toString(36)}`,
          email: demoProfile?.email || 'google.user@adix.store',
          name: demoProfile?.name || 'مستخدم Google',
          role: 'customer',
          provider: 'google',
        },
      };
    }
  },

  // Developer settings backend endpoints
  async getDeveloperSettings() {
    try {
      const res = await fetch(`${API_BASE}/api/developer-settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch {
      return null;
    }
  },

  async authorizeDeveloperAdmin(key: string) {
    const res = await fetch(`${API_BASE}/api/developer-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'authorize', key }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل التحقق');
    }
    return await res.json();
  },

  async saveDeveloperSettings(settings: DeveloperSettings, token?: string) {
    const res = await fetch(`${API_BASE}/api/developer-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ settings }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'تعذّر الحفظ في الخادم');
    }
    return await res.json();
  },
};
