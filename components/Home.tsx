
import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import { Award, ChevronRight, Star, Quote, ShieldCheck, Flame, Globe, ChevronLeft, Users } from 'lucide-react';
import { MenuItem, SiteSettings } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  menuItems: MenuItem[];
  settings: SiteSettings;
}

const Home: React.FC<HomeProps> = ({ onNavigate, menuItems, settings }) => {
  const popularItems = menuItems.filter(item => item.isPopular).slice(0, 3);
  const visibleTestimonials = settings.testimonials.filter(t => t.isVisible);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Group testimonials for slider
  const itemsPerView = 3;
  const slideCount = Math.ceil(visibleTestimonials.length / itemsPerView);

  useEffect(() => {
    if (settings.testimonialLayout !== 'slider' || slideCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideCount, settings.testimonialLayout]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideCount);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);

  // Grid column class generator
  const getGridColsClass = () => {
    switch(settings.testimonialGridCols) {
      case 1: return 'md:grid-cols-1 max-w-2xl mx-auto';
      case 2: return 'md:grid-cols-2';
      case 4: return 'md:grid-cols-2 lg:grid-cols-4';
      default: return 'md:grid-cols-3'; // Default 3
    }
  };

  return (
    <div className="overflow-x-hidden">
      <Hero onNavigate={onNavigate} settings={settings} />
      
      {/* Popüler Ürünler */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h4 className="text-brand font-bold tracking-widest uppercase mb-3 text-sm">Favori Lezzetler</h4>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">En Çok Tercih Edilenler</h2>
            </div>
            <button 
              onClick={() => onNavigate('menu')}
              className="flex items-center gap-2 text-brand font-bold hover:gap-3 transition-all text-lg group"
            >
              Tüm Menüyü Gör <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {popularItems.map((item) => (
              <div key={item.id} className="group cursor-pointer" onClick={() => onNavigate('menu')}>
                <div className="relative h-[500px] rounded-[48px] overflow-hidden mb-6 shadow-2xl group-hover:shadow-brand/20 transition-all duration-500">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-10">
                    <div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-brand text-brand" />)}
                      </div>
                      <h3 className="text-white font-bold text-3xl mb-2 font-serif">{item.name}</h3>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2 font-light">{item.description}</p>
                      <span className="inline-block bg-brand text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">Hemen Dene →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-brand font-bold tracking-widest uppercase mb-3 text-sm">Neden Biz?</h4>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Lezzetimizin Sırrı</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 text-center shadow-sm hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-brand/5 text-brand rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-brand group-hover:text-white transition-all">
                <Flame size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4">Gerçek Odun Ateşi</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Kebaplarımızı sadece meşe odunu ateşinde, zırh kıymasıyla hazırlıyoruz.</p>
            </div>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 text-center shadow-sm hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-brand/5 text-brand rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-brand group-hover:text-white transition-all">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4">%100 Doğal Ürünler</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Etlerimizden baharatlarımıza kadar her şey en doğal haliyle yerinden geliyor.</p>
            </div>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 text-center shadow-sm hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-brand/5 text-brand rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-brand group-hover:text-white transition-all">
                <Award size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4">Ustalık ve Tecrübe</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Mutfak ekibimiz 25 yılı aşkın tecrübesiyle her tabağa ruhunu katıyor.</p>
            </div>
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 text-center shadow-sm hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-brand/5 text-brand rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-brand group-hover:text-white transition-all">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4">Güler Yüzlü Hizmet</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Sizleri bir müşteri değil, evimize gelen bir misafir gibi ağırlıyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      {settings.testimonialsEnabled && visibleTestimonials.length > 0 && (
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h4 className="text-brand font-bold tracking-widest uppercase mb-3 text-sm">Misafir Yorumları</h4>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Sizden Gelenler</h2>
              {settings.googleMapsUrl && (
                <a href={settings.googleMapsUrl} target="_blank" className="inline-flex items-center gap-2 mt-4 text-blue-600 font-bold hover:underline">
                  <Globe size={16}/> Google'da Bizi Değerlendirin
                </a>
              )}
            </div>

            {/* Layout: Slider */}
            {settings.testimonialLayout === 'slider' ? (
              <div className="relative">
                <div className="overflow-hidden px-4">
                  <div 
                    className="flex transition-transform duration-1000 ease-in-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {[...Array(slideCount)].map((_, slideIdx) => (
                      <div key={slideIdx} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {visibleTestimonials.slice(slideIdx * itemsPerView, (slideIdx + 1) * itemsPerView).map((t) => (
                          <div key={t.id} className="bg-slate-50 p-10 rounded-[48px] relative group hover:bg-brand transition-all duration-500 border border-slate-100 shadow-sm hover:shadow-2xl">
                            <Quote className="text-brand/10 absolute top-8 right-8 group-hover:text-white/10 transition-colors" size={60} />
                            <div className="flex gap-1 mb-6">
                              {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-brand text-brand group-hover:fill-white group-hover:text-white" />)}
                            </div>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed italic group-hover:text-white transition-colors">"{t.comment}"</p>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center font-bold text-brand group-hover:bg-white group-hover:text-brand">
                                {t.source === 'google' ? <Globe size={20}/> : t.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-white">{t.name}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/60">
                                  {t.source === 'google' ? 'Google Yorum' : 'Mutlu Misafir'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {slideCount > 1 && (
                  <>
                    <button onClick={prevSlide} className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-brand transition-all z-10 border">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-brand transition-all z-10 border">
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Layout: Grid */
              <div className={`grid grid-cols-1 ${getGridColsClass()} gap-8`}>
                {visibleTestimonials.map((t) => (
                  <div key={t.id} className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                     <div className="flex justify-between items-start mb-4">
                       <div className="flex gap-1">
                          {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-brand text-brand" />)}
                       </div>
                       <Quote size={24} className="text-slate-200" />
                     </div>
                     <p className="text-slate-600 mb-6 italic">"{t.comment}"</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold shadow-sm">
                           {t.source === 'google' ? <Globe size={16} className="text-blue-500"/> : <Users size={16}/>}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                           <span className="text-[10px] uppercase font-black text-slate-400">{t.source === 'google' ? 'Google' : 'Yerel'}</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Alt Banner */}
      <div className="relative py-40 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
          alt="Texture"
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h3 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight uppercase">Meşhur Lezzet Durağınızda Yeriniz Hazır</h3>
          <p className="text-slate-300 text-xl mb-12 font-light max-w-2xl mx-auto">Sizleri aile sıcaklığında bir akşam yemeğine davet ediyoruz. Hemen yerinizi ayırtın.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={() => onNavigate('contact')} className="px-14 py-6 bg-brand hover:bg-white hover:text-brand text-white font-black rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95 text-lg uppercase">
              Rezervasyon Yapın
            </button>
            <button onClick={() => onNavigate('menu')} className="px-14 py-6 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-black rounded-full transition-all text-lg uppercase">
              Menüyü İnceleyin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
