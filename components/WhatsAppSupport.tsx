
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface WhatsAppSupportProps {
  settings: SiteSettings;
}

const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({ settings }) => {
  const getPositionClasses = () => {
    switch (settings.whatsappPosition) {
      case 'bottom-right': return 'bottom-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right': return 'top-24 right-6';
      case 'top-left': return 'top-24 left-6';
      default: return 'bottom-6 left-6';
    }
  };

  return (
    <a
      href={`https://wa.me/${settings.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${getPositionClasses()} z-[60] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group`}
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap font-bold text-sm">
        WhatsApp Destek
      </span>
    </a>
  );
};

export default WhatsAppSupport;
