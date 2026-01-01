
import { MenuItem, CategoryItem, SiteSettings, AdminUser } from '../types';

/**
 * Bu servis, uygulamanın veri kaynağını yönetir.
 * Geliştirme aşamasında localStorage kullanır, 
 * Çevre değişkenleri tanımlandığında Supabase'e geçiş yapar.
 */

const STORAGE_KEYS = {
  MENU: 'mm_menu',
  CATEGORIES: 'mm_categories',
  SETTINGS: 'mm_settings',
  ADMINS: 'mm_admins'
};

export const dataService = {
  // --- AYARLAR ---
  async getSettings(): Promise<SiteSettings | null> {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },
  async saveSettings(settings: SiteSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Buraya Supabase update kodu gelecek: await supabase.from('settings').update(settings).eq('id', 1);
  },

  // --- MENÜ ÖĞELERİ ---
  async getMenuItems(): Promise<MenuItem[]> {
    const data = localStorage.getItem(STORAGE_KEYS.MENU);
    return data ? JSON.parse(data) : [];
  },
  async saveMenuItems(items: MenuItem[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    // Supabase: await supabase.from('menu').upsert(items);
  },

  // --- KATEGORİLER ---
  async getCategories(): Promise<CategoryItem[]> {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },
  async saveCategories(categories: CategoryItem[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // --- YÖNETİCİLER ---
  async getAdmins(): Promise<AdminUser[]> {
    const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
    return data ? JSON.parse(data) : [];
  },
  async saveAdmins(admins: AdminUser[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
  },

  // --- GÖRSEL YÜKLEME ---
  async uploadImage(file: File): Promise<string> {
    // Şimdilik base64 dönüyoruz, SaaS versiyonunda Supabase Bucket URL dönecek
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};
