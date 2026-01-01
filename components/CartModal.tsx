
import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, ChevronRight, User } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, clearCart }) => {
  const [viewMode, setViewMode] = useState<'cart' | 'waiter'>('cart');
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
              {viewMode === 'cart' ? <ShoppingBag size={24} /> : <User size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold">
                {viewMode === 'cart' ? 'Sepetim' : 'Sipariş Listem'}
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                {viewMode === 'cart' ? `${cart.length} Farklı Ürün` : 'Garsona Gösterin'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={32} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 shrink-0">
          <button 
            onClick={() => setViewMode('cart')}
            className={`flex-1 py-5 font-bold transition-all border-b-2 ${viewMode === 'cart' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400'}`}
          >
            Düzenle
          </button>
          <button 
            onClick={() => setViewMode('waiter')}
            className={`flex-1 py-5 font-bold transition-all border-b-2 ${viewMode === 'waiter' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400'}`}
          >
            Garsona Göster
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Sepetiniz Boş</h3>
              <p className="text-slate-500 mb-8">Henüz hiçbir lezzet seçmediniz.</p>
              <button 
                onClick={onClose}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-600/20"
              >
                Menüye Dön
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 transition-all ${viewMode === 'waiter' ? 'p-8 border-red-200' : ''}`}>
                  {viewMode === 'cart' && (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className={`font-bold text-slate-900 leading-tight ${viewMode === 'waiter' ? 'text-2xl' : 'text-lg'}`}>
                      {item.name}
                    </h4>
                    <p className="text-red-600 font-bold text-sm mt-1">{item.price} TL x {item.quantity}</p>
                  </div>

                  {viewMode === 'cart' ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600"><Minus size={16} /></button>
                        <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600"><Plus size={16} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  ) : (
                    <div className="bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                      {item.quantity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-8 bg-white border-t border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Toplam Tutar</span>
              <span className="text-3xl font-serif font-black text-slate-900">{totalPrice} TL</span>
            </div>
            
            {viewMode === 'cart' ? (
              <div className="flex gap-4">
                <button 
                  onClick={clearCart}
                  className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <Trash2 size={24} />
                </button>
                <button 
                  onClick={() => setViewMode('waiter')}
                  className="flex-1 bg-slate-900 hover:bg-red-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <ChevronRight size={24} /> Sipariş Listesini Hazırla
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                  <User className="text-red-600 shrink-0" size={24} />
                  <p className="text-red-700 text-sm font-medium">Lütfen bu ekranı masanıza gelen garsona gösteriniz.</p>
                </div>
                <button 
                  onClick={() => setViewMode('cart')}
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-3xl transition-all shadow-xl"
                >
                  Listeyi Düzenle
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
