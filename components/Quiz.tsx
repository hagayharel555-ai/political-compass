import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../types';
import { QUESTIONS } from '../constants';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';

interface QuizProps {
  onComplete: (answers: Answer[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Ensure currentIndex is valid
  const currentQuestion = QUESTIONS[currentIndex] || QUESTIONS[0];

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
      if (currentIndex < QUESTIONS.length - 1) {
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
  const progress = Math.min(100, Math.round(((currentIndex + 1) / QUESTIONS.length) * 100));

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">התקדמות</span>
            <span className="text-xl font-bold text-yellow-500 dark:text-yellow-400">שאלה {currentIndex + 1} <span className="text-slate-500 dark:text-slate-600 text-base font-normal">/ {QUESTIONS.length}</span></span>
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
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-slate-200 dark:border-slate-800 min-h-[280px] flex flex-col justify-center items-center text-center relative overflow-hidden group transition-colors duration-300">
           {/* Subtle background decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 dark:bg-yellow-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-200/50 dark:bg-slate-700/10 rounded-tr-full -ml-8 -mb-8 transition-transform group-hover:scale-110"></div>
           
           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed z-10 transition-colors">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button 
            onClick={() => handleAnswer(2)}
            disabled={animating}
            className="group relative py-4 px-2 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all shadow-lg shadow-black/5 hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center gap-1 overflow-hidden border border-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="text-lg relative z-10">מסכים בהחלט</span>
            <Check className="w-6 h-6 relative z-10" />
          </button>
          
          <button 
            onClick={() => handleAnswer(1)}
            disabled={animating}
            className="py-4 px-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-green-600 text-green-600 dark:text-green-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            מסכים
          </button>
          
          <button 
            onClick={() => handleAnswer(0)}
            disabled={animating}
            className="py-4 px-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ניטרלי
          </button>
          
          <button 
            onClick={() => handleAnswer(-1)}
            disabled={animating}
            className="py-4 px-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-red-600 text-red-600 dark:text-red-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            לא מסכים
          </button>
          
          <button 
            onClick={() => handleAnswer(-2)}
            disabled={animating}
            className="group relative py-4 px-2 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-lg shadow-black/5 hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center gap-1 overflow-hidden border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="text-lg relative z-10">מתנגד בהחלט</span>
             <span className="text-2xl leading-none relative z-10">×</span>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-between items-center px-2">
            <button
                onClick={handleBack}
                disabled={currentIndex === 0 || animating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    currentIndex === 0 || animating
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                    : 'text-slate-500 hover:text-yellow-500 dark:text-slate-400 dark:hover:text-yellow-400 hover:bg-white dark:hover:bg-slate-800'
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