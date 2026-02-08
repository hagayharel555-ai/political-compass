import React, { useState, useEffect } from 'react';
import { Accessibility, X, Type, Eye, Link2, MonitorStop, RefreshCw, ZoomIn, ZoomOut, Moon } from 'lucide-react';

interface AccessibilityMenuProps {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ 
  isHighContrast, 
  toggleHighContrast,
  isDarkMode,
  toggleTheme
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isReadableFont, setIsReadableFont] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);

  // Apply classes to body
  useEffect(() => {
    const body = document.body;
    
    // Grayscale
    if (isGrayscale) body.classList.add('acc-grayscale');
    else body.classList.remove('acc-grayscale');

    // Readable Font
    if (isReadableFont) body.classList.add('acc-readable-font');
    else body.classList.remove('acc-readable-font');

    // Highlight Links
    if (highlightLinks) body.classList.add('acc-highlight-links');
    else body.classList.remove('acc-highlight-links');

    // Stop Animations
    if (stopAnimations) body.classList.add('acc-no-animations');
    else body.classList.remove('acc-no-animations');

    // Font Size
    document.documentElement.style.fontSize = `${fontSize}%`;

  }, [isGrayscale, isReadableFont, highlightLinks, stopAnimations, fontSize]);

  const handleReset = () => {
    setFontSize(100);
    setIsGrayscale(false);
    setIsReadableFont(false);
    setHighlightLinks(false);
    setStopAnimations(false);
    if (isHighContrast) toggleHighContrast();
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-4 left-4 z-[100] p-3 rounded-full shadow-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
        }`}
        aria-label="תפריט נגישות"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-8 h-8" /> : <Accessibility className="w-8 h-8" />}
      </button>

      {/* Menu Popup */}
      {isOpen && (
        <div 
            className="fixed bottom-20 left-4 z-[100] w-72 bg-white dark:bg-slate-900 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-700 overflow-hidden animate-fadeIn"
            role="dialog"
            aria-label="אפשרויות נגישות"
        >
          {/* Header */}
          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              כלי נגישות
            </h2>
            <button 
                onClick={handleReset}
                className="text-xs font-medium text-red-600 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                aria-label="אפס הגדרות נגישות"
            >
                <RefreshCw className="w-3 h-3" />
                איפוס
            </button>
          </div>

          {/* Controls */}
          <div className="p-2 space-y-1 overflow-y-auto max-h-[60vh]">
            
            {/* Font Size Control */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">גודל טקסט</span>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setFontSize(prev => Math.max(70, prev - 10))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-900 dark:text-white"
                        aria-label="הקטן טקסט"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white w-12 text-center">{fontSize}%</span>
                    <button 
                        onClick={() => setFontSize(prev => Math.min(200, prev + 10))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-900 dark:text-white"
                        aria-label="הגדל טקסט"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Toggle Grid */}
            <div className="grid grid-cols-1 gap-1">
                <AccessibilityOption 
                    label="ניגודיות גבוהה" 
                    icon={<Eye className="w-5 h-5" />} 
                    isActive={isHighContrast} 
                    onClick={toggleHighContrast} 
                />
                <AccessibilityOption 
                    label="גווני אפור" 
                    icon={<div className="w-5 h-5 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>} 
                    isActive={isGrayscale} 
                    onClick={() => setIsGrayscale(!isGrayscale)} 
                />
                <AccessibilityOption 
                    label="גופן קריא" 
                    icon={<Type className="w-5 h-5" />} 
                    isActive={isReadableFont} 
                    onClick={() => setIsReadableFont(!isReadableFont)} 
                />
                <AccessibilityOption 
                    label="הדגשת קישורים" 
                    icon={<Link2 className="w-5 h-5" />} 
                    isActive={highlightLinks} 
                    onClick={() => setHighlightLinks(!highlightLinks)} 
                />
                <AccessibilityOption 
                    label="עצור אנימציות" 
                    icon={<MonitorStop className="w-5 h-5" />} 
                    isActive={stopAnimations} 
                    onClick={() => setStopAnimations(!stopAnimations)} 
                />
                 <AccessibilityOption 
                    label={isDarkMode ? "מצב יום" : "מצב לילה"}
                    icon={<Moon className="w-5 h-5" />} 
                    isActive={isDarkMode} 
                    onClick={toggleTheme} 
                />
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 dark:bg-slate-900 text-center border-t border-slate-200 dark:border-slate-700">
             <span className="text-[10px] text-slate-400">מותאם לתקן 5568</span>
          </div>
        </div>
      )}
    </>
  );
};

// Helper Sub-component for buttons
const AccessibilityOption: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full p-3 rounded-lg flex items-center justify-between transition-all border ${
            isActive 
            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
        aria-pressed={isActive}
    >
        <span className="flex items-center gap-3 font-medium">
            {icon}
            {label}
        </span>
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            isActive ? 'border-white bg-white' : 'border-slate-400'
        }`}>
            {isActive && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
        </div>
    </button>
);

export default AccessibilityMenu;