
import React from 'react';
import { ChevronRight, Calendar } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  onNavigate: (page: string) => void;
  settings: SiteSettings;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, settings }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={settings.heroImage} 
          alt="Restaurant Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full mb-6 animate-fade-in">
          <span className="text-red-500 font-bold tracking-widest uppercase text-xs">Ateşin En Lezzetli Hali</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight drop-shadow-2xl">
          {settings.heroTitle.split(',').map((part, i) => (
            <React.Fragment key={i}>
              {part}{i === 0 && settings.heroTitle.includes(',') && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          {settings.heroSubtext}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center justify-center px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all group shadow-xl hover:shadow-red-600/20"
          >
            Menüyü İncele
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          <button 
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center justify-center px-10 py-5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all shadow-xl group"
          >
            <Calendar className="mr-2 group-hover:scale-110 transition-transform" size={20} />
            Rezervasyon Yap
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
