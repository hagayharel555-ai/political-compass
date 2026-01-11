import React from 'react';
import { Youtube, X, ExternalLink, BellRing } from 'lucide-react';

interface ChannelPopupProps {
  onClose: () => void;
}

const ChannelPopup: React.FC<ChannelPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Youtube className="w-12 h-12 text-red-600" fill="currentColor" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">אוהבים תוכן פוליטי מעמיק?</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
            הירשמו לערוצים שלנו כדי לקבל את כל הניתוחים, הראיונות והנתונים לפני כולם.
          </p>

          <div className="space-y-4">
            {/* Channel 1 */}
            <a 
              href="https://www.youtube.com/@ProjectDaat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900">
                  <BellRing className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="block font-black text-slate-900 dark:text-white text-lg">פרוייקט דעת</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">פודקאסטים וראיונות עומק</span>
                </div>
              </div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 group-hover:scale-105 transition-transform">
                <span>הרשמה</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            {/* Channel 2 */}
            <a 
              href="https://www.youtube.com/@HagaiDaat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-200 flex items-center justify-center text-white dark:text-slate-900">
                  <Youtube className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="block font-black text-slate-900 dark:text-white text-lg">חגי</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">ניתוחים פוליטיים ודעות אישיות</span>
                </div>
              </div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 group-hover:scale-105 transition-transform">
                <span>הרשמה</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>

          <button 
            onClick={onClose}
            className="mt-8 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            אולי מאוחר יותר
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelPopup;