import React, { useState } from 'react';
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

  const currentQuestion = QUESTIONS[currentIndex];

  const handleAnswer = (score: number) => {
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
        onComplete(updatedAnswers);
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection('backward');
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimating(false);
      }, 250);
    }
  };

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end text-sm text-slate-600 mb-3 font-medium">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">התקדמות</span>
            <span className="text-xl font-bold text-indigo-900">שאלה {currentIndex + 1} <span className="text-slate-400 text-base font-normal">/ {QUESTIONS.length}</span></span>
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
             {Math.round(progress)}%
          </div>
        </div>
        <div className="h-4 w-full bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-white/60 min-h-[280px] flex flex-col justify-center items-center text-center relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
           {/* Subtle background decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-tr-full -ml-8 -mb-8 opacity-50 transition-transform group-hover:scale-110"></div>
           
           <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed z-10">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button 
            onClick={() => handleAnswer(2)}
            className="group relative py-4 px-2 rounded-2xl bg-gradient-to-b from-green-600 to-green-700 text-white font-bold hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center gap-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-lg relative z-10">מסכים בהחלט</span>
            <Check className="w-6 h-6 relative z-10" />
          </button>
          
          <button 
            onClick={() => handleAnswer(1)}
            className="py-4 px-2 rounded-2xl bg-white border-2 border-green-500 text-green-600 font-bold hover:bg-green-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95"
          >
            מסכים
          </button>
          
          <button 
            onClick={() => handleAnswer(0)}
            className="py-4 px-2 rounded-2xl bg-white border-2 border-slate-300 text-slate-500 font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95"
          >
            ניטרלי
          </button>
          
          <button 
            onClick={() => handleAnswer(-1)}
            className="py-4 px-2 rounded-2xl bg-white border-2 border-red-400 text-red-500 font-bold hover:bg-red-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95"
          >
            לא מסכים
          </button>
          
          <button 
            onClick={() => handleAnswer(-2)}
            className="group relative py-4 px-2 rounded-2xl bg-gradient-to-b from-red-600 to-red-700 text-white font-bold hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-red-500/30 hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center gap-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-lg relative z-10">מתנגד בהחלט</span>
             <span className="text-2xl leading-none relative z-10">×</span>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-between items-center px-2">
            <button
                onClick={handleBack}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    currentIndex === 0 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                }`}
            >
                <ChevronRight className="w-5 h-5 rotate-180" /> {/* RTL flip icon manually or use rotate because dir=rtl mirrors layout but sometimes icons need check */}
                {/* Actually with dir=rtl, ChevronRight points Left visually which is "Back" in RTL? No, Usually Right arrow is Forward, Left arrow is Back. In RTL, Left is Forward (Next) and Right is Backward (Prev). Let's stick to text for clarity or standard icons. */}
                {/* In RTL: ArrowRight points Left. ArrowLeft points Right. */}
                {/* Let's just use Text + Icon logic. */}
                <span>חזור לשאלה הקודמת</span>
            </button>
            
            <div className="text-xs text-slate-400">
                {/* Optional info */}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Quiz;