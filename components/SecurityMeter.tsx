import React from 'react';
import { Shield } from 'lucide-react';

interface SecurityMeterProps {
  score: number;
  isPrinting?: boolean;
}

const SecurityMeter: React.FC<SecurityMeterProps> = ({ score, isPrinting = false }) => {
  const safeScore = Math.max(-10, Math.min(10, score));
  // Convert -10..10 to 0..100
  // -10 (Dove) -> 0% (Left)
  // +10 (Hawk) -> 100% (Right)
  const percentage = ((safeScore + 10) / 20) * 100;

  let label = "בטחוניסט מתון";
  if (safeScore > 2) label = "ניצי (נץ)";
  if (safeScore > 6) label = "ניצי מאוד";
  if (safeScore < -2) label = "יוני (יונה)";
  if (safeScore < -6) label = "יוני מאוד";

  // Styles based on printing mode (forces light theme look for infographic)
  const containerClass = isPrinting 
    ? "w-[800px] mt-8 bg-white p-8 rounded-[40px] border-4 border-slate-200 shadow-sm mx-auto"
    : "w-full mt-8 bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50";
    
  const titleClass = isPrinting
    ? "font-black text-slate-900 text-3xl flex items-center gap-4"
    : "font-black text-slate-900 dark:text-white text-lg flex items-center gap-2";

  const labelBadgeClass = isPrinting
    ? "text-2xl font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl"
    : "text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md";

  const trackHeight = isPrinting ? "h-6" : "h-3";
  const trackContainerHeight = isPrinting ? "h-24 mb-4" : "h-14 mb-2";
  const tickClass = isPrinting 
    ? "w-1 h-10 bg-slate-400" 
    : "w-0.5 h-5 bg-slate-400 dark:bg-slate-500";
    
  const markerSize = isPrinting ? "w-8 h-8 border-4" : "w-4 h-4 border-2";
  const markerTextClass = isPrinting
    ? "absolute -top-12 bg-slate-900 text-white text-xl font-bold px-3 py-1 rounded-lg shadow-sm"
    : "absolute -top-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm";

  const axisLabelsClass = isPrinting
    ? "flex justify-between text-xl font-bold text-slate-500 px-2 mt-2"
    : "flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500 px-1";

  const iconSize = isPrinting ? "w-10 h-10" : "w-5 h-5";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={titleClass}>
            <Shield className={`${iconSize} text-blue-500`} />
            מדד ניציות-יוניות (ביטחון)
        </h3>
        <span className={labelBadgeClass}>
            {label}
        </span>
      </div>

      <div className={`relative ${trackContainerHeight}`}>
        {/* Track */}
        <div className={`absolute top-1/2 -translate-y-1/2 w-full ${trackHeight} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
             {/* Gradient: Left (Blue/Dove) to Right (Navy/Hawk) */}
             <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-slate-300 dark:via-slate-600 to-indigo-900 opacity-80"></div>
        </div>

        {/* Center Tick */}
        <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 ${tickClass} -translate-x-1/2 z-0`}></div>

        {/* Marker */}
        <div 
            className="absolute top-0 bottom-0 w-1 z-10 transition-all duration-1000 ease-out flex flex-col items-center justify-center"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
            <div className={`${markerSize} bg-slate-900 dark:bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] ${isPrinting ? 'border-white' : 'border-white dark:border-slate-800'}`}></div>
            <div className={`${markerTextClass} opacity-100 whitespace-nowrap`}>
                {safeScore.toFixed(1)}
            </div>
        </div>
      </div>

      {/* Labels - RTL Flex: First is Right, Second is Left */}
      <div className={axisLabelsClass}>
         {/* Right Side (Positive/Hawk) */}
         <span className="text-indigo-900 dark:text-indigo-400">ניצי</span>
         {/* Left Side (Negative/Dove) */}
         <span className="text-sky-600 dark:text-sky-400">יוני</span>
      </div>
    </div>
  );
};

export default SecurityMeter;
