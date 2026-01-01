
import React from 'react';
import { Award, Heart, Users, CheckCircle2, Star } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings: SiteSettings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
  const stats = [
    { icon: Award, label: "Yıllık Tecrübe", value: "25+" },
    { icon: Users, label: "Mutlu Müşteri", value: "100K+" },
    { icon: Heart, label: "Geleneksel Lezzet", value: "50+" },
    { icon: Star, label: "Başarı Ödülü", value: "15" }
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-red-700 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="grid grid-cols-10 h-full">
              {[...Array(50)].map((_, i) => (
                <Award key={i} className="text-white opacity-20" />
              ))}
           </div>
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{settings.aboutTitle}</h1>
          <p className="text-red-100 max-w-2xl mx-auto text-lg">{settings.aboutSubtext}</p>
        </div>
      </div>

      {/* Main Story */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h4 className="text-red-600 font-bold tracking-widest uppercase mb-4 text-sm">Yolculuğumuz</h4>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                Bir Aile Sofrasından <br /> Meşhur Mekanlar'a
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg mb-10">
                {settings.aboutStory.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {settings.aboutQualities.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-green-500" size={20} />
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1598511726623-d33a693630f1?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl w-full" alt="Kitchen" />
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl w-full h-48 object-cover" alt="Grill" />
                </div>
                <div className="pt-12 space-y-4">
                  <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl w-full h-64 object-cover" alt="Salad" />
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl w-full" alt="Serving" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl group-hover:bg-red-600 transition-colors mb-6">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-8">Kalite Politikamız</h2>
          <p className="text-slate-600 text-lg italic leading-relaxed">
            "Sadece en iyi malzemeleri kullanmakla yetinmiyoruz; her bir ürünü sevgiyle hazırlıyor, lezzetin sürdürülebilirliği için modern teknolojiyi geleneksel yöntemlerle buluşturuyoruz. Hijyen, kalite ve müşteri memnuniyeti bizim için asla taviz verilmeyecek değerlerdir."
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
