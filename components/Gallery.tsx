
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface GalleryProps {
  settings: SiteSettings;
}

const Gallery: React.FC<GalleryProps> = ({ settings }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!settings.galleryEnabled) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % settings.galleryImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + settings.galleryImages.length) % settings.galleryImages.length);
  };

  const renderLayout = () => {
    switch (settings.galleryLayout) {
      case 'slider':
        return (
          <div className="relative h-[600px] group">
            <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={settings.galleryImages[currentIndex]} 
                alt="Gallery" 
                className="w-full h-full object-cover transition-all duration-700" 
              />
            </div>
            <button 
              onClick={handlePrev} 
              className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNext} 
              className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={32} />
            </button>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
              {settings.galleryImages.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-white/50'}`} />
              ))}
            </div>
          </div>
        );
      case 'masonry':
        return (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {settings.galleryImages.map((img, i) => (
              <div 
                key={i} 
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-[32px] shadow-lg"
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt="" className="w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/40 transition-colors flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all" size={32} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'grid':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.galleryImages.map((img, i) => (
              <div 
                key={i} 
                className="aspect-square relative group cursor-pointer overflow-hidden rounded-[32px] shadow-lg"
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-red-600/40 transition-colors flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="pt-20 bg-white">
      <div className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 uppercase tracking-tight">Görsellerimiz</h1>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {renderLayout()}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button onClick={() => setSelectedImage(null)} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in duration-300" alt="Full View" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
