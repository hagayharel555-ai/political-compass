import React, { useEffect, useState, useRef } from 'react';
import { Coordinates, AnalysisResult, Answer } from '../types';
import CompassChart from './CompassChart';
import { analyzeResults } from '../services/geminiService';
import { reportResult } from '../services/reportingService';
import { RefreshCw, Sparkles, AlertCircle, Share2, Check, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ResultViewProps {
  coordinates: Coordinates;
  onRetake: () => void;
  initialAnalysis?: AnalysisResult | null;
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  isDarkMode?: boolean;
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
  quizDuration = 0,
  answers = [],
  userName = "Anonymous",
  userEmail = ""
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis);
  const [loading, setLoading] = useState(!initialAnalysis);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);
  
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
    if (!resultRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', // slate-950 or slate-50
        scale: 2, // Better quality
        useCORS: true,
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

      <div ref={resultRef} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 p-4 rounded-3xl ${downloading ? (isDarkMode ? 'bg-slate-950' : 'bg-slate-50') : ''}`}>
        {/* Chart Section */}
        <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 transition-colors duration-300">
                <CompassChart coordinates={coordinates} isDarkMode={isDarkMode} />
                
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
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
            
            {/* Background Blob for effect */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-yellow-500 dark:text-yellow-400 border border-slate-200 dark:border-slate-700">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">ניתוח AI חכם</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-yellow-400 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-yellow-500/50 animate-pulse" />
                        </div>
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
                <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2">
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
                    className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden shadow-md flex items-center justify-center gap-3"
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
                    className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                    <span>{downloading ? 'מוריד...' : 'הורד תמונה'}</span>
                </button>
            </>
        )}

        <button 
          onClick={onRetake}
          className="group relative px-8 py-4 bg-yellow-400 text-slate-950 font-bold rounded-xl hover:bg-yellow-300 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden shadow-md"
        >
          <div className="flex items-center gap-3 relative z-10">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>התחל מבחן חדש</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ResultView;