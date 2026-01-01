
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, ArrowUp, MapPin, Phone, Mail } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const socials = [
    { icon: Facebook, url: settings.facebookUrl, color: 'hover:bg-blue-600' },
    { icon: Instagram, url: settings.instagramUrl, color: 'hover:bg-pink-600' },
    { icon: Twitter, url: settings.twitterUrl, color: 'hover:bg-sky-500' },
    { icon: Youtube, url: settings.youtubeUrl, color: 'hover:bg-red-600' },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white font-serif">{settings.restaurantName}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              1998'den beri değişmeyen lezzet kalitesiyle İstanbul'un kalbinde hizmet veriyoruz. Geleneksel kebap kültürünü modern sunumlarla birleştirerek misafirlerimizi ağırlıyoruz.
            </p>
            <div className="flex space-x-4">
              {socials.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center transition-all ${social.color}`}>
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-brand">Hızlı Erişim</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-brand transition-colors text-left flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-brand"></span> Ana Sayfa</button></li>
              <li><button onClick={() => onNavigate('menu')} className="hover:text-brand transition-colors text-left flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-brand"></span> Menümüz</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-brand transition-colors text-left flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-brand"></span> Hakkımızda</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-brand transition-colors text-left flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-brand"></span> Rezervasyon</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-brand">Bize Ulaşın</h4>
            <ul className="space-y-6 text-slate-400 text-sm">
              <li className="flex gap-4">
                <MapPin className="text-brand shrink-0" size={20} />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-brand shrink-0" size={20} />
                <span>{settings.phone}</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-brand shrink-0" size={20} />
                <span>info@meshurmekanlar.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-brand">Çalışma Saatleri</h4>
            <div className="space-y-4 p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
               <div className="flex justify-between items-center">
                 <span className="text-slate-400">Pazartesi - Cuma</span>
                 <span className="text-white font-bold">{settings.workingHours}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-400">Cumartesi</span>
                 <span className="text-white font-bold">{settings.workingHours}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-400">Pazar</span>
                 <span className="text-brand font-bold">{settings.workingHours}</span>
               </div>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs">
          <p>© 2024 {settings.restaurantName}. Lezzetle Tasarlanmıştır.</p>
          <div className="flex gap-8">
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-2 hover:text-white transition-colors uppercase font-bold tracking-widest">
                En Başa Dön <ArrowUp size={16} />
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
