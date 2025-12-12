import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from 'recharts';
import { Coordinates } from '../types';
import { Eye, EyeOff } from 'lucide-react';

interface CompassChartProps {
  coordinates: Coordinates;
  isDarkMode?: boolean;
  isAccessible?: boolean;
  hideControls?: boolean;
}

// Estimated coordinates for major Israeli parties
const PARTIES = [
  { name: 'הליכוד', x: 5, y: 5, color: '#1f5aa5' },
  { name: 'יש עתיד', x: 2, y: -3, color: '#003399' },
  { name: 'הדמוקרטים', x: -5, y: -6, color: '#dc2626' },
  { name: 'הציונות הדתית', x: 6, y: 8, color: '#b45309' },
  { name: 'המחנה הממלכתי', x: 1, y: 2, color: '#2563eb' },
  { name: 'ש״ס', x: -3, y: 6, color: '#000000' },
  { name: 'ישראל ביתנו', x: 7, y: 3, color: '#0c4a6e' },
  { name: 'רע״מ', x: -4, y: -2, color: '#166534' },
  { name: 'זהות', x: 9, y: 1.5, color: '#14b8a6' },
];

const CompassChart: React.FC<CompassChartProps> = ({ coordinates, isDarkMode = false, isAccessible = false, hideControls = false }) => {
  const [showParties, setShowParties] = useState(false);

  const data = [{ x: coordinates.x, y: coordinates.y, name: 'אני' }];

  // Calculate closest party
  const closestParty = useMemo(() => {
    if (!coordinates) return null;
    let minDistance = Infinity;
    let closest = null;

    PARTIES.forEach(party => {
      const distance = Math.sqrt(
        Math.pow(party.x - coordinates.x, 2) + 
        Math.pow(party.y - coordinates.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = party;
      }
    });
    return closest;
  }, [coordinates]);

  // Classic Political Compass Colors (Muted/Pastel versions for background)
  const bgColors = isAccessible ? {
    // High Contrast White/Gray Backgrounds or very distinct light colors
    tl: "#ffffff",
    tr: "#f0f0f0", 
    bl: "#e0e0e0", 
    br: "#ffffff", 
  } : {
    tl: "#fca5a5", // Red-300 (Auth Left)
    tr: "#93c5fd", // Blue-300 (Auth Right)
    bl: "#86efac", // Green-300 (Lib Left)
    br: "#fde047", // Yellow-300 (Lib Right)
  };

  const axisColor = isAccessible ? "#000000" : "#111827";
  const gridColor = isAccessible ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)";
  const userDotFill = isAccessible ? "#000000" : "#ef4444";
  const userDotStroke = isAccessible ? "#ffffff" : "#ffffff";
  const userDotRadius = isAccessible ? 9 : 7;
  const strokeWidth = isAccessible ? 3 : 2;

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      
      {/* Controls Header - Hidden in export mode */}
      {!hideControls && (
        <div className="w-full flex justify-between items-center px-2">
          <button 
            onClick={() => setShowParties(!showParties)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
              showParties 
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-transparent' 
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
            aria-pressed={showParties}
            aria-label={showParties ? "הסתר השוואה למפלגות" : "הצג השוואה למפלגות"}
          >
            {showParties ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showParties ? 'הסתר מפלגות' : 'השווה למפלגות'}
          </button>

          {showParties && closestParty && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-xs text-slate-500 dark:text-slate-400">הכי קרוב אליך:</span>
              <span 
                className="text-xs font-black px-2 py-1 rounded-md text-white shadow-sm"
                style={{ backgroundColor: isAccessible ? '#000' : closestParty.color, border: isAccessible ? '1px solid white' : 'none' }}
              >
                {closestParty.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Chart Wrapper with External Labels */}
      <div className="relative w-full max-w-[450px] mx-auto pt-6 pb-6 px-8">
        
        {/* External Labels - Increased size for accessibility */}
        <div className={`absolute top-0 left-0 right-0 text-center font-black ${isAccessible ? 'text-black dark:text-white text-lg' : 'text-slate-700 dark:text-slate-300 text-sm md:text-base'} tracking-wide`}>
          סמכותני (Authoritarian)
        </div>
        <div className={`absolute bottom-0 left-0 right-0 text-center font-black ${isAccessible ? 'text-black dark:text-white text-lg' : 'text-slate-700 dark:text-slate-300 text-sm md:text-base'} tracking-wide`}>
          ליברלי (Libertarian)
        </div>
        <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center w-8">
             <span className={`-rotate-90 text-center font-black ${isAccessible ? 'text-black dark:text-white text-lg' : 'text-slate-700 dark:text-slate-300 text-sm md:text-base'} whitespace-nowrap tracking-wide`}>שמאל (Left)</span>
        </div>
        <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center w-8">
             <span className={`rotate-90 text-center font-black ${isAccessible ? 'text-black dark:text-white text-lg' : 'text-slate-700 dark:text-slate-300 text-sm md:text-base'} whitespace-nowrap tracking-wide`}>ימין (Right)</span>
        </div>

        {/* The Chart Box */}
        <div className={`aspect-square relative border-[3px] shadow-2xl overflow-hidden bg-white ${isAccessible ? 'border-black dark:border-white' : 'border-slate-800 dark:border-slate-400'}`}>
            
            {/* Colored Backgrounds - Forced LTR to fix mirror issue in RTL document */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-90" dir="ltr">
                <div style={{ backgroundColor: bgColors.tl, borderRight: isAccessible ? '1px solid black' : 'none', borderBottom: isAccessible ? '1px solid black' : 'none' }}></div>
                <div style={{ backgroundColor: bgColors.tr, borderLeft: isAccessible ? '1px solid black' : 'none', borderBottom: isAccessible ? '1px solid black' : 'none' }}></div>
                <div style={{ backgroundColor: bgColors.bl, borderRight: isAccessible ? '1px solid black' : 'none', borderTop: isAccessible ? '1px solid black' : 'none' }}></div>
                <div style={{ backgroundColor: bgColors.br, borderLeft: isAccessible ? '1px solid black' : 'none', borderTop: isAccessible ? '1px solid black' : 'none' }}></div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                {/* Grid Lines */}
                <CartesianGrid 
                    stroke={gridColor} 
                    strokeWidth={isAccessible ? 1 : 1} 
                />
                
                <XAxis type="number" dataKey="x" domain={[-10, 10]} tickCount={21} hide />
                <YAxis type="number" dataKey="y" domain={[-10, 10]} tickCount={21} hide />
                
                {/* Central Axes */}
                <ReferenceLine y={0} stroke={axisColor} strokeWidth={strokeWidth} />
                <ReferenceLine x={0} stroke={axisColor} strokeWidth={strokeWidth} />

                {/* User Position */}
                <Scatter name="Your Position" data={data} zIndex={20}>
                  <Cell fill={userDotFill} stroke={userDotStroke} strokeWidth={2} r={userDotRadius} />
                </Scatter>

                {/* Parties */}
                {showParties && (
                  <Scatter name="Parties" data={PARTIES} zIndex={10}>
                    {PARTIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={isAccessible ? (isDarkMode ? '#fff' : '#000') : entry.color} stroke={isAccessible ? (isDarkMode ? '#000' : '#fff') : '#ffffff'} strokeWidth={1} r={isAccessible ? 5 : 4} />
                    ))}
                    <LabelList 
                        dataKey="name" 
                        position="top" 
                        offset={5}
                        style={{ 
                            fill: isAccessible ? (isDarkMode ? '#fff' : '#000') : '#000000', 
                            fontSize: isAccessible ? '12px' : '10px', 
                            fontWeight: '800',
                            textShadow: isAccessible ? 'none' : '0px 0px 4px rgba(255,255,255,0.8)',
                            pointerEvents: 'none'
                        }} 
                    />
                  </Scatter>
                )}
                
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />
              </ScatterChart>
            </ResponsiveContainer>
        </div>
        
        {/* Point Annotation */}
        <div className={`absolute bottom-1 right-2 ${isAccessible ? 'text-xs text-black font-bold' : 'text-[9px] text-slate-400 dark:text-slate-500'} font-mono`}>
           ({coordinates.x.toFixed(1)}, {coordinates.y.toFixed(1)})
        </div>
      </div>
    </div>
  );
};

export default CompassChart;