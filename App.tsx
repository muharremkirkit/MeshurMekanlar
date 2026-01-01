
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MenuSection from './components/MenuSection';
import About from './components/About';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import WhatsAppSupport from './components/WhatsAppSupport';
import AdminPanel from './components/Admin/AdminPanel';
import CartModal from './components/CartModal';
import { MenuItem, CategoryItem, SiteSettings, AdminUser, CartItem } from './types';
import { MENU_ITEMS, CATEGORY_ICONS } from './constants';
import { dataService } from './services/dataService';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | 'Tümü'>('Tümü');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    seoTitle: 'Meşhur Mekanlar | Geleneksel Kebap & Türk Mutfağı',
    seoDescription: 'İstanbul\'un kalbinde en taze malzemelerle hazırlanan geleneksel kebaplar, pideler ve mezeler.',
    seoKeywords: 'kebap, lahmacun, pide, restoran',
    cuisineType: 'Turkish, Grill, Kebab',
    priceRange: '$$',
    aiAssistantEnabled: true,
    aiAssistantPosition: 'bottom-right',
    whatsappEnabled: true,
    whatsappPosition: 'bottom-left',
    whatsappNumber: '905555555555',
    restaurantName: 'MEŞHUR MEKANLAR',
    brandColor: '#e11d48',
    brandFont: "'Playfair Display', serif",
    heroTitle: 'Geleneksel Tatlar, Unutulmaz Anlar',
    heroSubtext: 'Usta ellerden çıkan gerçek kebap lezzeti, Meşhur Mekanlar\'da sizi bekliyor.',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920',
    aboutTitle: 'Hakkımızda',
    aboutSubtext: '1998\'den bu yana sönmeyen lezzet ateşi.',
    aboutStory: 'Hikayemiz, 1998 yılında kurucumuzun vizyonuyla başladı.',
    aboutQualities: ["Günlük Taze Kesim", "Meşe Odunu", "Doğal Baharatlar"],
    facebookUrl: '#',
    instagramUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    phone: '0(212) 555 44 33',
    address: 'Cumhuriyet Caddesi, No:42 Beşiktaş, İstanbul',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.6105307374734!2d28.98144!3d41.04285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAyJzM0LjMiTiAyOMKwNTgnNTMuMiJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str',
    workingHours: '11:00 - 23:30',
    galleryEnabled: true,
    galleryLayout: 'grid',
    galleryImages: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541518763669-279998844e83?auto=format&fit=crop&q=80&w=800'
    ],
    testimonialsEnabled: true,
    testimonials: []
  });

  // Veri Yükleme Operasyonu (SaaS Hazırlığı)
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const [savedMenu, savedCats, savedSettings, savedAdmins] = await Promise.all([
          dataService.getMenuItems(),
          dataService.getCategories(),
          dataService.getSettings(),
          dataService.getAdmins()
        ]);

        if (savedMenu.length) setMenuItems(savedMenu); else setMenuItems(MENU_ITEMS);
        
        if (savedCats.length) setCategories(savedCats);
        else {
          const defaultCats = Object.entries(CATEGORY_ICONS).map(([name, icon], idx) => ({
            id: idx.toString(), name, icon
          }));
          setCategories(defaultCats);
        }

        if (savedAdmins.length) setAdminUsers(savedAdmins);
        else setAdminUsers([{ id: '1', username: 'admin', email: 'admin@admin.com', password: 'admin', role: 'super' }]);

        if (savedSettings) setSettings(prev => ({...prev, ...savedSettings}));
      } catch (e) {
        console.error("Başlatma hatası:", e);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Veri Kaydetme (Dinamik)
  useEffect(() => {
    if (!isLoading) {
      dataService.saveMenuItems(menuItems);
      dataService.saveCategories(categories);
      dataService.saveSettings(settings);
      dataService.saveAdmins(adminUsers);
    }
  }, [menuItems, categories, settings, adminUsers, isLoading]);

  useEffect(() => {
    document.title = settings.seoTitle;
    document.documentElement.style.setProperty('--brand-color', settings.brandColor);
  }, [settings]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleNavigate = (page: string, category?: string | 'Tümü') => {
    setActivePage(page);
    if (category) setSelectedCategory(category);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-serif font-bold animate-pulse">Lezzetler Hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <style>{`
        :root { --brand-color: ${settings.brandColor}; --brand-font: ${settings.brandFont}; }
        h1, h2, h3, h4, h5, h6, .font-serif { font-family: var(--brand-font) !important; }
        .bg-brand { background-color: var(--brand-color) !important; }
        .text-brand { color: var(--brand-color) !important; }
        .border-brand { border-color: var(--brand-color) !important; }
      `}</style>

      {activePage !== 'admin' && (
        <Navbar 
          activePage={activePage} onNavigate={handleNavigate} 
          categories={categories} settings={settings} 
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}
      
      <main>
        {activePage === 'home' && <Home onNavigate={handleNavigate} menuItems={menuItems} settings={settings} />}
        {activePage === 'menu' && <MenuSection initialCategory={selectedCategory} menuItems={menuItems} categories={categories} onAddToCart={addToCart} />}
        {activePage === 'about' && <About settings={settings} />}
        {activePage === 'contact' && <Contact settings={settings} />}
        {activePage === 'gallery' && <Gallery settings={settings} />}
        {activePage === 'admin' && (
          <AdminPanel 
            menuItems={menuItems} setMenuItems={setMenuItems} 
            categories={categories} setCategories={setCategories}
            adminUsers={adminUsers} setAdminUsers={setAdminUsers}
            settings={settings} setSettings={setSettings}
            onLogout={() => handleNavigate('home')}
          />
        )}
      </main>

      {activePage !== 'admin' && <Footer onNavigate={handleNavigate} settings={settings} />}
      {activePage !== 'admin' && settings.aiAssistantEnabled && <AIAssistant menuItems={menuItems} settings={settings} />}
      {activePage !== 'admin' && settings.whatsappEnabled && <WhatsAppSupport settings={settings} />}

      <CartModal 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        cart={cart} updateQuantity={(id, delta) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))}
        removeFromCart={(id) => setCart(cart.filter(i => i.id !== id))}
        clearCart={() => setCart([])}
      />
    </div>
  );
}

export default App;
