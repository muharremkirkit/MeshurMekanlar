
import { MenuItem, MenuCategory, Testimonial } from './types';

export const CATEGORY_ICONS: Record<MenuCategory, string> = {
  [MenuCategory.Corbalar]: 'https://cdn-icons-png.flaticon.com/128/3480/3480438.png',
  [MenuCategory.Mezeler]: 'https://cdn-icons-png.flaticon.com/128/2276/2276931.png',
  [MenuCategory.Kebaplar]: 'https://cdn-icons-png.flaticon.com/128/14603/14603248.png',
  [MenuCategory.Durumler]: 'https://cdn-icons-png.flaticon.com/128/575/575454.png',
  [MenuCategory.SpecialKebaplar]: 'https://cdn-icons-png.flaticon.com/128/3141/3141021.png',
  [MenuCategory.Donerler]: 'https://cdn-icons-png.flaticon.com/128/5000/5000030.png',
  [MenuCategory.Lahmacunlar]: 'https://cdn-icons-png.flaticon.com/128/1404/1404945.png',
  [MenuCategory.KaradenizPideleri]: 'https://cdn-icons-png.flaticon.com/128/10410/10410408.png',
  [MenuCategory.Salatalar]: 'https://cdn-icons-png.flaticon.com/128/2403/2403197.png',
  [MenuCategory.Tatlilar]: 'https://cdn-icons-png.flaticon.com/128/992/992717.png',
  [MenuCategory.Icecekler]: 'https://cdn-icons-png.flaticon.com/128/2738/2738730.png',
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Adana Kebap',
    description: 'Zırh kıymasıyla hazırlanan, közlenmiş biber ve domates eşliğinde servis edilen klasik acılı kebap.',
    price: 340,
    category: MenuCategory.Kebaplar,
    image: 'https://images.unsplash.com/photo-1662116765994-1e22240902c5?auto=format&fit=crop&q=80&w=600',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Mercimek Çorbası',
    description: 'Tereyağlı sos eşliğinde servis edilen süzme mercimek çorbası.',
    price: 95,
    category: MenuCategory.Corbalar,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    name: 'Kuşbaşılı Pide',
    description: 'Özel hamur üzerine ince kıyılmış dana eti ve taze sebzeler.',
    price: 290,
    category: MenuCategory.KaradenizPideleri,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    name: 'Kıymalı Lahmacun',
    description: 'Çıtır çıtır, bol malzemeli geleneksel lahmacun.',
    price: 85,
    category: MenuCategory.Lahmacunlar,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '5',
    name: 'Künefe',
    description: 'Hatay peyniri ile hazırlanan, şerbetli ve bol fıstıklı sıcak tatlı.',
    price: 180,
    category: MenuCategory.Tatlilar,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600',
    isPopular: true,
  },
  {
    id: '6',
    name: 'Şakşuka',
    description: 'Kızartılmış sebzelerin domates sosuyla eşsiz buluşması.',
    price: 110,
    category: MenuCategory.Mezeler,
    image: 'https://images.unsplash.com/photo-1541518763669-279998844e83?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '7',
    name: 'Adana Dürüm',
    description: 'Lavaş içerisine sarılmış, soğanlı ve sumaklı Adana kebap.',
    price: 220,
    category: MenuCategory.Durumler,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '8',
    name: 'Gavurdağı Salatası',
    description: 'Nar ekşili, bol cevizli ve ince kıyılmış taze bahçe sebzeleri.',
    price: 140,
    category: MenuCategory.Salatalar,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
  }
];

// Fix: Converted numerical IDs to strings and added missing required fields 'source' and 'isVisible' to match Testimonial interface definition
export const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: "Ahmet Y.", comment: "Hayatımda yediğim en iyi Adana kebaptı. Servis hızı harika.", rating: 5, source: 'local', isVisible: true },
  { id: '2', name: "Elif S.", comment: "Pideleri çok çıtır ve malzemesi bol. Ailecek sürekli geliyoruz.", rating: 5, source: 'local', isVisible: true },
  { id: '3', name: "Murat K.", comment: "Mezeler taze, künefe efsane. Fiyat/performans başarılı.", rating: 4, source: 'local', isVisible: true },
];
