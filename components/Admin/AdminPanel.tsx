
import React, { useState } from 'react';
import { 
  Utensils, Tags, Settings, Trash2, Edit, X, Image as ImageIcon,
  FileText, Users, Key, PlusCircle, Upload, LogOut, MessageSquare,
  Star, Globe, Loader2, Database, Download, RefreshCw, AlertCircle, UploadCloud, Zap, CheckCircle2, Github, Info
} from 'lucide-react';
import { MenuItem, CategoryItem, SiteSettings, AdminUser } from '../../types';
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
  const isCloudConnected = !!supabase;
  const [activeTab, setActiveTab] = useState<'data' | 'products' | 'categories' | 'users' | 'settings'>('data');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = adminUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) setIsLoggedIn(true); else setLoginError('Hatalı giriş.');
  };

  const handleSyncToCloud = async () => {
    if (!isCloudConnected) return;
    setIsSyncing(true);
    try {
      await dataService.saveCategories(categories);
      await dataService.saveMenuItems(menuItems);
      await dataService.saveSettings(settings);
      alert("Başarılı: Tüm veriler Supabase bulutuna gönderildi!");
    } catch (e) {
      alert("Hata oluştu! Tabloların SQL ile oluşturulduğundan emin olun.");
    } finally { setIsSyncing(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center font-sans">
          <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand/20"><Key className="text-white" size={40} /></div>
          <h1 className="text-3xl font-serif font-bold mb-6 text-slate-900">Yönetim Paneli</h1>
          {loginError && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{loginError}</div>}
          <div className="space-y-4 text-left">
            <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-brand font-bold" placeholder="Kullanıcı Adı (admin)" />
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-brand font-bold" placeholder="Şifre (admin)" />
          </div>
          <button className="w-full mt-10 bg-slate-900 hover:bg-brand text-white font-bold py-5 rounded-2xl transition-all">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-serif font-bold text-brand uppercase truncate">{settings.restaurantName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{isCloudConnected ? 'Bulut Aktif' : 'Yerel Mod'}</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'data', label: 'Veri Yönetimi', icon: Database },
            { id: 'products', label: 'Ürünler', icon: Utensils },
            { id: 'users', label: 'Yöneticiler', icon: Users },
            { id: 'settings', label: 'Genel Ayarlar', icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-6 bg-slate-800 py-4 rounded-2xl font-bold hover:bg-brand transition-colors flex items-center justify-center gap-2"><LogOut size={18} /> Çıkış</button>
      </aside>

      <main className="flex-1 ml-72 p-12 bg-slate-50 min-h-screen">
        {activeTab === 'data' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in">
            <header className="mb-12">
              <h2 className="text-4xl font-serif font-bold text-slate-900">Veri ve Bulut Yönetimi</h2>
              <p className="text-slate-500 mt-2">Sitenizin kalbini ve veritabanı bağlantılarını buradan yönetin.</p>
            </header>

            {isCloudConnected ? (
              <div className="bg-white border-2 border-green-100 p-10 rounded-[48px] shadow-sm flex items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-green-500 text-white rounded-[28px] flex items-center justify-center shrink-0 shadow-xl shadow-green-500/20"><CloudUpload size={40}/></div>
                  <div><h3 className="text-2xl font-bold text-slate-900 mb-2">Bulut Bağlantısı Hazır!</h3><p className="text-slate-500 text-sm">Verileri tek tıkla canlı veritabanına aktarabilirsiniz.</p></div>
                </div>
                <button disabled={isSyncing} onClick={handleSyncToCloud} className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all">
                  {isSyncing ? <Loader2 className="animate-spin" /> : <Zap size={20} />} Verileri Buluta Gönder
                </button>
              </div>
            ) : (
              <div className="bg-orange-50 border-2 border-orange-200 p-10 rounded-[48px] flex items-start gap-8">
                <div className="w-20 h-20 bg-orange-500 text-white rounded-[28px] flex items-center justify-center shrink-0"><AlertCircle size={40}/></div>
                <div><h3 className="text-2xl font-bold text-orange-900 mb-3">Bulut Bağlantısı Bekleniyor</h3><p className="text-orange-800">Netlify/Vercel üzerinden SUPABASE_URL ve KEY değerlerini eklemelisiniz.</p></div>
              </div>
            )}

            <div className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3"><Github className="text-brand"/> GitHub Yayınlama Rehberi</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">Burada yaptığınız kod değişikliklerinin canlıya geçmesi için GitHub'a göndermeyi unutmayın:</p>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between group">
                       <span className="text-brand">1. git add .</span>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between group">
                       <span className="text-brand">2. git commit -m "Veri yonetimi eklendi"</span>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between group">
                       <span className="text-brand">3. git push origin main</span>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-3 text-brand font-bold text-sm bg-brand/10 p-4 rounded-2xl">
                    <Info size={20}/> Değişiklikler yapıldıktan sonra Netlify otomatik olarak siteyi güncelleyecektir.
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
             <div className="col-span-full mb-4">
                <button onClick={() => setEditingItem({ id: Math.random().toString(), name: '', price: 0, category: categories[0]?.name || '', description: '', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' })} className="bg-brand text-white px-8 py-4 rounded-2xl font-bold shadow-lg">Yeni Ürün Ekle</button>
             </div>
            {menuItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border flex gap-6 group hover:shadow-xl transition-all">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" alt="" /></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 bg-blue-50 rounded-xl"><Edit size={18}/></button>
                      <button onClick={() => setMenuItems(menuItems.filter(i => i.id !== item.id))} className="p-2 text-red-600 bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <p className="text-brand font-black mt-3 text-2xl">{item.price} TL</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
