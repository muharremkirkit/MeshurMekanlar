
import React, { useState } from 'react';
import { 
  Utensils, Tags, Settings, Trash2, Edit, X, Image as ImageIcon,
  FileText, Users, Key, PlusCircle, Upload, LogOut, MessageSquare,
  Star, Globe, Loader2, Eye, EyeOff, Layout, MapPin, Save, Zap,
  Search, Grid, Columns, PlayCircle, Palette, Phone, MessageCircle, Bot,
  Info, CheckCircle2, Clock
} from 'lucide-react';
import { MenuItem, CategoryItem, SiteSettings, AdminUser, Testimonial } from '../../types';
import { fetchGoogleReviews } from '../../services/geminiService';

interface AdminPanelProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  categories: CategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  menuItems, setMenuItems, categories, setCategories, adminUsers, setAdminUsers, settings, setSettings, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'pages' | 'gallery' | 'users' | 'settings' | 'testimonials' | 'seo'>('products');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLink, setGoogleLink] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = adminUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) setIsLoggedIn(true); else setLoginError('Hatalı giriş bilgileri.');
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category' | 'hero' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      if (target === 'gallery') {
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const base64 = await toBase64(files[i]);
          newImages.push(base64);
        }
        setSettings({ ...settings, galleryImages: [...settings.galleryImages, ...newImages] });
      } else {
        const base64 = await toBase64(files[0]);
        if (target === 'product' && editingItem) setEditingItem({ ...editingItem, image: base64 });
        if (target === 'category' && editingCat) setEditingCat({ ...editingCat, icon: base64 });
        if (target === 'hero') setSettings({ ...settings, heroImage: base64 });
      }
    } catch (err) { console.error(err); }
  };

  const handleImport = async () => {
    if (!googleLink) return;
    setIsFetching(true);
    try {
      const results = await fetchGoogleReviews(googleLink);
      const newReviews: Testimonial[] = results.map(r => ({
        id: Math.random().toString(),
        name: r.name || "Müşteri",
        comment: r.comment || "",
        rating: r.rating || 5,
        date: r.date || "Yeni",
        source: 'google',
        isVisible: true
      }));
      setSettings({ ...settings, testimonials: [...newReviews, ...settings.testimonials] });
      setShowGoogleModal(false);
      setGoogleLink('');
    } catch (e) {
      alert("Yorumlar alınırken bir hata oluştu.");
    } finally {
      setIsFetching(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand/20"><Key className="text-white" size={40} /></div>
          <h1 className="text-3xl font-serif font-bold mb-6 text-slate-900">Yönetim Paneli</h1>
          {loginError && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{loginError}</div>}
          <div className="space-y-4 text-left">
            <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-brand font-bold" placeholder="Kullanıcı Adı" />
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-brand font-bold" placeholder="Şifre" />
          </div>
          <button className="w-full mt-10 bg-slate-900 hover:bg-brand text-white font-bold py-5 rounded-2xl transition-all shadow-lg active:scale-95">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-serif font-bold text-brand uppercase tracking-tighter truncate">{settings.restaurantName}</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Sistem Yönetimi</p>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'products', label: 'Ürünler', icon: Utensils },
            { id: 'categories', label: 'Kategoriler', icon: Tags },
            { id: 'pages', label: 'Sayfalar', icon: FileText },
            { id: 'gallery', label: 'Galeri', icon: ImageIcon },
            { id: 'testimonials', label: 'Yorumlar', icon: MessageSquare },
            { id: 'seo', label: 'SEO Ayarları', icon: Search },
            { id: 'users', label: 'Yöneticiler', icon: Users },
            { id: 'settings', label: 'Genel Ayarlar', icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800"><button onClick={onLogout} className="w-full bg-slate-800 py-4 rounded-2xl font-bold hover:bg-brand transition-colors flex items-center justify-center gap-2"><LogOut size={18} /> Çıkış</button></div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto bg-slate-50 min-h-screen">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 capitalize">
              {activeTab === 'users' ? 'Yönetici Hesapları' : activeTab === 'gallery' ? 'Galeri Yönetimi' : activeTab === 'testimonials' ? 'Müşteri Yorumları' : activeTab === 'seo' ? 'SEO & Google' : activeTab === 'settings' ? 'Sistem Ayarları' : activeTab === 'pages' ? 'Sayfa İçerikleri' : activeTab}
            </h2>
            <p className="text-slate-500 mt-2">Bu bölümdeki ayarlar anlık olarak yayına yansır.</p>
          </div>
          <div className="flex gap-4">
            {(activeTab === 'products' || activeTab === 'categories' || activeTab === 'users') && (
              <button 
                onClick={() => {
                  if (activeTab === 'products') setEditingItem({ id: Math.random().toString(), name: '', price: 0, category: categories[0]?.name || '', description: '', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' });
                  else if (activeTab === 'categories') setEditingCat({ id: Math.random().toString(), name: '', icon: '' });
                  else if (activeTab === 'users') setEditingUser({ id: Math.random().toString(), username: '', email: '', password: '', role: 'admin' });
                }}
                className="bg-brand text-white px-8 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
              >
                <PlusCircle size={20} /> Yeni Ekle
              </button>
            )}
            {activeTab === 'testimonials' && (
              <button onClick={() => setShowGoogleModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                <Globe size={20} /> Google'dan Çek
              </button>
            )}
          </div>
        </header>

        {/* --- PRODUCTS --- */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20 animate-in fade-in">
            {menuItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex gap-6 group hover:shadow-xl transition-all">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border"><img src={item.image} className="w-full h-full object-cover" alt="" /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-xl font-bold text-slate-900">{item.name}</h3><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{item.category}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem(item)} className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={18}/></button>
                      <button onClick={() => setMenuItems(menuItems.filter(i => i.id !== item.id))} className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <p className="text-brand font-black mt-3 text-2xl">{item.price} TL</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- CATEGORIES --- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 animate-in fade-in">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-8 rounded-[32px] border flex flex-col items-center text-center group hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border"><img src={cat.icon} className="w-12 h-12 object-contain" alt="" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">{cat.name}</h3>
                <div className="flex gap-2 w-full">
                  <button onClick={() => setEditingCat(cat)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"><Edit size={16}/> Düzenle</button>
                  <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PAGES --- */}
        {activeTab === 'pages' && (
          <div className="space-y-10 max-w-5xl pb-20 animate-in fade-in">
            <div className="bg-white p-10 rounded-[48px] border shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b"><Layout className="text-brand" size={24}/><h3 className="text-2xl font-serif font-bold">Anasayfa Kapak (Hero)</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Ana Başlık</label><input value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Alt Yazı</label><textarea rows={3} value={settings.heroSubtext} onChange={e => setSettings({...settings, heroSubtext: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-medium outline-none resize-none focus:border-brand" /></div>
                </div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Görsel</label><div className="relative h-56 rounded-[32px] overflow-hidden group border-2 border-dashed mt-2"><img src={settings.heroImage} className="w-full h-full object-cover" alt="" /><label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Upload className="text-white" /><input type="file" className="hidden" onChange={e => handleFileUpload(e, 'hero')} /></label></div></div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[48px] border shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b"><Info className="text-brand" size={24}/><h3 className="text-2xl font-serif font-bold">Hakkımızda Sayfası</h3></div>
              <div className="space-y-6">
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Başlık</label><input value={settings.aboutTitle} onChange={e => setSettings({...settings, aboutTitle: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" /></div>
                <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">İçerik</label><textarea rows={8} value={settings.aboutStory} onChange={e => setSettings({...settings, aboutStory: e.target.value})} className="w-full bg-slate-50 border-2 rounded-[32px] px-8 py-6 font-medium outline-none resize-none focus:border-brand" /></div>
              </div>
            </div>
            <button onClick={() => alert('Değişiklikler Kaydedildi!')} className="w-full bg-slate-900 text-white py-8 rounded-[40px] font-bold text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"><Save size={28}/> Sayfaları Kaydet</button>
          </div>
        )}

        {/* --- GALLERY --- */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-white p-10 rounded-[48px] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div><h3 className="text-xl font-bold">Galeri Görünümü</h3><p className="text-sm text-slate-500">Müşterilerin göreceği dizilim.</p></div>
              <div className="flex p-2 bg-slate-100 rounded-[24px] gap-2">
                {[{ id: 'grid', label: 'Izgara', icon: Grid }, { id: 'masonry', label: 'Mozaik', icon: Columns }, { id: 'slider', label: 'Slider', icon: PlayCircle }].map(layout => (
                  <button key={layout.id} onClick={() => setSettings({...settings, galleryLayout: layout.id as any})} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${settings.galleryLayout === layout.id ? 'bg-white text-brand shadow-md' : 'text-slate-400'}`}>
                    <layout.icon size={18} /> {layout.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-12 rounded-[48px] border-4 border-dashed border-slate-100 text-center relative cursor-pointer"><Upload className="mx-auto text-slate-300 mb-4" size={48} /><h3 className="text-xl font-bold text-slate-900">Fotoğraf Yükle</h3><input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} /></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-20">
              {settings.galleryImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-[32px] overflow-hidden relative group border"><img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt="" /><button onClick={() => setSettings({...settings, galleryImages: settings.galleryImages.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 bg-red-600 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button></div>
              ))}
            </div>
          </div>
        )}

        {/* --- TESTIMONIALS --- */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 pb-20 animate-in fade-in">
            <div className="bg-white p-8 rounded-[40px] border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${settings.testimonialsEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{settings.testimonialsEnabled ? <Eye size={28}/> : <EyeOff size={28}/>}</div><div><h3 className="font-bold text-xl">Müşteri Yorumları</h3><p className="text-sm text-slate-500">Şu an anasayfada {settings.testimonialsEnabled ? 'yayında' : 'kapalı'}.</p></div></div>
              <button onClick={() => setSettings({...settings, testimonialsEnabled: !settings.testimonialsEnabled})} className={`px-8 py-3 rounded-2xl font-bold ${settings.testimonialsEnabled ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{settings.testimonialsEnabled ? 'Pasife Al' : 'Aktife Al'}</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.testimonials.map(t => (
                <div key={t.id} className={`bg-white p-8 rounded-[40px] border relative group ${!t.isVisible ? 'opacity-50 shadow-inner' : 'shadow-sm'}`}><div className="flex justify-between mb-4"><div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < t.rating ? 'fill-brand text-brand' : 'text-slate-200'} />)}</div><div className="flex gap-2"><button onClick={() => setSettings({...settings, testimonials: settings.testimonials.map(item => item.id === t.id ? {...item, isVisible: !item.isVisible} : item)})} className="p-2 text-slate-400 hover:text-brand transition-colors"><Eye size={18}/></button><button onClick={() => setSettings({...settings, testimonials: settings.testimonials.filter(item => item.id !== t.id)})} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button></div></div><p className="text-slate-700 italic text-sm mb-4">"{t.comment}"</p><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">{t.source === 'google' ? <Globe size={18}/> : t.name.charAt(0)}</div><div><h4 className="font-bold text-sm">{t.name}</h4><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.source === 'google' ? 'Google' : 'Local'}</span></div></div></div>
              ))}
            </div>
          </div>
        )}

        {/* --- SEO --- */}
        {activeTab === 'seo' && (
          <div className="space-y-10 max-w-5xl pb-20 animate-in fade-in">
             <div className="bg-white p-10 rounded-[48px] border shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b"><Search className="text-brand" size={24}/><h3 className="text-2xl font-serif font-bold">Arama Motoru (SEO)</h3></div>
                <div className="space-y-6">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Başlık (Meta Title)</label><input value={settings.seoTitle} onChange={e => setSettings({...settings, seoTitle: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Açıklama (Meta Description)</label><textarea rows={3} value={settings.seoDescription} onChange={e => setSettings({...settings, seoDescription: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-medium outline-none focus:border-brand" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Anahtar Kelimeler</label><input value={settings.seoKeywords} onChange={e => setSettings({...settings, seoKeywords: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" /></div>
                </div>
             </div>
             <button onClick={() => alert('SEO Kaydedildi!')} className="w-full bg-slate-900 text-white py-8 rounded-[40px] font-bold text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"><Save size={28}/> SEO Güncelle</button>
          </div>
        )}

        {/* --- USERS --- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[40px] border overflow-hidden shadow-sm animate-in fade-in">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Yönetici</th><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">E-posta</th><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Rol</th><th className="px-8 py-6 text-xs font-black uppercase text-slate-400 text-right">İşlemler</th></tr>
              </thead>
              <tbody className="divide-y">
                {adminUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">{user.username.charAt(0).toUpperCase()}</div><span className="font-bold text-slate-900">{user.username}</span></div></td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{user.email}</td>
                    <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'super' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role === 'super' ? 'Süper Admin' : 'Editör'}</span></td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-3"><button onClick={() => setEditingUser(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18}/></button>{adminUsers.length > 1 && <button onClick={() => setAdminUsers(adminUsers.filter(u => u.id !== user.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="space-y-10 max-w-5xl pb-20 animate-in fade-in">
            <div className="bg-white p-10 rounded-[48px] border shadow-sm">
               <div className="flex items-center gap-4 mb-8 pb-6 border-b"><Palette className="text-brand" size={24}/><h3 className="text-2xl font-serif font-bold">Kurumsal Kimlik</h3></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Restoran İsmi</label><input value={settings.restaurantName} onChange={e => setSettings({...settings, restaurantName: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-2">Ana Tema Rengi</label><div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border"><input type="color" value={settings.brandColor} onChange={e => setSettings({...settings, brandColor: e.target.value})} className="w-12 h-12 rounded-xl cursor-pointer" /><span className="font-bold uppercase text-slate-600 tracking-widest">{settings.brandColor}</span></div></div>
               </div>
            </div>
            <div className="bg-white p-10 rounded-[48px] border shadow-sm">
               <div className="flex items-center gap-4 mb-8 pb-6 border-b"><Phone className="text-brand" size={24}/><h3 className="text-2xl font-serif font-bold">İletişim Bilgileri</h3></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <input placeholder="Telefon" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" />
                    <input placeholder="WhatsApp (905...)" value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" />
                    <input placeholder="Çalışma Saatleri" value={settings.workingHours} onChange={e => setSettings({...settings, workingHours: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold outline-none focus:border-brand" />
                  </div>
                  <textarea placeholder="Tam Adres" rows={5} value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-slate-50 border-2 rounded-[32px] px-8 py-6 font-medium outline-none resize-none focus:border-brand" />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[48px] border space-y-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b"><div className="flex items-center gap-4"><Bot className="text-brand"/><h4 className="font-bold">Yapay Zeka (Gemini)</h4></div><button onClick={() => setSettings({...settings, aiAssistantEnabled: !settings.aiAssistantEnabled})} className={`w-14 h-8 rounded-full transition-all relative ${settings.aiAssistantEnabled ? 'bg-brand' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.aiAssistantEnabled ? 'left-7' : 'left-1'}`}></div></button></div>
                  <select value={settings.aiAssistantPosition} onChange={e => setSettings({...settings, aiAssistantPosition: e.target.value as any})} className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none border focus:border-brand"><option value="bottom-right">Sağ Alt</option><option value="bottom-left">Sol Alt</option></select>
               </div>
               <div className="bg-white p-10 rounded-[48px] border space-y-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b"><div className="flex items-center gap-4"><MessageCircle className="text-green-500"/><h4 className="font-bold">WhatsApp Widget</h4></div><button onClick={() => setSettings({...settings, whatsappEnabled: !settings.whatsappEnabled})} className={`w-14 h-8 rounded-full transition-all relative ${settings.whatsappEnabled ? 'bg-green-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.whatsappEnabled ? 'left-7' : 'left-1'}`}></div></button></div>
                  <select value={settings.whatsappPosition} onChange={e => setSettings({...settings, whatsappPosition: e.target.value as any})} className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none border focus:border-brand"><option value="bottom-right">Sağ Alt</option><option value="bottom-left">Sol Alt</option></select>
               </div>
            </div>
            <button onClick={() => alert('Genel Ayarlar Kaydedildi!')} className="w-full bg-slate-900 text-white py-8 rounded-[40px] font-bold text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"><Save size={28}/> Tüm Ayarları Kaydet</button>
          </div>
        )}

        {/* --- MODALLAR --- */}
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-serif font-bold">Yönetici</h3><button onClick={() => setEditingUser(null)}><X /></button></div>
              <div className="p-10 space-y-6">
                <input placeholder="Kullanıcı Adı" value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border focus:border-brand" />
                <input placeholder="Şifre" value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border focus:border-brand" />
                <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border focus:border-brand"><option value="admin">Editör</option><option value="super">Süper Admin</option></select>
              </div>
              <div className="p-8 border-t"><button onClick={() => { if (adminUsers.find(u => u.id === editingUser.id)) { setAdminUsers(adminUsers.map(u => u.id === editingUser.id ? editingUser : u)); } else { setAdminUsers([...adminUsers, editingUser]); } setEditingUser(null); }} className="w-full bg-brand text-white py-5 rounded-3xl font-bold transition-all active:scale-95">Kaydet</button></div>
            </div>
          </div>
        )}

        {showGoogleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-serif font-bold">Google Maps Aktarımı</h3><button onClick={() => setShowGoogleModal(false)}><X /></button></div>
              <div className="p-10 space-y-6">
                <div><label className="text-xs font-black uppercase text-slate-400 ml-2">Google Maps Linki</label><input value={googleLink} onChange={e => setGoogleLink(e.target.value)} placeholder="https://www.google.com/maps/place/..." className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 mt-2 font-medium outline-none focus:border-blue-600" /></div>
              </div>
              <div className="p-8 border-t"><button onClick={handleImport} disabled={isFetching} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3">{isFetching ? <Loader2 className="animate-spin"/> : <Zap/>} Verileri Çek</button></div>
            </div>
          </div>
        )}

        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <form onSubmit={(e) => { e.preventDefault(); if (menuItems.find(i => i.id === editingItem.id)) { setMenuItems(menuItems.map(i => i.id === editingItem.id ? editingItem : i)); } else { setMenuItems([editingItem, ...menuItems]); } setEditingItem(null); }} className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-serif font-bold">Lezzet</h3><button type="button" onClick={() => setEditingItem(null)}><X /></button></div>
              <div className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
                <input required placeholder="Ürün Adı" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl font-bold border outline-none focus:border-brand" />
                <input required type="number" placeholder="Fiyat" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl font-bold border outline-none focus:border-brand" />
                <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl font-bold border outline-none focus:border-brand">{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
                <div className="relative h-48 rounded-[32px] overflow-hidden group border-2 border-dashed flex items-center justify-center"><img src={editingItem.image} className="w-full h-full object-cover" alt="" /><label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Upload className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'product')} /></label></div>
              </div>
              <div className="p-8 border-t"><button type="submit" className="w-full bg-brand text-white py-5 rounded-3xl font-bold transition-all active:scale-95">Kaydet</button></div>
            </form>
          </div>
        )}

        {editingCat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-serif font-bold">Kategori</h3><button onClick={() => setEditingCat(null)}><X /></button></div>
              <div className="p-10 space-y-6">
                <input required placeholder="Kategori İsmi" value={editingCat.name} onChange={e => setEditingCat({...editingCat, name: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border focus:border-brand" />
                <div className="relative h-24 bg-slate-50 rounded-2xl flex items-center justify-center group overflow-hidden border"><img src={editingCat.icon} className="w-14 h-14 object-contain" alt="" /><label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Upload className="text-white"/><input type="file" className="hidden" onChange={e => handleFileUpload(e, 'category')}/></label></div>
              </div>
              <div className="p-8 border-t"><button onClick={() => { if (categories.find(c => c.id === editingCat.id)) { setCategories(categories.map(c => c.id === editingCat.id ? editingCat : c)); } else { setCategories([...categories, editingCat]); } setEditingCat(null); }} className="w-full bg-brand text-white py-5 rounded-3xl font-bold transition-all active:scale-95">Kaydet</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
