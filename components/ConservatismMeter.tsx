import React from 'react';
import { Scale } from 'lucide-react';

interface ConservatismMeterProps {
  score: number;
}

const ConservatismMeter: React.FC<ConservatismMeterProps> = ({ score }) => {
  const safeScore = Math.max(-10, Math.min(10, score));
  // Convert -10..10 to 0..100
  // -10 (Progressive) -> 0% (Left)
  // +10 (Conservative) -> 100% (Right)
  const percentage = ((safeScore + 10) / 20) * 100;

  let label = "מאוזן";
  if (safeScore > 2) label = "נוטה לשמרנות";
  if (safeScore > 6) label = "שמרן";
  if (safeScore < -2) label = "נוטה לפרוגרסיביות";
  if (safeScore < -6) label = "פרוגרסיבי";

  return (
    <div className="w-full mt-8 bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            מדד שמרנות-פרוגרסיביות
        </h3>
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            {label}
        </span>
      </div>

      <div className="relative h-14 mb-2">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
             {/* Gradient: Left (Cyan/Prog) to Right (Purple/Cons) */}
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-slate-300 dark:via-slate-600 to-purple-500 opacity-80"></div>
        </div>

        {/* Center Tick */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-0.5 h-5 bg-slate-400 dark:bg-slate-500 -translate-x-1/2 z-0"></div>

        {/* Marker */}
        <div 
            className="absolute top-0 bottom-0 w-1 z-10 transition-all duration-1000 ease-out flex flex-col items-center justify-center"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
            <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] border-2 border-white dark:border-slate-800"></div>
            <div className="absolute -top-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-100 whitespace-nowrap">
                {safeScore.toFixed(1)}
            </div>
        </div>
      </div>

      {/* Labels - RTL Flex: First is Right, Second is Left */}
      <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500 px-1">
         {/* Right Side (Positive/Conservative) */}
         <span className="text-purple-600 dark:text-purple-400">שמרן</span>
         {/* Left Side (Negative/Progressive) */}
         <span className="text-cyan-600 dark:text-cyan-400">פרוגרסיבי</span>
      </div>
    </div>
  );
};

export default ConservatismMeter;