import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import ResultView from './components/ResultView';
import ChannelPopup from './components/ChannelPopup';
import AccessibilityMenu from './components/AccessibilityMenu';
import { Answer, Coordinates, AnalysisResult, Axis } from './types';
import { QUESTIONS } from './constants';
import { Compass, History, BrainCircuit, HeartHandshake, Moon, Sun, User, Mail, ArrowLeft, Accessibility, Users } from 'lucide-react';
import { getSavedResult, saveResult, hasSavedResult, getSavedUserDetails } from './utils/storage';

enum AppState {
  WELCOME,
  REGISTRATION,
  QUIZ,
  RESULTS
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0, z: 0 });
  const [friendCoordinates, setFriendCoordinates] = useState<Coordinates | null>(null);
  const [friendName, setFriendName] = useState<string>("");

  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAccessible, setIsAccessible] = useState(false);
  const [showChannelPopup, setShowChannelPopup] = useState(false);

  // User Data State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [validationError, setValidationError] = useState(false);

  // Analytics State
  const [startTime, setStartTime] = useState<number>(0);
  const [quizDuration, setQuizDuration] = useState<number>(0);
  const [lastAnswers, setLastAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    setHasHistory(hasSavedResult());
    
    const savedUser = getSavedUserDetails();
    if (savedUser) {
        setUserName(savedUser.name);
        setUserEmail(savedUser.email);
    }

    const params = new URLSearchParams(window.location.search);
    const xParam = params.get('x');
    const yParam = params.get('y');
    const zParam = params.get('z');

    if (xParam && yParam) {
      const x = parseFloat(xParam);
      const y = parseFloat(yParam);
      const z = zParam ? parseFloat(zParam) : 0;

      if (!isNaN(x) && !isNaN(y)) {
        const coords = { x, y, z };
        setFriendCoordinates(coords);
        setCoordinates(coords);
        
        const titleParam = params.get('title');
        const descParam = params.get('desc');
        const nameParam = params.get('name');

        if (nameParam) {
            setFriendName(decodeURIComponent(nameParam));
        }
        
        if (titleParam && descParam) {
          setCurrentAnalysis({
            title: decodeURIComponent(titleParam),
            description: decodeURIComponent(descParam),
            ideology: '',
            economicAnalysis: '',
            nationalAnalysis: '',
            religiousAnalysis: ''
          });
        }
        
        setAppState(AppState.RESULTS);
      }
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleAccessibility = () => setIsAccessible(!isAccessible);

  const calculateResults = (answers: Answer[]) => {
    try {
      const durationSec = (Date.now() - startTime) / 1000;
      setQuizDuration(durationSec);
      setLastAnswers(answers);

      let econScore = 0;
      let nationalScore = 0;
      let socialScore = 0;
      
      const econQuestionsCount = QUESTIONS.filter(q => q.axis === Axis.ECONOMIC).length || 1;
      const nationalQuestionsCount = QUESTIONS.filter(q => q.axis === Axis.NATIONAL_SECURITY).length || 1;
      // Z-axis aggregates both Social/Cultural and Conservatism questions
      const socialQuestionsCount = QUESTIONS.filter(q => q.axis === Axis.SOCIAL_CULTURAL || q.axis === Axis.CONSERVATISM).length || 1;

      answers.forEach(ans => {
        const question = QUESTIONS.find(q => q.id === ans.questionId);
        if (!question) return;

        const score = Number(ans.score);
        const direction = Number(question.direction);
        
        if (isNaN(score) || isNaN(direction)) return;

        const impact = score * direction;

        if (question.axis === Axis.ECONOMIC) {
          econScore += impact;
        } else if (question.axis === Axis.NATIONAL_SECURITY) {
          nationalScore += impact;
        } else if (question.axis === Axis.SOCIAL_CULTURAL || question.axis === Axis.CONSERVATISM) {
          socialScore += impact;
        }
      });

      const normalizedX = (econScore / (2 * econQuestionsCount)) * 10;
      const normalizedY = (nationalScore / (2 * nationalQuestionsCount)) * 10;
      const normalizedZ = (socialScore / (2 * socialQuestionsCount)) * 10;

      const safeX = Math.max(-10, Math.min(10, normalizedX || 0));
      const safeY = Math.max(-10, Math.min(10, normalizedY || 0));
      const safeZ = Math.max(-10, Math.min(10, normalizedZ || 0));

      setCoordinates({ x: safeX, y: safeY, z: safeZ });
      setCurrentAnalysis(null);
      setAppState(AppState.RESULTS);
      
      // Trigger Channel Popup after results are calculated
      setTimeout(() => setShowChannelPopup(true), 2500);

      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (historyError) {
        console.warn("Could not update history state:", historyError);
      }
    } catch (error) {
      console.error("Error calculating results:", error);
      setAppState(AppState.WELCOME);
    }
  };

  const handleAnalysisComplete = (analysis: AnalysisResult) => {
    saveResult({
      coordinates,
      analysis,
      timestamp: Date.now(),
      userName: userName,
      userEmail: userEmail
    });
    setHasHistory(true);
  };

  const handleLoadHistory = () => {
    const saved = getSavedResult();
    if (saved) {
      setCoordinates(saved.coordinates);
      setCurrentAnalysis(saved.analysis);
      setFriendCoordinates(null);
      setFriendName("");
      
      if (saved.userName) setUserName(saved.userName);
      if (saved.userEmail) setUserEmail(saved.userEmail || "");
      
      setAppState(AppState.RESULTS);
    }
  };

  const handleGoToRegistration = () => {
    setAppState(AppState.REGISTRATION);
  };

  const handleStartQuiz = () => {
    if (!userName.trim()) {
      setValidationError(true);
      return;
    }
    setStartTime(Date.now());
    setAppState(AppState.QUIZ);
  };

  const handleRetake = () => {
    try {
      window.history.pushState({}, document.title, window.location.pathname);
    } catch (historyError) {
      console.warn("Could not push history state:", historyError);
    }
    
    setAppState(AppState.WELCOME);
    setCoordinates({ x: 0, y: 0, z: 0 });
    setFriendCoordinates(null);
    setFriendName("");
    setCurrentAnalysis(null);
    setQuizDuration(0);
    setLastAnswers([]);
    setValidationError(false);
  };

  const isViewingFriendResult = appState === AppState.RESULTS && 
                                friendCoordinates !== null && 
                                coordinates.x === friendCoordinates.x && 
                                coordinates.y === friendCoordinates.y;

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isAccessible ? 'accessible-mode' : ''}`} 
      dir="rtl"
    >
      {showChannelPopup && <ChannelPopup onClose={() => setShowChannelPopup(false)} />}
      
      {/* Floating Accessibility Widget */}
      <AccessibilityMenu 
        isHighContrast={isAccessible} 
        toggleHighContrast={toggleAccessibility}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 glass transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleRetake}
            tabIndex={0}
          >
            <div className="bg-yellow-400 text-slate-950 p-1.5 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.3)] group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-slate-900 dark:text-slate-100 text-right">המצפן הפוליטי</h1>
                <span className="text-xs text-yellow-500 dark:text-yellow-400 font-bold tracking-wider block text-right">פרוייקט דעת</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              aria-label={isDarkMode ? "החלף למצב יום" : "החלף למצב לילה"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                <span>פותח ע"י חגי</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 relative overflow-hidden">
        {!isAccessible && (
          <>
            <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 dark:bg-slate-700/20 rounded-full filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
          </>
        )}

        <div className="z-10 w-full">
            {appState === AppState.WELCOME && (
            <div className="max-w-2xl mx-auto px-4 text-center animate-fadeIn">
                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
                
                <div className="mb-6 inline-flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-700">
                    <BrainCircuit className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
                </div>

                <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-black rounded-full border border-yellow-200 dark:border-yellow-700 shadow-sm">
                        🇮🇱 המצפן הפוליטי היחיד בישראל
                    </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    גלה את <span className={isAccessible ? "text-yellow-700 dark:text-yellow-300 underline" : "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-200 dark:to-yellow-500"}>הזהות הפוליטית</span> שלך
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto font-medium">
                    הצטרף לאלפי ישראלים המשתתפים במחקר של פרוייקט דעת.
                    <br/>
                    האלגוריתם ינתח את עמדותיך ב-49 סוגיות ליבה וימקם אותך במדויק על המפה הפוליטית.
                </p>
                
                <div className="space-y-4 max-w-md mx-auto">
                    <button 
                    onClick={handleGoToRegistration}
                    className="w-full px-8 py-5 bg-yellow-400 text-slate-950 text-xl font-black rounded-2xl hover:bg-yellow-300 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95 flex items-center justify-center gap-3 shadow-lg"
                    >
                    <span>התחל במבחן</span>
                    <Compass className="w-6 h-6" />
                    </button>

                    {hasHistory && (
                    <button 
                        onClick={handleLoadHistory}
                        className="w-full px-8 py-4 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-lg font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <History className="w-5 h-5" />
                        צפה בתוצאה אחרונה
                    </button>
                    )}
                </div>
                </div>
            </div>
            )}

            {appState === AppState.REGISTRATION && (
            <div className="max-w-md mx-auto px-4 animate-fadeIn">
                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">קצת פרטים ומתחילים</h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 mr-1">שם (חובה)</label>
                            <div className="relative">
                                <User className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    id="userName"
                                    type="text"
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value);
                                        if(e.target.value) setValidationError(false);
                                    }}
                                    className={`w-full pr-10 pl-4 py-3 rounded-xl border ${validationError ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700 focus:ring-yellow-400/50'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 transition-all font-medium`}
                                    placeholder="ישראל ישראלי"
                                />
                            </div>
                            {validationError && <p className="text-red-500 text-xs mt-1 mr-1">אנא מלא את השם כדי להמשיך</p>}
                        </div>

                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 mr-1">דואר אלקטרוני (רשות)</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    id="userEmail"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all font-medium"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleStartQuiz}
                            className="w-full mt-4 px-8 py-4 bg-yellow-400 text-slate-950 text-lg font-black rounded-xl hover:bg-yellow-300 transition-all hover:-translate-y-1 shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>התחל מבחן</span>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            )}

            {appState === AppState.QUIZ && (
            <div className="animate-fadeIn">
                <Quiz onComplete={calculateResults} isAccessible={isAccessible} />
            </div>
            )}

            {appState === AppState.RESULTS && (
            <ResultView 
                coordinates={coordinates} 
                compareCoordinates={friendCoordinates}
                onRetake={handleRetake} 
                initialAnalysis={currentAnalysis}
                onAnalysisComplete={handleAnalysisComplete}
                isDarkMode={isDarkMode}
                isAccessible={isAccessible}
                quizDuration={quizDuration}
                answers={lastAnswers}
                userName={userName}
                userEmail={userEmail}
                friendName={friendName}
            />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;