
import React, { useState, useEffect } from 'react';
import { MenuItem, CategoryItem } from '../types';
import { Utensils, LayoutGrid, PlusCircle, Search, Sparkles as SparkleIcon } from 'lucide-react';

interface MenuSectionProps {
  initialCategory?: string | 'Tümü';
  menuItems: MenuItem[];
  categories: CategoryItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ initialCategory = 'Tümü', menuItems, categories, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string | 'Tümü'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'Tümü' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryNames = ['Tümü', ...categories.map(c => c.name)];

  return (
    <div className="pt-20 bg-[#fafafa] min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover grayscale" alt="Background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 uppercase tracking-tight">Lezzet Menümüz</h1>
          <div className="w-32 h-1 bg-brand mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-300 max-w-2xl mx-auto text-xl font-light">Usta ellerden çıkan geleneksel reçeteler ve modern sunumlar.</p>
        </div>
      </div>

      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search and Filters Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">Kategoriler</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">En taze malzemelerle</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Lezzet ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-brand transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-20">
            {categoryNames.map((catName) => {
              const catInfo = categories.find(c => c.name === catName);
              return (
                <button
                  key={catName}
                  onClick={() => {
                    setActiveCategory(catName);
                    setSearchQuery('');
                  }}
                  className={`group flex flex-col items-center justify-center p-6 rounded-[32px] transition-all duration-300 border-2 ${
                    activeCategory === catName 
                    ? 'bg-brand text-white border-brand shadow-xl shadow-brand/20 -translate-y-2' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-brand/30 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 ${activeCategory === catName ? 'bg-white/20' : 'bg-slate-50'}`}>
                    {catName === 'Tümü' ? (
                      <Utensils size={24} className={activeCategory === catName ? 'text-white' : 'text-brand'} />
                    ) : (
                      <img 
                        src={catInfo?.icon} 
                        alt={catName} 
                        className={`w-10 h-10 object-contain ${activeCategory === catName ? 'brightness-0 invert' : ''}`} 
                      />
                    )}
                  </div>
                  <span className={`text-sm font-bold text-center leading-tight ${activeCategory === catName ? 'text-white' : 'text-slate-700'}`}>
                    {catName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Title */}
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-serif font-bold text-slate-900">
              {searchQuery ? `"${searchQuery}" için sonuçlar` : activeCategory}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
            <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
              <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{filteredItems.length} Ürün</span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="group flex flex-col h-full bg-white rounded-[40px] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  {item.isPopular && (
                    <div className="absolute top-6 left-6 bg-brand text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2">
                      <SparkleIcon size={12} fill="currentColor" /> Popüler
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand transition-colors mb-2 leading-tight font-serif">{item.name}</h3>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand transition-colors">{item.category}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="bg-brand/5 text-brand border border-brand/10 font-black text-xl px-5 py-2.5 rounded-2xl whitespace-nowrap shadow-sm">
                        {item.price} TL
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3 font-light">
                    {item.description}
                  </p>
                  
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-full py-5 bg-slate-900 hover:bg-brand text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-brand/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <PlusCircle size={18} /> Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-40 rounded-[60px] bg-white border-2 border-dashed border-slate-100 shadow-inner">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Search className="text-slate-200" size={48} />
              </div>
              <p className="text-slate-400 font-bold text-2xl mb-4 font-serif">Aradığınız Lezzet Bulunamadı</p>
              <button 
                onClick={() => {
                  setActiveCategory('Tümü');
                  setSearchQuery('');
                }} 
                className="text-brand font-black uppercase tracking-widest text-sm hover:underline"
              >
                Tüm Menüyü Göster
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuSection;
