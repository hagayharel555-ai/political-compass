import React, { useEffect, useState, useRef } from 'react';
import { Coordinates, AnalysisResult, Answer } from '../types';
import CompassChart from './CompassChart';
import { analyzeResults } from '../services/geminiService';
import { reportResult } from '../services/reportingService';
import { RefreshCw, Share2, Check, Download, Compass, Wallet, Shield, ScrollText, RotateCcw, Youtube } from 'lucide-react';
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
  
  const hasReportedRef = useRef(false);
  const downloadContainerRef = useRef<HTMLDivElement>(null);

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
              comparedWith: friendName
            });
        }
      }
    };
    fetchAnalysis();
    return () => { isMounted = false; };
  }, [coordinates, initialAnalysis]);

  const handleShare = async () => {
    if (!analysis) return;
    const nameForShare = userName && userName !== "אני" ? userName : "מישהו";
    const params = new URLSearchParams();
    params.set('x', coordinates.x.toString());
    params.set('y', coordinates.y.toString());
    params.set('z', coordinates.z.toString());
    params.set('title', encodeURIComponent(analysis.title));
    params.set('desc', encodeURIComponent(analysis.description));
    params.set('name', encodeURIComponent(nameForShare));
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    const text = `התוצאה שלי במצפן הפוליטי: ${analysis.title}. בואו לגלות את שלכם:`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'המצפן הפוליטי', text: text, url: shareUrl });
      } catch (err) { console.log('Error sharing:', err); }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) { console.error('Failed to copy:', err); }
    }
  };

  const handleDownload = async () => {
    if (!downloadContainerRef.current || downloading) return;
    setDownloading(true);
    
    try {
      await new Promise(r => setTimeout(r, 800));
      
      const canvas = await html2canvas(downloadContainerRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, 
        useCORS: true,
        logging: false,
        width: 1000,
        height: 1600,
        onclone: (clonedDoc) => {
            // Ensure fonts are loaded in the clone
            const element = clonedDoc.querySelector('[data-download-container]') as HTMLElement;
            if (element) {
                element.style.fontFamily = "'Rubik', sans-serif";
            }
        }
      });
      
      const link = document.createElement('a');
      link.download = `political-compass-${userName || 'result'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="relative">
          <RefreshCw className="w-16 h-16 text-yellow-500 animate-spin" />
        </div>
        <div className="text-center px-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">מחשב תוצאות...</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">המערכת מעבדת את התשובות שלך</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20 animate-fadeIn" dir="rtl">
      
      {/* 
          Hidden Download Infographic Card 
          Fixed: Uses dir="ltr" to prevent html2canvas text reversal bug
          Layout is manually aligned to look RTL
      */}
      <div className="fixed -left-[5000px] top-0 pointer-events-none">
        <div 
          ref={downloadContainerRef}
          data-download-container
          className="w-[1000px] h-[1600px] bg-white p-20 flex flex-col items-center border-[20px] border-slate-900 rounded-[60px] relative"
          style={{ fontFamily: 'Rubik, sans-serif' }}
          dir="ltr" 
        >
          {/* Header Row - Manually ordered for LTR container to look RTL (Date Left, Logo Right) */}
          <div className="w-full flex items-start justify-between mb-24">
            
            {/* Left Side: Date (in LTR this is physically left) */}
            <div className="text-left">
              <span className="block text-[28px] font-bold text-slate-400 mb-2 text-right">הופק בתאריך</span>
              <span className="block text-[36px] font-black text-slate-900 text-right">{currentDate}</span>
            </div>
            
            {/* Right Side: Logo (in LTR this is physically right) */}
            <div className="relative">
                <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[250px] bg-yellow-400 rounded-bl-[150px] z-0"></div>
                <div className="relative z-10 flex flex-col items-end pt-4 pr-10">
                   <div className="flex items-center gap-4 mb-2 flex-row-reverse">
                        <h1 className="text-[52px] font-black text-slate-950 leading-none">המצפן הפוליטי</h1>
                        <div className="bg-slate-900 p-3 rounded-2xl border-4 border-slate-950">
                            <Compass className="w-16 h-16 text-yellow-400" />
                        </div>
                   </div>
                   <span className="text-[32px] font-black text-yellow-600 uppercase">פרוייקט דעת</span>
                </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="w-full flex justify-center scale-[1.3] mb-32 mt-10">
            <CompassChart coordinates={coordinates} isPrinting={true} hideControls={true} />
          </div>

          {/* Analysis Card - Text Alignment Forced Right */}
          <div className="w-full bg-slate-50 border-[3px] border-slate-200 rounded-[50px] p-20 text-center mb-10 shadow-sm">
             <h2 className="text-[64px] font-black text-slate-900 mb-8 leading-tight" style={{ direction: 'rtl' }}>
                {analysis?.title}
             </h2>
             <p className="text-[36px] text-slate-700 font-bold leading-relaxed mb-16 px-10" style={{ direction: 'rtl' }}>
               {analysis?.description}
             </p>

             {/* Three Columns Analysis - Order reversed for visual RTL in LTR container */}
             <div className="grid grid-cols-3 gap-10 text-right">
                {/* Column 3 (Left physically) -> Religious */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-[32px] font-black text-slate-900 mb-4">דת ומדינה</span>
                    <p className="text-[22px] text-slate-500 font-medium text-center" style={{ direction: 'rtl' }}>{analysis?.religiousAnalysis}</p>
                </div>
                {/* Column 2 (Center) -> Security */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-[32px] font-black text-slate-900 mb-4">ביטחון</span>
                    <p className="text-[22px] text-slate-500 font-medium text-center" style={{ direction: 'rtl' }}>{analysis?.nationalAnalysis}</p>
                </div>
                {/* Column 1 (Right physically) -> Economy */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <span className="text-[32px] font-black text-slate-900 mb-4">כלכלה</span>
                    <p className="text-[22px] text-slate-500 font-medium text-center" style={{ direction: 'rtl' }}>{analysis?.economicAnalysis}</p>
                </div>
             </div>
          </div>

          {/* Footer - Manually aligned */}
          <div className="w-full mt-auto flex flex-col items-center gap-10">
             <span className="text-[44px] font-black text-slate-950 tracking-tighter">politicalil.vercel.app</span>
             <div className="flex gap-20">
                <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-16 h-10 bg-red-600 rounded-md"></div>
                    <span className="text-[32px] font-black text-slate-500">@ProjectDaat</span>
                </div>
                <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-16 h-10 bg-red-600 rounded-md"></div>
                    <span className="text-[32px] font-black text-slate-500">@HagaiDaat</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Visible UI Section (Standard RTL) */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 transition-colors duration-300">
        <div className="p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {userName && userName !== "אני" ? `${userName}, אתה: ` : 'הזהות הפוליטית שלך: '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-200 dark:to-yellow-500">
                {analysis?.title}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              {analysis?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
              <CompassChart 
                coordinates={coordinates} 
                compareCoordinates={compareCoordinates}
                userName={userName}
                friendName={friendName}
                isDarkMode={isDarkMode}
                isAccessible={isAccessible}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 h-fit rounded-xl"><Wallet className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white mb-1">כלכלה וחברה</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{analysis?.economicAnalysis}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 h-fit rounded-xl"><Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white mb-1">ביטחון ולאומיות</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{analysis?.nationalAnalysis}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 h-fit rounded-xl"><ScrollText className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white mb-1">שמרנות ודת</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{analysis?.religiousAnalysis}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-8 py-4 bg-yellow-400 text-slate-950 font-black rounded-2xl hover:bg-yellow-300 transition-all hover:-translate-y-1 shadow-lg"
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              <span>{copied ? 'הקישור הועתק!' : 'שתף תוצאה'}</span>
            </button>

            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:-translate-y-1 shadow-sm disabled:opacity-50"
            >
              <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'מייצר אינפוגרפיקה...' : 'הורד כאינפוגרפיקה'}</span>
            </button>

            <button 
              onClick={onRetake}
              className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>ביצוע מבחן מחדש</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;