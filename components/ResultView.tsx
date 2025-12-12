import React, { useEffect, useState, useRef } from 'react';
import { Coordinates, AnalysisResult, Answer } from '../types';
import CompassChart from './CompassChart';
import { analyzeResults } from '../services/geminiService';
import { reportResult } from '../services/reportingService';
import { RefreshCw, Sparkles, AlertCircle, Share2, Check, Download, Compass, Youtube } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ResultViewProps {
  coordinates: Coordinates;
  onRetake: () => void;
  initialAnalysis?: AnalysisResult | null;
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  isDarkMode?: boolean;
  isAccessible?: boolean;
  // Analytics and User Data
  quizDuration?: number;
  answers?: Answer[];
  userName?: string;
  userEmail?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  coordinates, 
  onRetake, 
  initialAnalysis = null, 
  onAnalysisComplete,
  isDarkMode = false,
  isAccessible = false,
  quizDuration = 0,
  answers = [],
  userName = "Anonymous",
  userEmail = ""
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis);
  const [loading, setLoading] = useState(!initialAnalysis);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Ref for the visible result view (optional use)
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Ref for the dedicated export view (hidden from user)
  const exportRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to ensure we only report once per mounting/calculation
  const hasReportedRef = useRef(false);

  useEffect(() => {
    // If we loaded from history (initialAnalysis exists), we don't report again.
    if (initialAnalysis) {
      setAnalysis(initialAnalysis);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchAnalysis = async () => {
      setLoading(true);
      const result = await analyzeResults(coordinates);
      
      if (isMounted) {
        setAnalysis(result);
        setLoading(false);
        if (onAnalysisComplete) {
          onAnalysisComplete(result);
        }
        
        // Report result to the owner (Google Sheet)
        if (!hasReportedRef.current) {
            hasReportedRef.current = true;
            reportResult(coordinates, result, {
              duration: quizDuration,
              answers: answers,
              userName: userName,
              userEmail: userEmail
            });
        }
      }
    };
    fetchAnalysis();
    return () => { isMounted = false; };
  }, [coordinates, initialAnalysis]);

  const handleShare = async () => {
    if (!analysis) return;

    // Construct URL with parameters
    const params = new URLSearchParams();
    params.set('x', coordinates.x.toString());
    params.set('y', coordinates.y.toString());
    params.set('title', encodeURIComponent(analysis.title));
    params.set('desc', encodeURIComponent(analysis.description));
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    const shareData = {
      title: 'המצפן הפוליטי - התוצאה שלי',
      text: `יצא לי "${analysis.title}" במצפן הפוליטי! בדקו את התוצאה שלי:`,
      url: shareUrl
    };

    // Use Web Share API if available (Mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to Clipboard API
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleDownload = async () => {
    // Target the specific export layout
    if (!exportRef.current) return;
    setDownloading(true);

    try {
      // Create canvas from the hidden export ref
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff', // Always white for clean export
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        width: 800, // Fixed width for consistency
        windowWidth: 1000 // Ensure layout doesn't break
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `political-compass-result-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to download image:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">הפרופיל הפוליטי שלך</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">ניתוח מעמיק המבוסס על תשובותיך</p>
      </div>

      <div ref={resultRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 p-4 rounded-3xl">
        {/* Chart Section */}
        <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 transition-colors duration-300">
                <CompassChart coordinates={coordinates} isDarkMode={isDarkMode} isAccessible={isAccessible} />
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ציר כלכלי</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                             {coordinates.x > 0 ? 'ימין' : 'שמאל'} 
                             <span className="mr-2 text-sm font-normal text-yellow-600 dark:text-yellow-500/80">({Math.abs(coordinates.x).toFixed(1)})</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ציר חברתי</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {coordinates.y > 0 ? 'סמכותני' : 'ליברלי'} 
                            <span className="mr-2 text-sm font-normal text-yellow-600 dark:text-yellow-500/80">({Math.abs(coordinates.y).toFixed(1)})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Analysis Section */}
        <div className="lg:col-span-5">
            <div className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col relative overflow-hidden group transition-colors duration-300">
            {/* Hiding decorative elements in accessible mode */}
            {!isAccessible && (
                <>
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                </>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-yellow-500 dark:text-yellow-400 border border-slate-200 dark:border-slate-700">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">ניתוח AI חכם</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6" role="status" aria-label="מעבד נתונים">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-yellow-400 rounded-full animate-spin"></div>
                        {!isAccessible && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-yellow-500/50 animate-pulse" />
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">מעבד את הנתונים...</p>
                        <p className="text-sm text-slate-500">הבינה המלאכותית מנסחת את הפרופיל שלך</p>
                    </div>
                </div>
            ) : analysis ? (
                <div className="space-y-6 animate-fadeIn relative z-10">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <span className="text-xs font-bold tracking-wider text-yellow-600 dark:text-yellow-500 uppercase">הגדרה ראשית</span>
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1 leading-tight">{analysis.title}</h4>
                </div>
                
                <div>
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">משמעות</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-2 text-lg">
                    {analysis.description}
                    </p>
                </div>

                </div>
            ) : (
                <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2" role="alert">
                    <AlertCircle className="w-10 h-10" />
                    <p>שגיאה בטעינת הנתונים</p>
                </div>
            )}
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        {analysis && (
            <>
                <button 
                    onClick={handleShare}
                    className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden shadow-md flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    aria-label="שתף תוצאה"
                >
                    {copied ? (
                        <>
                            <Check className="w-5 h-5 text-green-500" />
                            <span>הקישור הועתק!</span>
                        </>
                    ) : (
                        <>
                            <Share2 className="w-5 h-5" />
                            <span>שתף תוצאה</span>
                        </>
                    )}
                </button>
                
                <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden shadow-md flex items-center justify-center gap-3 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    aria-label="הורד תמונה"
                >
                    <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                    <span>{downloading ? 'מוריד...' : 'הורד תמונה'}</span>
                </button>
            </>
        )}

        <button 
          onClick={onRetake}
          className="group relative px-8 py-4 bg-yellow-400 text-slate-950 font-bold rounded-xl hover:bg-yellow-300 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900 dark:focus:ring-white"
          aria-label="התחל מבחן חדש"
        >
          <div className="flex items-center gap-3 relative z-10">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>התחל מבחן חדש</span>
          </div>
        </button>
      </div>

      {/* Hidden Export View - Clean Layout for Image Generation */}
      <div 
        ref={exportRef} 
        style={{ 
            position: 'absolute', 
            left: '-9999px', 
            width: '800px', 
            padding: '40px',
            backgroundColor: '#ffffff',
            direction: 'rtl',
            fontFamily: 'Rubik, sans-serif'
        }}
        className="flex flex-col items-center"
      >
         <div className="w-full border-4 border-slate-900 rounded-3xl p-8 bg-slate-50 relative overflow-hidden">
             {/* Decorative Accent */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-bl-full z-0"></div>
             
             {/* Header */}
             <div className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
                 <div className="flex items-center gap-3">
                     <div className="bg-yellow-400 p-3 rounded-xl border-2 border-slate-900">
                         <Compass className="w-8 h-8 text-slate-900" />
                     </div>
                     <div>
                         <h1 className="text-3xl font-black text-slate-900 leading-none">המצפן הפוליטי</h1>
                         <span className="text-yellow-600 font-bold tracking-wider">פרוייקט דעת</span>
                     </div>
                 </div>
                 <div className="text-left">
                     <span className="block text-sm text-slate-500 font-medium">הופק בתאריך</span>
                     <span className="block font-bold text-slate-900">{new Date().toLocaleDateString('he-IL')}</span>
                 </div>
             </div>

             {/* Content Layout */}
             <div className="flex flex-col items-center gap-8">
                 {/* Chart - Scaled Up */}
                 <div className="w-[500px] h-[550px]">
                     <CompassChart 
                        coordinates={coordinates} 
                        isDarkMode={false} // Force Light Mode
                        isAccessible={false} // Force Standard Mode
                        hideControls={true} // Hide UI controls
                     />
                 </div>

                 {/* Results */}
                 {analysis && (
                     <div className="w-full bg-white rounded-2xl p-6 border-2 border-slate-200 text-center shadow-sm">
                         <h2 className="text-4xl font-black text-slate-900 mb-2">{analysis.title}</h2>
                         <p className="text-xl text-slate-700 leading-relaxed px-8">
                             {analysis.description}
                         </p>
                         <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
                             <div className="px-4 py-2 bg-slate-100 rounded-lg">
                                 <span className="text-sm text-slate-500 font-bold block">ציר כלכלי (X)</span>
                                 <span className="text-lg font-black text-slate-900" dir="ltr">{coordinates.x.toFixed(1)}</span>
                             </div>
                             <div className="px-4 py-2 bg-slate-100 rounded-lg">
                                 <span className="text-sm text-slate-500 font-bold block">ציר חברתי (Y)</span>
                                 <span className="text-lg font-black text-slate-900" dir="ltr">{coordinates.y.toFixed(1)}</span>
                             </div>
                         </div>
                     </div>
                 )}
             </div>

             {/* Footer - Updated Link and YouTube handles */}
             <div className="mt-8 pt-6 border-t border-slate-100 w-full flex flex-col items-center gap-2">
                 <div className="text-slate-900 font-bold text-xl tracking-wide" dir="ltr">politicalil.vercel.app</div>
                 <div className="flex items-center gap-6 text-slate-500 font-medium" dir="ltr">
                    <div className="flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-[#FF0000]" fill="currentColor" /> 
                        <span>@ProjectDaat</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-[#FF0000]" fill="currentColor" />
                        <span>@HagaiDaat</span>
                    </div>
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default ResultView;