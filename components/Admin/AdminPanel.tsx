
import React, { useState } from 'react';
import { 
  Utensils, Tags, Settings, Trash2, Edit, X, Image as ImageIcon,
  FileText, Users, Key, PlusCircle, Upload, LogOut, MessageSquare,
  Star, Globe, Loader2, Eye, EyeOff, Layout, MapPin, Save, Zap,
  Search, Palette, Phone, Info, CheckCircle2, Facebook, Instagram, Youtube, Bot,
  Database, Download, RefreshCw, AlertCircle, CloudUpload
} from 'lucide-react';
import { MenuItem, CategoryItem, SiteSettings, AdminUser, Testimonial } from '../../types';
import { fetchGoogleReviews } from '../../services/geminiService';
import { dataService } from '../../services/dataService';
import { supabase } from '../../services/supabaseClient';

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
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'pages' | 'gallery' | 'users' | 'settings' | 'testimonials' | 'seo' | 'data'>('products');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLink, setGoogleLink] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const isCloudConnected = !!supabase;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = adminUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) setIsLoggedIn(true); else setLoginError('Hatalı giriş bilgileri.');
  };

  const handleSyncToCloud = async () => {
    if (!isCloudConnected) {
      alert("Bağlantı yok! Lütfen önce Supabase URL ve Key ayarlarını Netlify/Vercel üzerinden yapın.");
      return;
    }
    setIsSyncing(true);
    try {
      // Önce kategorileri, sonra ürünleri gönder (Foreign key hatalarını önlemek için)
      await dataService.saveCategories(categories);
      await dataService.saveMenuItems(menuItems);
      await dataService.saveSettings(settings);
      await dataService.saveAdmins(adminUsers);
      
      alert("TEBRİKLER! Tüm yerel verileriniz Supabase bulut veritabanına başarıyla yüklendi. Artık siteniz dünyanın her yerinden aynı verileri gösterecek.");
    } catch (e) {
      console.error(e);
      alert("HATA: Veriler gönderilemedi. Lütfen Supabase SQL Editor'da tabloları oluşturduğunuzdan emin olun.");
    } finally {
      setIsSyncing(false);
    }
  }

  const exportData = () => {
    const data = { menuItems, categories, settings, adminUsers };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meshur_mekanlar_yedek.json`;
    a.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const url = await dataService.uploadImage(files[0]);
      if (target === 'product' && editingItem) setEditingItem({ ...editingItem, image: url });
      if (target === 'category' && editingCat) setEditingCat({ ...editingCat, icon: url });
    } catch (err) { alert("Yükleme hatası!"); } finally { setIsUploading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center">
          <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand/20"><Key className="text-white" size={40} /></div>
          <h1 className="text-3xl font-serif font-bold mb-6 text-slate-900">Yönetim Paneli</h1>
          {loginError && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{loginError}</div>}
          <div className="space-y-4 text-left">
            <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-brand font-bold" placeholder="Kullanıcı Adı" />
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-brand font-bold" placeholder="Şifre" />
          </div>
          <button className="w-full mt-10 bg-slate-900 hover:bg-brand text-white font-bold py-5 rounded-2xl transition-all shadow-lg">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-serif font-bold text-brand uppercase truncate">{settings.restaurantName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{isCloudConnected ? 'Bulut Bağlantısı Aktif' : 'Çevrimdışı Mod'}</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'products', label: 'Ürünler', icon: Utensils },
            { id: 'categories', label: 'Kategoriler', icon: Tags },
            { id: 'data', label: 'Veri Yönetimi', icon: Database },
            { id: 'pages', label: 'Sayfalar', icon: FileText },
            { id: 'gallery', label: 'Galeri', icon: ImageIcon },
            { id: 'testimonials', label: 'Yorumlar', icon: MessageSquare },
            { id: 'users', label: 'Yöneticiler', icon: Users },
            { id: 'settings', label: 'Genel Ayarlar', icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800"><button onClick={onLogout} className="w-full bg-slate-800 py-4 rounded-2xl font-bold hover:bg-brand transition-colors flex items-center justify-center gap-2"><LogOut size={18} /> Çıkış</button></div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto bg-slate-50 min-h-screen">
        <header className="mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 capitalize">
            {activeTab === 'data' ? 'Veri ve Bulut Yönetimi' : activeTab}
          </h2>
          <p className="text-slate-500 mt-2">Sitenizin içeriğini ve veritabanı bağlantısını buradan yönetebilirsiniz.</p>
        </header>

        {activeTab === 'data' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in">
             {isCloudConnected ? (
                <div className="bg-white border-2 border-green-100 p-10 rounded-[48px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-[28px] flex items-center justify-center shrink-0 shadow-xl shadow-green-500/20"><CloudUpload size={40}/></div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Bulut Aktif!</h3>
                      <p className="text-slate-500 leading-relaxed text-sm">Supabase bağlantınız başarıyla kuruldu. Yerel tarayıcınızdaki tüm ürünleri ve ayarları bulut veritabanına aktarmak için aşağıdaki butona basın.</p>
                    </div>
                  </div>
                  <button 
                    disabled={isSyncing}
                    onClick={handleSyncToCloud}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
                  >
                    {isSyncing ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                    {isSyncing ? 'Eşitleniyor...' : 'Verileri Buluta Gönder'}
                  </button>
                </div>
             ) : (
               <div className="bg-orange-50 border-2 border-orange-200 p-10 rounded-[48px] flex items-start gap-8">
                 <div className="w-20 h-20 bg-orange-500 text-white rounded-[28px] flex items-center justify-center shrink-0 shadow-xl shadow-orange-500/20"><AlertCircle size={40}/></div>
                 <div>
                   <h3 className="text-2xl font-bold text-orange-900 mb-3">Veritabanı Bağlantısı Bekleniyor</h3>
                   <p className="text-orange-800 leading-relaxed mb-6">Şu an yaptığınız değişiklikler sadece bu tarayıcıda saklanıyor. Kalıcı olması için:</p>
                   <ul className="space-y-3 text-sm text-orange-700 font-medium">
                     <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Netlify veya Vercel panelinden "Environment Variables" kısmına gidin.</li>
                     <li className="flex items-center gap-2"><CheckCircle2 size={16}/> SUPABASE_URL ve SUPABASE_ANON_KEY değerlerini ekleyin.</li>
                     <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Siteyi yeniden dağıtın (Redeploy).</li>
                   </ul>
                 </div>
               </div>
             )}

             <div className="bg-white p-10 rounded-[48px] border shadow-sm">
                <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3"><RefreshCw className="text-brand"/> Yedekleme Sistemi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button onClick={exportData} className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 hover:border-brand hover:bg-brand/5 group transition-all text-left">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-brand">Bilgisayarıma Yedekle</p>
                        <p className="text-xs text-slate-500">Tüm verileri .json dosyası olarak indir.</p>
                      </div>
                      <Download className="text-slate-400 group-hover:text-brand" size={32}/>
                   </button>
                   <div className="p-8 bg-blue-50/30 rounded-3xl border-2 border-blue-100 flex items-center gap-4">
                      <Info className="text-blue-500" size={24} />
                      <p className="text-xs text-blue-700 font-medium">Buluta gönderme işlemi yapmadan önce verilerinizi yedeklemeniz önerilir.</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20 animate-in fade-in">
             <div className="col-span-full mb-4">
                <button 
                  onClick={() => setEditingItem({ id: Math.random().toString(), name: '', price: 0, category: categories[0]?.name || '', description: '', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' })}
                  className="bg-brand text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
                >
                  <PlusCircle size={20} /> Yeni Ürün Ekle
                </button>
             </div>
            {menuItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex gap-6 group hover:shadow-xl transition-all">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border"><img src={item.image} className="w-full h-full object-cover" alt="" /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-xl font-bold text-slate-900">{item.name}</h3><p className="text-slate-400 text-[10px] font-black uppercase mt-1">{item.category}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem(item)} className="p-2.5 text-blue-600 bg-blue-50 rounded-xl"><Edit size={18}/></button>
                      <button onClick={() => setMenuItems(menuItems.filter(i => i.id !== item.id))} className="p-2.5 text-red-600 bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <p className="text-brand font-black mt-3 text-2xl">{item.price} TL</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <form onSubmit={(e) => { e.preventDefault(); if (menuItems.find(i => i.id === editingItem.id)) { setMenuItems(menuItems.map(i => i.id === editingItem.id ? editingItem : i)); } else { setMenuItems([editingItem, ...menuItems]); } setEditingItem(null); }} className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-serif font-bold">Ürün Bilgileri</h3><button type="button" onClick={() => setEditingItem(null)}><X /></button></div>
              <div className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
                <input required placeholder="Ürün Adı" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl font-bold border outline-none" />
                <input required type="number" placeholder="Fiyat (TL)" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl font-bold border outline-none" />
                <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl font-bold border outline-none">{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
                <textarea placeholder="Açıklama" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl font-medium border outline-none h-32" />
                <div className="relative h-48 rounded-[32px] overflow-hidden group border-2 border-dashed flex items-center justify-center bg-slate-50">
                  {isUploading ? <Loader2 className="animate-spin text-brand" size={32}/> : <img src={editingItem.image} className="w-full h-full object-cover" alt="" />}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"><Upload className="text-white" /><input type="file" className="hidden" onChange={e => handleFileUpload(e, 'product')} /></label>
                </div>
              </div>
              <div className="p-8 border-t"><button type="submit" className="w-full bg-brand text-white py-5 rounded-3xl font-bold">Kaydet</button></div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
