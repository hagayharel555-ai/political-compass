import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../types';
import { QUESTIONS } from '../constants';
import { ArrowLeft, ArrowRight, Check, ChevronRight, X, Minus } from 'lucide-react';

interface QuizProps {
  onComplete: (answers: Answer[]) => void;
  // Fix: Add isAccessible optional prop to interface
  isAccessible?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ onComplete, isAccessible = false }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    // Fisher-Yates shuffle algorithm to randomize questions
    const shuffled = [...QUESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled);
  }, []);

  // Wait for shuffle to complete
  if (questions.length === 0) return null;

  // Ensure currentIndex is valid
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (score: number) => {
    if (animating) return; // Prevent double clicks

    const newAnswer: Answer = { questionId: currentQuestion.id, score };
    
    // Create a copy of answers to modify
    const updatedAnswers = [...answers];
    // Update or insert the answer at the current index
    updatedAnswers[currentIndex] = newAnswer;
    
    setAnswers(updatedAnswers);
    setDirection('forward');
    setAnimating(true);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAnimating(false);
      } else {
        // Last question - call onComplete
        try {
          onComplete(updatedAnswers);
        } catch (e) {
          console.error("Error completing quiz:", e);
          setAnimating(false); // Restore UI if error occurs
        }
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentIndex > 0 && !animating) {
      setDirection('backward');
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimating(false);
      }, 250);
    }
  };

  // Safe progress calculation
  const progress = Math.min(100, Math.round(((currentIndex + 1) / questions.length) * 100));

  return (
    <div className="max-w-4xl mx-auto w-full px-4" role="main" aria-label="מבחן המצפן הפוליטי">
      {/* Progress Bar */}
      <div className="mb-8" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="התקדמות במבחן">
        <div className="flex justify-between items-end text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">התקדמות</span>
            <span className="text-xl font-bold text-yellow-500 dark:text-yellow-400">שאלה {currentIndex + 1} <span className="text-slate-500 dark:text-slate-600 text-base font-normal">/ {questions.length}</span></span>
          </div>
          <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
             {progress}%
          </div>
        </div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
          <div 
            className="h-full bg-yellow-400 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className={`transform transition-all duration-300 ease-out ${
          animating 
            ? (direction === 'forward' ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10') 
            : 'opacity-100 translate-x-0'
        }`}>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-slate-200 dark:border-slate-800 min-h-[200px] md:min-h-[240px] flex flex-col justify-center items-center text-center relative overflow-hidden group transition-colors duration-300">
           {/* Subtle background decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 dark:bg-yellow-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-200/50 dark:bg-slate-700/10 rounded-tr-full -ml-8 -mb-8 transition-transform group-hover:scale-110"></div>
           
           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed z-10 transition-colors" role="heading" aria-level={2}>
            {currentQuestion.text}
          </h2>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 w-full" role="group" aria-label="אפשרויות תשובה">
          
          {/* Strongly Agree (+2) */}
          <button 
            onClick={() => handleAnswer(2)}
            disabled={animating}
            aria-label="מסכים בהחלט"
            className="group relative h-20 md:h-40 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-1 active:scale-95 flex md:flex-col items-center justify-between md:justify-center px-6 md:px-2 gap-2 overflow-hidden border border-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-green-400 focus:outline-none"
          >
            <div className="flex md:flex-col items-center gap-2 md:gap-3">
               <Check className="w-6 h-6 md:w-10 md:h-10 stroke-[3]" />
               <span className="text-lg font-bold leading-tight">מסכים<br className="hidden md:block"/> בהחלט</span>
            </div>
          </button>
          
          {/* Agree (+1) */}
          <button 
            onClick={() => handleAnswer(1)}
            disabled={animating}
            aria-label="מסכים"
            className="group h-16 md:h-40 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 border-2 border-green-200 dark:border-green-800 hover:border-green-300 transition-all shadow-sm hover:-translate-y-1 active:scale-95 flex md:flex-col items-center justify-between md:justify-center px-6 md:px-2 gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-green-300 focus:outline-none"
          >
             <div className="flex md:flex-col items-center gap-2">
                <Check className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-bold text-base md:text-lg">מסכים</span>
             </div>
          </button>
          
          {/* Neutral (0) */}
          <button 
            onClick={() => handleAnswer(0)}
            disabled={animating}
            aria-label="ניטרלי"
            className="group h-14 md:h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:-translate-y-1 active:scale-95 flex md:flex-col items-center justify-between md:justify-center px-6 md:px-2 gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-slate-300 focus:outline-none"
          >
             <div className="flex md:flex-col items-center gap-2">
                <Minus className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-medium text-base md:text-lg">ניטרלי</span>
             </div>
          </button>
          
          {/* Disagree (-1) */}
          <button 
            onClick={() => handleAnswer(-1)}
            disabled={animating}
            aria-label="לא מסכים"
            className="group h-16 md:h-40 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 border-2 border-red-200 dark:border-red-800 hover:border-red-300 transition-all shadow-sm hover:-translate-y-1 active:scale-95 flex md:flex-col items-center justify-between md:justify-center px-6 md:px-2 gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-red-300 focus:outline-none"
          >
             <div className="flex md:flex-col items-center gap-2">
                <X className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-bold text-base md:text-lg">לא מסכים</span>
             </div>
          </button>
          
          {/* Strongly Disagree (-2) */}
          <button 
            onClick={() => handleAnswer(-2)}
            disabled={animating}
            aria-label="מתנגד בהחלט"
            className="group relative h-20 md:h-40 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 transition-all shadow-lg hover:shadow-red-500/25 hover:-translate-y-1 active:scale-95 flex md:flex-col items-center justify-between md:justify-center px-6 md:px-2 gap-2 overflow-hidden border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-red-400 focus:outline-none"
          >
             <div className="flex md:flex-col items-center gap-2 md:gap-3">
                <X className="w-6 h-6 md:w-10 md:h-10 stroke-[3]" />
                <span className="text-lg font-bold leading-tight">מתנגד<br className="hidden md:block"/> בהחלט</span>
             </div>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-center md:justify-start px-2">
            <button
                onClick={handleBack}
                disabled={currentIndex === 0 || animating}
                aria-label="חזור לשאלה הקודמת"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-4 focus:ring-slate-400 ${
                    currentIndex === 0 || animating
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50' 
                    : 'text-slate-500 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
                <ChevronRight className="w-5 h-5 rotate-180" /> 
                <span>חזור לשאלה הקודמת</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default Quiz;