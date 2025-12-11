import React, { useEffect, useState } from 'react';
import { Coordinates, AnalysisResult } from '../types';
import CompassChart from './CompassChart';
import { analyzeResults } from '../services/geminiService';
import { RefreshCw, Share2, Sparkles, AlertCircle } from 'lucide-react';

interface ResultViewProps {
  coordinates: Coordinates;
  onRetake: () => void;
  initialAnalysis?: AnalysisResult | null;
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  coordinates, 
  onRetake, 
  initialAnalysis = null, 
  onAnalysisComplete 
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis);
  const [loading, setLoading] = useState(!initialAnalysis);

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
      }
    };
    fetchAnalysis();
    return () => { isMounted = false; };
  }, [coordinates, initialAnalysis]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">הפרופיל הפוליטי שלך</h2>
        <p className="text-lg text-slate-500">ניתוח מעמיק המבוסס על תשובותיך</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Chart Section */}
        <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
                <CompassChart coordinates={coordinates} />
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ציר כלכלי</span>
                        <div className="text-lg font-bold text-slate-800">
                             {coordinates.x > 0 ? 'ימין' : 'שמאל'} 
                             <span className="mr-2 text-sm font-normal text-slate-500">({Math.abs(coordinates.x).toFixed(1)})</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ציר חברתי</span>
                        <div className="text-lg font-bold text-slate-800">
                            {coordinates.y > 0 ? 'סמכותני' : 'ליברלי'} 
                            <span className="mr-2 text-sm font-normal text-slate-500">({Math.abs(coordinates.y).toFixed(1)})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Analysis Section */}
        <div className="lg:col-span-5">
            <div className="h-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Background Blob for effect */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-indigo-900">ניתוח AI חכם</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-600">מעבד את הנתונים...</p>
                        <p className="text-sm">הבינה המלאכותית מנסחת את הפרופיל שלך</p>
                    </div>
                </div>
            ) : analysis ? (
                <div className="space-y-6 animate-fadeIn relative z-10">
                <div className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">הגדרה ראשית</span>
                    <h4 className="text-3xl font-black text-slate-800 mt-1 leading-tight">{analysis.title}</h4>
                </div>
                
                <div>
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">משמעות</span>
                    <p className="text-slate-600 leading-relaxed mt-2 text-lg">
                    {analysis.description}
                    </p>
                </div>

                <div className="bg-indigo-50/80 p-5 rounded-2xl border border-indigo-100">
                    <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">דמות / אידיאולוגיה קרובה</span>
                    <p className="text-indigo-900 font-bold text-lg mt-1">{analysis.ideology}</p>
                </div>
                </div>
            ) : (
                <div className="text-red-500 flex flex-col items-center justify-center h-full gap-2">
                    <AlertCircle className="w-10 h-10" />
                    <p>שגיאה בטעינת הנתונים</p>
                </div>
            )}
            </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={onRetake}
          className="group relative px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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