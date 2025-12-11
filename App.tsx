import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import ResultView from './components/ResultView';
import { Answer, Coordinates, Question, Axis, AnalysisResult } from './types';
import { QUESTIONS } from './constants';
import { Compass, History, BrainCircuit, HeartHandshake } from 'lucide-react';
import { getSavedResult, saveResult, hasSavedResult } from './utils/storage';

enum AppState {
  WELCOME,
  QUIZ,
  RESULTS
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    setHasHistory(hasSavedResult());
  }, []);

  const calculateResults = (answers: Answer[]) => {
    let econScore = 0;
    let socialScore = 0;
    
    const econQuestionsCount = QUESTIONS.filter(q => q.axis === Axis.ECONOMIC).length;
    const socialQuestionsCount = QUESTIONS.filter(q => q.axis === Axis.SOCIAL).length;

    answers.forEach(ans => {
      const question = QUESTIONS.find(q => q.id === ans.questionId);
      if (!question) return;

      const impact = ans.score * question.direction;

      if (question.axis === Axis.ECONOMIC) {
        econScore += impact;
      } else {
        socialScore += impact;
      }
    });

    const normalizedX = (econScore / (2 * econQuestionsCount)) * 10;
    const normalizedY = (socialScore / (2 * socialQuestionsCount)) * 10;

    setCoordinates({ x: normalizedX, y: normalizedY });
    setCurrentAnalysis(null);
    setAppState(AppState.RESULTS);
  };

  const handleAnalysisComplete = (analysis: AnalysisResult) => {
    saveResult({
      coordinates,
      analysis,
      timestamp: Date.now()
    });
    setHasHistory(true);
  };

  const handleLoadHistory = () => {
    const saved = getSavedResult();
    if (saved) {
      setCoordinates(saved.coordinates);
      setCurrentAnalysis(saved.analysis);
      setAppState(AppState.RESULTS);
    }
  };

  const handleStart = () => {
    setAppState(AppState.QUIZ);
  };

  const handleRetake = () => {
    setAppState(AppState.WELCOME);
    setCoordinates({ x: 0, y: 0 });
    setCurrentAnalysis(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" dir="rtl">
      {/* Header */}
      <header className="glass border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 text-slate-100 cursor-pointer group" 
            onClick={() => setAppState(AppState.WELCOME)}
          >
            <div className="bg-yellow-400 text-slate-950 p-1.5 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.3)] group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-slate-100">המצפן הפוליטי</h1>
                <span className="text-xs text-yellow-400 font-bold tracking-wider">פרוייקט דעת</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
            <span>פותח ע"י חגי הראל</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span>מופעל ע"י Gemini AI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 relative overflow-hidden">
        {/* Decorative background elements (Dark/Yellow Theme) */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-700/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="z-10 w-full">
            {appState === AppState.WELCOME && (
            <div className="max-w-2xl mx-auto px-4 text-center animate-fadeIn">
                <div className="bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden ring-1 ring-white/5">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
                
                <div className="mb-8 inline-flex items-center justify-center p-4 bg-slate-800/50 rounded-2xl shadow-inner border border-slate-700">
                    <BrainCircuit className="w-12 h-12 text-yellow-400" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                    גלה את <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">הזהות הפוליטית</span> שלך
                </h2>
                
                <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto">
                    הצטרף לאלפי משתמשים בפרוייקט דעת.
                    <br/>
                    אלגוריתם חכם ינתח את עמדותיך ב-40 סוגיות מפתח וימקם אותך במדויק על המפה.
                </p>
                
                <div className="space-y-4 max-w-md mx-auto">
                    <button 
                    onClick={handleStart}
                    className="w-full px-8 py-5 bg-yellow-400 text-slate-950 text-xl font-bold rounded-xl hover:bg-yellow-300 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95 flex items-center justify-center gap-3"
                    >
                    <span>התחל במבחן</span>
                    <Compass className="w-6 h-6" />
                    </button>

                    {hasHistory && (
                    <button 
                        onClick={handleLoadHistory}
                        className="w-full px-8 py-4 bg-slate-800/50 text-slate-300 text-lg font-bold rounded-xl border border-slate-700 hover:bg-slate-800 hover:text-yellow-400 hover:border-yellow-400/30 transition-all flex items-center justify-center gap-2"
                    >
                        <History className="w-5 h-5" />
                        צפה בתוצאה אחרונה
                    </button>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500">
                     <div className="flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-yellow-500" />
                        <span>בחסות <span className="font-bold text-slate-300">פרוייקט דעת</span></span>
                     </div>
                     <span className="hidden md:inline text-slate-700">•</span>
                     <div>
                        פיתוח ועיצוב: <span className="font-bold text-slate-300">חגי הראל</span>
                     </div>
                </div>
                </div>
            </div>
            )}

            {appState === AppState.QUIZ && (
            <Quiz onComplete={calculateResults} />
            )}

            {appState === AppState.RESULTS && (
            <ResultView 
                coordinates={coordinates} 
                onRetake={handleRetake} 
                initialAnalysis={currentAnalysis}
                onAnalysisComplete={handleAnalysisComplete}
            />
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 font-medium mb-2">© {new Date().getFullYear()} המצפן הפוליטי | פרוייקט דעת</p>
          <p className="text-slate-600 text-sm">
            פותח באהבה ע"י <span className="font-bold text-yellow-500">חגי הראל</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;