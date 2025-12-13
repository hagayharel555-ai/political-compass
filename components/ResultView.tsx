import React, { useEffect, useState, useRef } from 'react';
import { Coordinates, AnalysisResult, Answer } from '../types';
import CompassChart from './CompassChart';
import { analyzeResults } from '../services/geminiService';
import { reportResult } from '../services/reportingService';
import { RefreshCw, Sparkles, AlertCircle, Share2, Check, Download, Compass, Youtube, Wallet, Shield, ScrollText } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ResultViewProps {
  coordinates: Coordinates;
  compareCoordinates?: Coordinates | null;
  onRetake: () => void;
  initialAnalysis?: AnalysisResult | null;
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  isDarkMode?: boolean;
  isAccessible?: boolean;
  quizDuration?: number;
  answers?: Answer[];
  userName?: string;
  userEmail?: string;
  friendName?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  coordinates, 
  compareCoordinates,
  onRetake, 
  initialAnalysis = null, 
  onAnalysisComplete,
  isDarkMode = false,
  isAccessible = false,
  quizDuration = 0,
  answers = [],
  userName = "אני",
  userEmail = "",
  friendName
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis);
  const [loading, setLoading] = useState(!initialAnalysis);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const hasReportedRef = useRef(false);

  useEffect(() => {
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
        
        if (!hasReportedRef.current) {
            hasReportedRef.current = true;
            reportResult(coordinates, result, {
              duration: quizDuration,
              answers: answers,
              userName: userName || "Anonymous",
              userEmail: userEmail || "",
              comparedWith: friendName // Reporting who we compared with
            });
        }
      }
    };
    fetchAnalysis();
    return () => { isMounted = false; };
  }, [coordinates, initialAnalysis]);

  const handleShare = async () => {
    if (!analysis) return;

    // When sharing, we share the CURRENT user's coordinates AND their Name
    const params = new URLSearchParams();
    params.set('x', coordinates.x.toString());
    params.set('y', coordinates.y.toString());
    params.set('title', encodeURIComponent(analysis.title));
    params.set('desc', encodeURIComponent(analysis.description));
    if (userName) {
        params.set('name', encodeURIComponent(userName));
    }
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    const shareData = {
      title: 'המצפן הפוליטי - התוצאה שלי',
      text: `יצא לי "${analysis.title}" במצפן הפוליטי! בדקו את התוצאה שלי:`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
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
    if (!exportRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 1000
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

  // Helper for analysis cards
  const AnalysisCard = ({ icon: Icon, title, content }: { icon: any, title: string, content?: string }) => {
    if (!content) return null;
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-slate-100 font-bold">
            <Icon className="w-5 h-5 text-yellow-500" />
            <h3>{title}</h3>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {content}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">הפרופיל הפוליטי שלך</h2>
        {compareCoordinates && <p className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">בהשוואה לתוצאה של {friendName || 'חבר'}</p>}
      </div>

      <div ref={resultRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 p-4 rounded-3xl">
        {/* Chart Section */}
        <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 transition-colors duration-300 h-full">
                <CompassChart 
                    coordinates={coordinates} 
                    compareCoordinates={compareCoordinates}
                    userName={userName}
                    friendName={friendName}
                    isDarkMode={isDarkMode} 
                    isAccessible={isAccessible} 
                />
                
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
            {!isAccessible && (
                <>
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
                </>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-yellow-500 dark:text-yellow-400 border border-slate-200 dark:border-slate-700">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">ניתוח AI חכם</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6" role="status">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-yellow-400 rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">מעבד את הנתונים...</p>
                        <p className="text-sm text-slate-500">מנסח את הפרופיל הכלכלי, הביטחוני והחברתי שלך</p>
                    </div>
                </div>
            ) : analysis ? (
                <div className="space-y-6 animate-fadeIn relative z-10 flex flex-col h-full">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                        <span className="text-xs font-bold tracking-wider text-yellow-600 dark:text-yellow-500 uppercase">הגדרה ראשית</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1 leading-tight">{analysis.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                            {analysis.description}
                        </p>
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                        <AnalysisCard icon={Wallet} title="כלכלה וחברה" content={analysis.economicAnalysis} />
                        <AnalysisCard icon={Shield} title="ביטחון ולאום" content={analysis.nationalAnalysis} />
                        <AnalysisCard icon={ScrollText} title="דת ומדינה" content={analysis.religiousAnalysis} />
                    </div>
                </div>
            ) : (
                <div className="text-red-500 flex flex-col items-center justify-center h-full">
                    <AlertCircle className="w-10 h-10 mb-2" />
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
                    className="group px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                    <span>{copied ? 'הקישור הועתק!' : 'שתף תוצאה'}</span>
                </button>
                
                <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="group px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                    <span>{downloading ? 'מוריד...' : 'הורד תמונה'}</span>
                </button>
            </>
        )}

        <button 
          onClick={onRetake}
          className="group px-8 py-4 bg-yellow-400 text-slate-950 font-bold rounded-xl hover:bg-yellow-300 transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
        >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>{compareCoordinates ? 'סיים השוואה / התחל מחדש' : 'התחל מבחן חדש'}</span>
        </button>
      </div>

      {/* Hidden Export View */}
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
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-bl-full z-0"></div>
             
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

             <div className="flex flex-col items-center gap-8">
                 <div className="w-[500px] h-[550px]">
                     <CompassChart 
                        coordinates={coordinates} 
                        compareCoordinates={compareCoordinates}
                        userName={userName}
                        friendName={friendName}
                        isDarkMode={false}
                        isAccessible={false}
                        hideControls={true}
                     />
                 </div>

                 {analysis && (
                     <div className="w-full bg-white rounded-2xl p-6 border-2 border-slate-200 text-center shadow-sm">
                         <h2 className="text-4xl font-black text-slate-900 mb-2">{analysis.title}</h2>
                         <p className="text-lg text-slate-700 leading-relaxed px-4 mb-4">
                             {analysis.description}
                         </p>
                         
                         {/* Detailed Export Cards */}
                         <div className="grid grid-cols-3 gap-4 text-right">
                             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-1 text-sm">כלכלה</h4>
                                <p className="text-xs text-slate-600 line-clamp-3">{analysis.economicAnalysis}</p>
                             </div>
                             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-1 text-sm">ביטחון</h4>
                                <p className="text-xs text-slate-600 line-clamp-3">{analysis.nationalAnalysis}</p>
                             </div>
                             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-1 text-sm">דת ומדינה</h4>
                                <p className="text-xs text-slate-600 line-clamp-3">{analysis.religiousAnalysis}</p>
                             </div>
                         </div>
                     </div>
                 )}
             </div>

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