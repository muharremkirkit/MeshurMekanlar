
import { MenuItem, CategoryItem, SiteSettings, AdminUser } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  MENU: 'mm_menu',
  CATEGORIES: 'mm_categories',
  SETTINGS: 'mm_settings',
  ADMINS: 'mm_admins'
};

export const dataService = {
  // --- AYARLAR ---
  async getSettings(): Promise<SiteSettings | null> {
    if (supabase) {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (!error && data) return data;
    }
    const localData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return localData ? JSON.parse(localData) : null;
  },

  async saveSettings(settings: SiteSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    if (supabase) {
      await supabase.from('settings').upsert({ id: 1, ...settings });
    }
  },

  // --- MENÜ ÖĞELERİ ---
  async getMenuItems(): Promise<MenuItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    const localData = localStorage.getItem(STORAGE_KEYS.MENU);
    return localData ? JSON.parse(localData) : [];
  },

  async saveMenuItems(items: MenuItem[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    if (supabase) {
      // Toplu güncelleme için önce mevcutları temizleyip sonra ekleme veya upsert mantığı kullanılabilir
      // SaaS yapısında her restoranın kendi ID'si olur, biz şimdilik basit tutuyoruz
      await supabase.from('menu_items').upsert(items);
    }
  },

  // --- KATEGORİLER ---
  async getCategories(): Promise<CategoryItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data) return data;
    }
    const localData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return localData ? JSON.parse(localData) : [];
  },

  async saveCategories(categories: CategoryItem[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    if (supabase) {
      await supabase.from('categories').upsert(categories);
    }
  },

  // --- YÖNETİCİLER ---
  async getAdmins(): Promise<AdminUser[]> {
    if (supabase) {
      const { data, error } = await supabase.from('admins').select('*');
      if (!error && data) return data;
    }
    const localData = localStorage.getItem(STORAGE_KEYS.ADMINS);
    return localData ? JSON.parse(localData) : [];
  },

  async saveAdmins(admins: AdminUser[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    if (supabase) {
      await supabase.from('admins').upsert(admins);
    }
  },

  // --- GÖRSEL YÜKLEME ---
  async uploadImage(file: File): Promise<string> {
    if (supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('restaurant_images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('restaurant_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    }

    // Supabase yoksa base64 devam
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};
