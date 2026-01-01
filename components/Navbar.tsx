
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingBag, LayoutGrid, ChevronDown } from 'lucide-react';
import { CategoryItem, SiteSettings } from '../types';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string, category?: string | 'Tümü') => void;
  categories: CategoryItem[];
  settings: SiteSettings;
  cartCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, categories, settings, cartCount, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50 || activePage !== 'home');
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  // Handle cart bounce animation when count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount + 1 >= 3) {
      onNavigate('admin');
      setClickCount(0);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      return;
    }

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      setClickCount(0);
      onNavigate('home');
    }, 500);
  };

  const navLinks = [
    { name: 'Anasayfa', id: 'home' },
    { name: 'Menü', id: 'menu' },
    { name: 'Hakkımızda', id: 'about' },
    ...(settings.galleryEnabled ? [{ name: 'Görseller', id: 'gallery' }] : []),
    { name: 'İletişim', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
    setIsCatOpen(false);
  };

  const handleCategoryClick = (catName: string) => {
    onNavigate('menu', catName);
    setIsCatOpen(false);
    setIsOpen(false);
  };

  const isDark = scrolled || activePage !== 'home';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isDark ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center cursor-pointer select-none" onClick={handleLogoClick}>
              <h1 className={`text-2xl font-bold transition-colors font-serif ${isDark ? 'text-red-700' : 'text-white'}`}>
                {settings.restaurantName}
              </h1>
            </div>

            <div className="hidden lg:block relative" ref={catRef}>
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg"
              >
                <LayoutGrid size={20} />
                Kategoriler
                <ChevronDown size={16} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-3 max-h-[70vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors border-b border-slate-50 last:border-none group"
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                        <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-red-700 transition-colors">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-bold transition-colors hover:text-red-500 relative py-2 ${
                  isDark ? 'text-slate-800' : 'text-white'
                } ${activePage === link.id ? 'text-red-600' : ''}`}
              >
                {link.name}
              </button>
            ))}
            
            <button 
              onClick={onOpenCart} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all relative ${
                cartBounce ? 'scale-110' : ''
              } ${
                isDark 
                ? 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white' 
                : 'border-white text-white hover:bg-white hover:text-red-700'
              }`}
            >
              <ShoppingBag size={18} />
              <span className="text-sm font-bold">Sepetim</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={onOpenCart} 
              className={`relative p-2 rounded-md ${isDark ? 'text-slate-800' : 'text-white'}`}
            >
              <ShoppingBag size={28} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isDark ? 'text-slate-800' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-slate-100 h-screen overflow-y-auto pb-20 animate-in slide-in-from-right duration-300">
          <div className="px-4 pt-6 pb-3 space-y-6">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="col-span-2 flex items-center justify-between gap-2 bg-red-600 text-white px-5 py-4 rounded-xl font-bold shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid size={24} />
                  <span>Kategoriler</span>
                </div>
                <ChevronDown size={20} />
              </button>
            </div>

            {isCatOpen && (
              <div className="grid grid-cols-1 gap-2 animate-in fade-in duration-200">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-red-50 transition-colors"
                  >
                    <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain" />
                    <span className="font-bold text-slate-800">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left px-4 py-4 text-xl font-bold rounded-xl ${
                    activePage === link.id ? 'bg-red-50 text-red-700' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
            
            <div className="pt-8 border-t border-slate-100">
               <button onClick={onOpenCart} className="w-full flex items-center justify-center gap-3 px-3 py-5 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-xl">
                  <ShoppingBag size={24} />
                  Sepetimi Gör ({cartCount})
               </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
