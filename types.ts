
export enum MenuCategory {
  Corbalar = 'Çorbalar',
  Mezeler = 'Mezeler',
  Kebaplar = 'Kebaplar',
  Durumler = 'Dürümler',
  SpecialKebaplar = 'Special Kebaplar',
  Donerler = 'Dönerler',
  Lahmacunlar = 'Lahmacunlar',
  KaradenizPideleri = 'Karadeniz Pideleri',
  Salatalar = 'Salatalar',
  Tatlilar = 'Tatlılar',
  Icecekler = 'İçecekler',
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date?: string;
  source: 'google' | 'local';
  isVisible: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'super' | 'admin';
}

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface SiteSettings {
  // SEO Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  cuisineType: string;
  priceRange: string; // $, $$, $$$

  aiAssistantEnabled: boolean;
  aiAssistantPosition: WidgetPosition;
  whatsappEnabled: boolean;
  whatsappPosition: WidgetPosition;
  whatsappNumber: string;
  restaurantName: string;
  brandColor: string; 
  brandFont: string;
  // Hero Section
  heroTitle: string;
  heroSubtext: string;
  heroImage: string;
  // About Page
  aboutTitle: string;
  aboutSubtext: string;
  aboutStory: string;
  aboutQualities: string[];
  // Social Media
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  // Contact & Map
  phone: string;
  address: string;
  googleMapsUrl: string;
  workingHours: string;
  // Gallery Settings
  galleryEnabled: boolean;
  galleryLayout: 'grid' | 'slider' | 'masonry';
  galleryImages: string[];
  // Testimonial Settings
  testimonialsEnabled: boolean;
  testimonials: Testimonial[];
  testimonialLayout: 'slider' | 'grid'; // Yeni özellik
  testimonialGridCols: number; // Yeni özellik (1-4 arası)
}
