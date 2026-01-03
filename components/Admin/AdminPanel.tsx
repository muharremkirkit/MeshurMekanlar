
import React, { useState } from 'react';
import { 
  Utensils, Settings, Trash2, Edit, Plus, Save, X,
  Users, Key, LogOut, Image as ImageIcon, LayoutTemplate,
  CheckCircle, Globe, Smartphone, MapPin, Clock, Share2, Sparkles,
  UploadCloud, Loader2, MessageSquare, Star, Monitor, Grid, Columns,
  Download
} from 'lucide-react';
import { MenuItem, CategoryItem, SiteSettings, AdminUser, Testimonial, WidgetPosition } from '../../types';
import { dataService } from '../../services/dataService';
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

// İç Bileşen: Görsel Yükleyici (Hem URL hem Dosya destekler)
const ImageUploader = ({ label, currentImage, onImageChange }: { label: string, currentImage: string, onImageChange: (url: string) => void }) => {
  const [method, setMethod] = useState<'url' | 'file'>('file');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await dataService.uploadImage(file);
        onImageChange(url);
      } catch (error) {
        alert("Görsel yüklenirken bir hata oluştu.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700">{label}</label>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button onClick={() => setMethod('file')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${method === 'file' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Bilgisayardan</button>
          <button onClick={() => setMethod('url')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${method === 'url' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Link</button>
        </div>
      </div>
      
      <div className="flex gap-4 items-start">
        {currentImage && (
          <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shrink-0 relative group">
             <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex-1">
          {method === 'url' ? (
            <input 
              className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-600 outline-none transition-colors" 
              value={currentImage} 
              onChange={e => onImageChange(e.target.value)} 
              placeholder="https://..." 
            />
          ) : (
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors group">
              <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
              {isUploading ? (
                <div className="flex flex-col items-center text-slate-500">
                  <Loader2 className="animate-spin mb-2" size={24} />
                  <span className="text-xs font-bold">Yükleniyor...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-600">
                  <UploadCloud size={24} className="mb-2" />
                  <span className="text-xs font-bold">Dosya Seçin veya Sürükleyin</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  menuItems, setMenuItems, categories, setCategories, adminUsers, setAdminUsers, settings, setSettings, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'gallery' | 'content' | 'testimonials' | 'users' | 'settings'>('products');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Google Review Fetch State
  const [isFetchingReviews, setIsFetchingReviews] = useState(false);
  const [googleMapsLinkInput, setGoogleMapsLinkInput] = useState('');

  // Edit States
  const [editingProduct, setEditingProduct] = useState<Partial<MenuItem> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = adminUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı.');
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleSaveProduct = () => {
    if (!editingProduct?.name || !editingProduct.price) return;
    if (editingProduct.id) {
      setMenuItems(items => items.map(i => i.id === editingProduct.id ? editingProduct as MenuItem : i));
    } else {
      setMenuItems(items => [...items, { ...editingProduct, id: Math.random().toString(), isPopular: false } as MenuItem]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) setMenuItems(items => items.filter(i => i.id !== id));
  };

  // --- CATEGORY HANDLERS ---
  const handleSaveCategory = () => {
    if (!editingCategory?.name) return;
    if (editingCategory.id) {
      setCategories(cats => cats.map(c => c.id === editingCategory.id ? editingCategory as CategoryItem : c));
    } else {
      setCategories(cats => [...cats, { ...editingCategory, id: Math.random().toString(), icon: editingCategory.icon || '' } as CategoryItem]);
    }
    setEditingCategory(null);
  };

  // --- GALLERY HANDLERS ---
  const handleAddGalleryImage = (url: string) => {
    setSettings(prev => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
  };

  // --- TESTIMONIAL HANDLERS ---
  const handleSaveTestimonial = () => {
    if (!editingTestimonial?.name || !editingTestimonial.comment) return;
    if (editingTestimonial.id) {
      setSettings(s => ({...s, testimonials: s.testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial as Testimonial : t)}));
    } else {
      const newT: Testimonial = { ...editingTestimonial, id: Math.random().toString(), date: new Date().toISOString(), source: 'local', isVisible: true } as Testimonial;
      setSettings(s => ({...s, testimonials: [...s.testimonials, newT]}));
    }
    setEditingTestimonial(null);
  };

  const handleFetchReviews = async () => {
    if (!googleMapsLinkInput) return alert('Lütfen bir Google Maps linki girin.');
    setIsFetchingReviews(true);
    try {
      // Gemini servisini çağır
      const reviews = await fetchGoogleReviews(googleMapsLinkInput);
      if (reviews && reviews.length > 0) {
        // Mevcut yorumlara ekle, ama önce ID ata
        const formattedReviews = reviews.map(r => ({
          ...r,
          id: Math.random().toString(),
          source: 'google' as const,
          isVisible: true
        })) as Testimonial[];
        
        setSettings(prev => ({
          ...prev,
          testimonials: [...prev.testimonials, ...formattedReviews]
        }));
        alert(`${formattedReviews.length} adet yorum başarıyla çekildi.`);
        setGoogleMapsLinkInput('');
      } else {
        alert('Yorum bulunamadı veya bir hata oluştu.');
      }
    } catch (e) {
      console.error(e);
      alert('Yorumlar çekilirken bir hata oluştu.');
    } finally {
      setIsFetchingReviews(false);
    }
  };

  // --- USER HANDLERS ---
  const handleAddUser = () => {
    if (newUser.username && newUser.password) {
      setAdminUsers(prev => [...prev, { ...newUser, id: Math.random().toString() } as AdminUser]);
      setNewUser({ username: '', password: '', role: 'admin' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center font-sans">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-600/20"><Key className="text-white" size={40} /></div>
          <h1 className="text-3xl font-serif font-bold mb-6 text-slate-900">Yönetim Paneli</h1>
          {loginError && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{loginError}</div>}
          <div className="space-y-4 text-left">
            <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-red-600 font-bold transition-colors" placeholder="Kullanıcı Adı" />
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 outline-none focus:border-red-600 font-bold transition-colors" placeholder="Şifre" />
          </div>
          <button className="w-full mt-10 bg-slate-900 hover:bg-red-600 text-white font-bold py-5 rounded-2xl transition-all">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-serif font-bold text-red-500 uppercase tracking-widest truncate">{settings.restaurantName}</h1>
          <p className="text-xs text-slate-500 mt-2 font-bold">Yönetim Paneli v2.0</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'products', label: 'Ürün Yönetimi', icon: Utensils },
            { id: 'categories', label: 'Kategoriler', icon: LayoutTemplate },
            { id: 'gallery', label: 'Görseller', icon: ImageIcon },
            { id: 'content', label: 'Sayfa İçeriği', icon: Edit },
            { id: 'testimonials', label: 'Yorumlar', icon: MessageSquare },
            { id: 'users', label: 'Yöneticiler', icon: Users },
            { id: 'settings', label: 'Ayarlar & SEO', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-6 bg-slate-800 py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><LogOut size={18} /> Çıkış</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 bg-slate-50 min-h-screen">
        
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Menü & Ürünler</h2>
              <button 
                onClick={() => setEditingProduct({ name: '', price: 0, category: categories[0]?.name || 'Diğer', description: '', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' })} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
              >
                <Plus size={20} /> Yeni Ürün Ekle
              </button>
            </div>

            {editingProduct && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">{editingProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h3>
                    <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <ImageUploader 
                        label="Ürün Görseli" 
                        currentImage={editingProduct.image || ''} 
                        onImageChange={(url) => setEditingProduct({...editingProduct, image: url})} 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ürün Adı</label>
                      <input className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-600 outline-none" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Fiyat (TL)</label>
                      <input type="number" className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-600 outline-none" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                      <select className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-600 outline-none" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama</label>
                      <textarea rows={3} className="w-full p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-600 outline-none" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                    </div>
                    <div className="col-span-2 flex items-center gap-4">
                      <input type="checkbox" id="isPopular" checked={editingProduct.isPopular} onChange={e => setEditingProduct({...editingProduct, isPopular: e.target.checked})} className="w-6 h-6 text-red-600 rounded focus:ring-red-500 border-gray-300" />
                      <label htmlFor="isPopular" className="font-bold text-slate-700">Anasayfada "Popüler" olarak göster</label>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button onClick={handleSaveProduct} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-colors">Kaydet</button>
                    <button onClick={() => setEditingProduct(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-bold transition-colors">İptal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.category}</span>
                    {item.isPopular && <span className="ml-2 text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded-md">★ Popüler</span>}
                  </div>
                  <div className="text-xl font-bold text-red-600 mr-4">{item.price} TL</div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Edit size={18}/></button>
                    <button onClick={() => handleDeleteProduct(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Kategori Yönetimi</h2>
              <button onClick={() => setEditingCategory({ name: '', icon: '' })} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"><Plus size={20}/> Yeni Kategori</button>
            </div>

            {editingCategory && (
              <div className="bg-white p-8 rounded-[32px] shadow-lg border-2 border-red-100 mb-8 animate-in slide-in-from-top-4">
                <h3 className="font-bold mb-4">{editingCategory.id ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase">Kategori Adı</label>
                     <input className="w-full p-4 bg-slate-50 rounded-xl border mt-2" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} />
                  </div>
                  <div>
                    <ImageUploader 
                        label="Kategori İkonu" 
                        currentImage={editingCategory.icon || ''} 
                        onImageChange={(url) => setEditingCategory({...editingCategory, icon: url})} 
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleSaveCategory} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Kaydet</button>
                  <button onClick={() => setEditingCategory(null)} className="bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold">İptal</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 group hover:border-red-200 transition-colors">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3">
                    <img src={cat.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-bold text-lg">{cat.name}</h4>
                  <div className="flex gap-2 w-full mt-2">
                    <button onClick={() => setEditingCategory(cat)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100">Düzenle</button>
                    <button onClick={() => setCategories(c => c.filter(x => x.id !== cat.id))} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Görsel Galerisi</h2>
            
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 space-y-8">
              {/* Görünüm Ayarları */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><LayoutTemplate size={20}/> Galeri Görünümü</h3>
                <div className="flex gap-4">
                  {[
                    { id: 'grid', label: 'Standart Grid', icon: Grid },
                    { id: 'slider', label: 'Slider (Kaydırmalı)', icon: Columns },
                    { id: 'masonry', label: 'Masonry (4\'lü)', icon: LayoutTemplate }
                  ].map(layout => (
                    <button 
                      key={layout.id}
                      onClick={() => setSettings({...settings, galleryLayout: layout.id as any})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all w-32 ${settings.galleryLayout === layout.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 hover:border-red-200'}`}
                    >
                      <layout.icon size={24} />
                      <span className="text-xs font-bold">{layout.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Görsel Ekleme */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <ImageUploader 
                  label="Yeni Görsel Ekle" 
                  currentImage="" 
                  onImageChange={handleAddGalleryImage} 
                />
              </div>
            </div>

            <div className={`grid gap-6 ${settings.galleryLayout === 'masonry' ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-4'}`}>
              {settings.galleryImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-square border border-slate-100 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setSettings(s => ({...s, galleryImages: s.galleryImages.filter((_, i) => i !== idx)}))}
                      className="bg-red-600 text-white p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
           <div className="space-y-10 animate-in fade-in max-w-4xl">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3"><Monitor/> Giriş (Hero) Alanı</h2>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border space-y-6">
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">Ana Başlık</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border" value={settings.heroTitle} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">Alt Metin</label>
                    <textarea rows={2} className="w-full p-4 bg-slate-50 rounded-xl border" value={settings.heroSubtext} onChange={(e) => setSettings({...settings, heroSubtext: e.target.value})} />
                  </div>
                  <div>
                    <ImageUploader 
                      label="Arkaplan Görseli" 
                      currentImage={settings.heroImage} 
                      onImageChange={(url) => setSettings({...settings, heroImage: url})} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3"><Edit/> Hakkımızda Alanı</h2>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border space-y-6">
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">Başlık</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border" value={settings.aboutTitle} onChange={(e) => setSettings({...settings, aboutTitle: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">Alt Başlık</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border" value={settings.aboutSubtext} onChange={(e) => setSettings({...settings, aboutSubtext: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">Hikayemiz (Detaylı Metin)</label>
                    <textarea rows={6} className="w-full p-4 bg-slate-50 rounded-xl border" value={settings.aboutStory} onChange={(e) => setSettings({...settings, aboutStory: e.target.value})} />
                  </div>
                </div>
              </div>
           </div>
        )}
        
        {/* TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Müşteri Yorumları</h2>
              <button 
                onClick={() => setEditingTestimonial({ name: '', comment: '', rating: 5, source: 'local', isVisible: true })} 
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
              >
                <Plus size={20}/> Yeni Yorum Ekle
              </button>
            </div>

            {/* Google'dan Çekme Alanı */}
            <div className="bg-blue-50 border border-blue-200 rounded-[32px] p-8 flex flex-col md:flex-row gap-6 items-end shadow-sm">
               <div className="flex-1 w-full">
                 <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Globe className="text-blue-600"/> Google Maps'ten Yorum Çek</h3>
                 <p className="text-sm text-blue-700 mb-4">İşletmenizin Google Maps linkini yapıştırın, yapay zeka en yeni 5 yorumu sizin için çeksin.</p>
                 <input 
                   value={googleMapsLinkInput}
                   onChange={e => setGoogleMapsLinkInput(e.target.value)}
                   className="w-full p-4 rounded-xl border border-blue-200 outline-none focus:border-blue-500 bg-white" 
                   placeholder="https://www.google.com/maps/..." 
                 />
               </div>
               <button 
                 onClick={handleFetchReviews}
                 disabled={isFetchingReviews}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-3 transition-all disabled:opacity-50"
               >
                 {isFetchingReviews ? <Loader2 className="animate-spin"/> : <Download size={20}/>}
                 {isFetchingReviews ? 'Çekiliyor...' : 'Yorumları Çek'}
               </button>
            </div>

            {/* Görünüm Ayarları */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><LayoutTemplate/> Görünüm Ayarları</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                   <label className="block text-sm font-bold text-slate-500 mb-2">Yerleşim Düzeni</label>
                   <div className="flex bg-slate-50 p-1 rounded-xl">
                      <button 
                        onClick={() => setSettings({...settings, testimonialLayout: 'slider'})}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${settings.testimonialLayout === 'slider' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        <Columns size={16}/> Slider (Kayar)
                      </button>
                      <button 
                        onClick={() => setSettings({...settings, testimonialLayout: 'grid'})}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${settings.testimonialLayout === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        <Grid size={16}/> Grid (Yan Yana)
                      </button>
                   </div>
                 </div>
                 {settings.testimonialLayout === 'grid' && (
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-2">Yan Yana Kaç Tane?</label>
                     <select 
                       value={settings.testimonialGridCols || 3}
                       onChange={e => setSettings({...settings, testimonialGridCols: Number(e.target.value)})}
                       className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 outline-none"
                     >
                       <option value={1}>1 (Tek Sütun)</option>
                       <option value={2}>2 (İki Sütun)</option>
                       <option value={3}>3 (Üç Sütun)</option>
                       <option value={4}>4 (Dört Sütun)</option>
                     </select>
                   </div>
                 )}
               </div>
            </div>

            {editingTestimonial && (
              <div className="bg-white p-8 rounded-[32px] shadow-lg border-2 border-red-100 mb-8 animate-in slide-in-from-top-4">
                <h3 className="font-bold mb-4">{editingTestimonial.id ? 'Yorum Düzenle' : 'Yeni Yorum'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input className="p-3 border rounded-xl" placeholder="Müşteri Adı" value={editingTestimonial.name} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} />
                  <div className="flex items-center gap-2 border p-3 rounded-xl">
                    <span className="text-sm font-bold">Puan:</span>
                    <select className="bg-transparent font-bold outline-none" value={editingTestimonial.rating} onChange={e => setEditingTestimonial({...editingTestimonial, rating: Number(e.target.value)})}>
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Yıldız</option>)}
                    </select>
                  </div>
                  <textarea className="col-span-2 p-3 border rounded-xl" rows={3} placeholder="Yorum metni..." value={editingTestimonial.comment} onChange={e => setEditingTestimonial({...editingTestimonial, comment: e.target.value})} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={editingTestimonial.isVisible} onChange={e => setEditingTestimonial({...editingTestimonial, isVisible: e.target.checked})} />
                    <label>Sitede Göster</label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleSaveTestimonial} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Kaydet</button>
                  <button onClick={() => setEditingTestimonial(null)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold">İptal</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.testimonials.map(t => (
                <div key={t.id} className={`p-6 rounded-2xl border ${t.isVisible ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(t.rating)].map((_,i) => <Star key={i} size={14} fill="currentColor"/>)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingTestimonial(t)} className="text-blue-600"><Edit size={16}/></button>
                      <button onClick={() => setSettings(s => ({...s, testimonials: s.testimonials.filter(x => x.id !== t.id)}))} className="text-red-600"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 italic">"{t.comment}"</p>
                  <div className="flex items-center gap-2">
                    {t.source === 'google' ? <Globe size={14} className="text-blue-500"/> : <Users size={14} className="text-slate-400"/>}
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-in fade-in max-w-4xl">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Yönetici Hesapları</h2>
            
            <div className="bg-white shadow-xl p-8 rounded-[32px] border-l-8 border-red-600 flex flex-col md:flex-row gap-6 items-end">
               <div className="flex-1 w-full">
                 <label className="font-bold text-slate-700 text-xs uppercase ml-1">Kullanıcı Adı</label>
                 <input className="w-full p-4 bg-slate-50 rounded-xl border mt-2 focus:border-red-600 outline-none" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="Örn: yonetici" />
               </div>
               <div className="flex-1 w-full">
                 <label className="font-bold text-slate-700 text-xs uppercase ml-1">Şifre</label>
                 <input className="w-full p-4 bg-slate-50 rounded-xl border mt-2 focus:border-red-600 outline-none" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="******" />
               </div>
               <button onClick={handleAddUser} className="bg-slate-900 hover:bg-red-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg w-full md:w-auto flex items-center justify-center gap-2">
                 <Plus size={20} /> Ekle
               </button>
            </div>

            <div className="bg-white rounded-[32px] border overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 font-bold text-slate-600">Kullanıcı Adı</th>
                    <th className="p-6 font-bold text-slate-600">Rol</th>
                    <th className="p-6 font-bold text-slate-600 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(user => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold uppercase">{user.username[0]}</div>
                         {user.username}
                      </td>
                      <td className="p-6"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{user.role}</span></td>
                      <td className="p-6 text-right">
                         {user.username !== 'admin' && (
                           <button onClick={() => setAdminUsers(u => u.filter(x => x.id !== user.id))} className="text-red-600 hover:bg-red-50 p-3 rounded-xl transition-colors"><Trash2 size={20}/></button>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-12 animate-in fade-in max-w-5xl pb-20">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Ayarlar & SEO Yönetimi</h2>
            {/* ... (Ayarlar içeriği aynı kalacak, sadece üst kısımdaki importlar ve Testimonial kısmı değişti) ... */}
            {/* Bölüm 1: Özellik ve Konum Kontrolü */}
            <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Sparkles className="text-yellow-400"/> Aktif Özellikler ve Konumları</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-800 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <input type="checkbox" checked={settings.aiAssistantEnabled} onChange={e => setSettings({...settings, aiAssistantEnabled: e.target.checked})} className="w-6 h-6 accent-red-600" />
                      <label className="font-bold text-lg">Yapay Zeka Asistanı</label>
                    </div>
                    {settings.aiAssistantEnabled && (
                      <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-lg">
                        <span className="text-xs text-slate-400 uppercase font-bold">Konum:</span>
                        <select 
                          className="bg-transparent text-white font-bold outline-none text-sm"
                          value={settings.aiAssistantPosition}
                          onChange={(e) => setSettings({...settings, aiAssistantPosition: e.target.value as WidgetPosition})}
                        >
                          <option value="bottom-right">Sağ Alt</option>
                          <option value="bottom-left">Sol Alt</option>
                          <option value="top-right">Sağ Üst</option>
                          <option value="top-left">Sol Üst</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <input type="checkbox" checked={settings.whatsappEnabled} onChange={e => setSettings({...settings, whatsappEnabled: e.target.checked})} className="w-6 h-6 accent-green-500" />
                      <label className="font-bold text-lg">WhatsApp Butonu</label>
                    </div>
                    {settings.whatsappEnabled && (
                      <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-lg">
                        <span className="text-xs text-slate-400 uppercase font-bold">Konum:</span>
                        <select 
                          className="bg-transparent text-white font-bold outline-none text-sm"
                          value={settings.whatsappPosition}
                          onChange={(e) => setSettings({...settings, whatsappPosition: e.target.value as WidgetPosition})}
                        >
                          <option value="bottom-right">Sağ Alt</option>
                          <option value="bottom-left">Sol Alt</option>
                          <option value="top-right">Sağ Üst</option>
                          <option value="top-left">Sol Üst</option>
                        </select>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Bölüm 2: Temel Bilgiler & SEO */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Globe className="text-red-600"/> Temel Bilgiler & SEO</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Restoran Adı</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.restaurantName} onChange={e => setSettings({...settings, restaurantName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Site Başlığı (SEO Title)</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.seoTitle} onChange={e => setSettings({...settings, seoTitle: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-500 mb-2">Site Açıklaması (Description)</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.seoDescription} onChange={e => setSettings({...settings, seoDescription: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-500 mb-2">Anahtar Kelimeler (Virgülle ayırın)</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.seoKeywords} onChange={e => setSettings({...settings, seoKeywords: e.target.value})} />
                  </div>
               </div>
            </div>

            {/* Bölüm 3: İletişim */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><MapPin className="text-red-600"/> İletişim & Konum</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Telefon</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">WhatsApp Numarası (Başında 90 ile)</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-500 mb-2">Açık Adres</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-500 mb-2">Google Maps Embed URL (iframe src)</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none text-xs font-mono text-slate-600" value={settings.googleMapsUrl} onChange={e => setSettings({...settings, googleMapsUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Çalışma Saatleri</label>
                    <input className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" value={settings.workingHours} onChange={e => setSettings({...settings, workingHours: e.target.value})} />
                  </div>
               </div>
            </div>

            {/* Bölüm 4: Sosyal Medya */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Share2 className="text-red-600"/> Sosyal Medya Linkleri</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['facebookUrl', 'instagramUrl', 'twitterUrl', 'youtubeUrl'].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-bold text-slate-500 mb-2 capitalize">{key.replace('Url', '')}</label>
                      <input 
                        className="w-full p-4 bg-slate-50 rounded-xl border focus:border-red-600 outline-none" 
                        value={(settings as any)[key]} 
                        onChange={e => setSettings({...settings, [key]: e.target.value})} 
                      />
                    </div>
                  ))}
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
