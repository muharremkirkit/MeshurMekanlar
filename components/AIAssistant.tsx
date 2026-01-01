
import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, X, Loader2 } from 'lucide-react';
import { getFoodRecommendation } from '../services/geminiService';
import { MenuItem, SiteSettings } from '../types';

interface AIAssistantProps {
  menuItems: MenuItem[];
  settings: SiteSettings;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ menuItems, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `Merhaba! Ben ${settings.restaurantName}'ın sanal garsonuyum. Bugün size ne önerebilirim?` }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await getFoodRecommendation(userText, menuItems, settings.restaurantName);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'Şu an öneri yapamıyorum.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Hata oluştu.' }]);
    } finally {
      setLoading(false);
    }
  };

  const getPositionClasses = () => {
    switch (settings.aiAssistantPosition) {
      case 'bottom-right': return 'bottom-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right': return 'top-24 right-6';
      case 'top-left': return 'top-24 left-6';
      default: return 'bottom-6 right-6';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-[60]`}>
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-10">
          <div className="bg-brand p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span className="font-bold">Sanal Garson</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand text-white' : 'bg-white shadow-sm border'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Yazın..." className="flex-1 bg-slate-100 rounded-lg px-4 py-2 outline-none" />
            <button type="submit" className="bg-brand text-white p-2 rounded-lg"><Send size={18} /></button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-brand text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110">
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
