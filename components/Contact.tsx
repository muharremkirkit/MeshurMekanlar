
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock as ClockIcon, MessageSquare, CheckCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface ContactProps {
  settings: SiteSettings;
}

const Contact: React.FC<ContactProps> = ({ settings }) => {
  const [formSent, setFormSent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 uppercase">İletişim & Konum</h1>
          <div className="w-20 h-1 bg-brand mx-auto mb-6"></div>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Sizi ağırlamak için sabırsızlanıyoruz. Rezervasyon ve sorularınız için bize istediğiniz kanaldan ulaşabilirsiniz.</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Info Cards */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl text-center group hover:bg-brand transition-all duration-500">
              <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-brand transition-colors">
                <MapPin size={32} />
              </div>
              <h4 className="text-xl font-bold mb-4 group-hover:text-white">Adresimiz</h4>
              <p className="text-slate-500 group-hover:text-white/80 leading-relaxed font-medium">
                {settings.address}
              </p>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl text-center group hover:bg-brand transition-all duration-500">
              <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-brand transition-colors">
                <Phone size={32} />
              </div>
              <h4 className="text-xl font-bold mb-4 group-hover:text-white">Telefon & WhatsApp</h4>
              <p className="text-slate-500 group-hover:text-white/80 leading-relaxed font-medium">
                Rezervasyon: {settings.phone} <br />
                Sipariş: +{settings.whatsappNumber}
              </p>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl text-center group hover:bg-brand transition-all duration-500">
              <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-brand transition-colors">
                <ClockIcon size={32} />
              </div>
              <h4 className="text-xl font-bold mb-4 group-hover:text-white">Çalışma Saatleri</h4>
              <p className="text-slate-500 group-hover:text-white/80 leading-relaxed font-medium">
                Pazartesi - Pazar <br /> 
                {settings.workingHours}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[60px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand opacity-10 rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                {formSent ? (
                  <div className="py-20 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand/20">
                      <CheckCircle size={48} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-4">Mesajınız Alındı!</h3>
                    <p className="text-slate-400 mb-8">En kısa sürede sizinle iletişime geçeceğiz.</p>
                    <button 
                      onClick={() => setFormSent(false)}
                      className="text-brand font-bold uppercase tracking-widest text-sm hover:underline"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-serif font-bold mb-8">Rezervasyon & Mesaj</h3>
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">İsim Soyisim</label>
                          <input required type="text" className="w-full bg-slate-800 border-2 border-transparent focus:border-brand rounded-2xl px-6 py-5 text-sm outline-none transition-all" placeholder="Adınız" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Telefon</label>
                          <input required type="tel" className="w-full bg-slate-800 border-2 border-transparent focus:border-brand rounded-2xl px-6 py-5 text-sm outline-none transition-all" placeholder="0(5XX) XXX XX XX" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">E-posta</label>
                        <input required type="email" className="w-full bg-slate-800 border-2 border-transparent focus:border-brand rounded-2xl px-6 py-5 text-sm outline-none transition-all" placeholder="email@örnek.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mesajınız veya Kişi Sayısı</label>
                        <textarea required rows={4} className="w-full bg-slate-800 border-2 border-transparent focus:border-brand rounded-[32px] px-6 py-5 text-sm outline-none resize-none transition-all" placeholder="Rezervasyon tarihi, kişi sayısı veya diğer notlarınız..."></textarea>
                      </div>
                      <button className="w-full bg-brand hover:bg-white hover:text-brand text-white font-bold py-6 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-brand/10">
                        <Send size={20} /> Hemen Gönder
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Map and Extra */}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Konumumuz</h3>
                <div className="h-[450px] rounded-[60px] overflow-hidden shadow-2xl border border-slate-100 group">
                  <iframe 
                    src={settings.googleMapsUrl} 
                    className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                    title="Google Maps"
                  ></iframe>
                </div>
              </div>
              
              <div className="bg-brand/5 p-10 rounded-[48px] border border-brand/10 flex items-start gap-6">
                <div className="w-16 h-16 bg-brand text-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand/20">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 text-xl">Anında Destek mi Lazım?</h4>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">WhatsApp üzerinden saniyeler içinde cevap alabilir, hızlıca sipariş veya rezervasyon oluşturabilirsiniz.</p>
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="inline-block bg-brand text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-900 transition-colors">
                    WhatsApp'tan Yazın
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
