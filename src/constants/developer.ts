import { DeveloperSettings, HomePosition } from '../types';

export const homePositions: { id: HomePosition; label: string }[] = [
  { id: 'top', label: 'أعلى الصفحة' },
  { id: 'beforeServices', label: 'قبل الخدمات' },
  { id: 'afterServices', label: 'بعد الخدمات' },
  { id: 'beforeFooter', label: 'قبل Footer' },
  { id: 'footer', label: 'داخل Footer' },
];

export const developerDefaults: DeveloperSettings = {
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

export const developerIcons = [
  'code-slash-outline',
  'person-outline',
  'terminal-outline',
  'sparkles-outline',
];

export const visibilityOptions = [
  { key: 'enabled', label: 'إظهار قسم المطور' },
  { key: 'showHome', label: 'إظهار في الصفحة الرئيسية' },
  { key: 'showAbout', label: 'إظهار في صفحة من نحن' },
  { key: 'showMenu', label: 'إظهار في القائمة الرئيسية' },
  { key: 'showFooter', label: 'إظهار في Footer' },
  { key: 'showSocialIcons', label: 'إظهار أيقونات التواصل' },
  { key: 'showName', label: 'إظهار اسم المطور' },
  { key: 'showDescription', label: 'إظهار وصف المطور' },
] as const;

export const socialFields = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', hosts: ['instagram.com', 'www.instagram.com'] },
  { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok', hosts: ['tiktok.com', 'www.tiktok.com'] },
  { key: 'x', label: 'X', icon: 'close', hosts: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'] },
  { key: 'website', label: 'Website', icon: 'globe-outline', hosts: [] },
] as const;

export function safeDeveloperUrl(url: string, platform: string): string | null {
  if (typeof url !== 'string' || !url.trim() || url.length > 2048 || /[\s\0-\x1f\x7f]/.test(url.trim())) {
    return null;
  }
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port || !parsed.hostname.includes('.')) {
      return null;
    }
    if (/(^localhost$|\.local$|\.localhost$|\.internal$|^[\d.]+$|:)/i.test(parsed.hostname)) {
      return null;
    }
    const def = socialFields.find(s => s.key === platform);
    if (def && def.hosts.length > 0 && !def.hosts.includes(parsed.hostname.toLowerCase())) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export function validateDeveloperSettings(input: any): DeveloperSettings {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('بيانات إعدادات المطور غير صالحة');
  }

  const result: DeveloperSettings = { ...developerDefaults };

  for (const field of ['name', 'description', 'avatar', 'icon', 'instagram', 'tiktok', 'x', 'website', 'homePosition'] as const) {
    if (typeof input[field] === 'string') {
      result[field] = input[field].trim() as any;
    }
  }

  if (result.name.length > 100 || result.description.length > 600) {
    throw new Error('الاسم حتى 100 حرف والوصف حتى 600 حرف');
  }

  if (!developerIcons.includes(result.icon)) {
    throw new Error('اختر أيقونة مطور معتمدة');
  }

  if (
    result.avatar &&
    (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(result.avatar) ||
      result.avatar.length > 350000)
  ) {
    throw new Error('اختر صورة JPG أو PNG أو WebP أصغر من 250 كيلوبايت');
  }

  for (const { key, label } of socialFields) {
    if (result[key]) {
      const valid = safeDeveloperUrl(result[key], key);
      if (!valid) {
        throw new Error(`رابط ${label} غير صالح. استخدم رابط HTTPS مباشرًا للمنصة.`);
      }
      result[key] = valid;
    } else {
      result[key] = '';
    }
  }

  for (const { key } of visibilityOptions) {
    if (typeof input[key] === 'boolean') {
      result[key] = input[key];
    }
  }

  if (!homePositions.some(p => p.id === result.homePosition)) {
    throw new Error('اختر موضعًا صحيحًا في الرئيسية');
  }

  return result;
}

export function developerVisible(
  settings: DeveloperSettings,
  place: 'home' | 'about' | 'menu' | 'footer',
  position?: HomePosition
): boolean {
  // Critical requirement: If enabled is false, developer section disappears completely from UI!
  if (!settings.enabled) {
    return false;
  }

  if (place === 'home') {
    return Boolean(settings.showHome && settings.homePosition === position && position !== 'footer');
  }

  if (place === 'footer') {
    return Boolean(settings.showFooter || (settings.showHome && settings.homePosition === 'footer'));
  }

  if (place === 'about') {
    return Boolean(settings.showAbout);
  }

  if (place === 'menu') {
    return Boolean(settings.showMenu);
  }

  return false;
}
