import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from 'recharts';
import { Coordinates } from '../types';
import { Eye, EyeOff } from 'lucide-react';

interface CompassChartProps {
  coordinates: Coordinates;
  isDarkMode?: boolean;
}

// Estimated coordinates for major Israeli parties
// X: Economic (-10 Left to +10 Right)
// Y: Social/Security (-10 Lib/Left to +10 Auth/Right)
const PARTIES = [
  { name: 'הליכוד', x: 5, y: 5, color: '#1f5aa5' }, // Right Econ, Right Security
  { name: 'יש עתיד', x: 2, y: -3, color: '#003399' }, // Center-Right Econ, Center-Left Social
  { name: 'הדמוקרטים', x: -5, y: -6, color: '#dc2626' }, // Left Econ, Left Social (Labor+Meretz)
  { name: 'הציונות הדתית', x: 6, y: 8, color: '#b45309' }, // Right Econ, Far Right Social
  { name: 'המחנה הממלכתי', x: 1, y: 2, color: '#2563eb' }, // Center Econ, Center-Right Security
  { name: 'ש״ס', x: -3, y: 6, color: '#000000' }, // Left/Welfare Econ, Conservative Social
  { name: 'ישראל ביתנו', x: 7, y: 3, color: '#0c4a6e' }, // Far Right Econ, Hawk Security (Secular)
  { name: 'רע״מ', x: -4, y: -2, color: '#166534' }, // Left Econ, Conservative internal but allied Left politically
  { name: 'זהות', x: 9, y: 1.5, color: '#14b8a6' }, // Far Right Econ, Mixed Social (Libertarian/Nationalist)
];

const CompassChart: React.FC<CompassChartProps> = ({ coordinates, isDarkMode = false }) => {
  const [showParties, setShowParties] = useState(false);

  const data = [{ x: coordinates.x, y: coordinates.y, name: 'אני' }];

  // Calculate closest party
  const closestParty = useMemo(() => {
    if (!coordinates) return null;
    let minDistance = Infinity;
    let closest = null;

    PARTIES.forEach(party => {
      // Euclidean distance
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
  const bgColors = {
    tl: "#fca5a5", // Red-300 (Auth Left)
    tr: "#93c5fd", // Blue-300 (Auth Right)
    bl: "#86efac", // Green-300 (Lib Left)
    br: "#fde047", // Yellow-300 (Lib Right)
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      
      {/* Controls Header */}
      <div className="w-full flex justify-between items-center px-2">
        <button 
          onClick={() => setShowParties(!showParties)}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
            showParties 
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-transparent' 
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          {showParties ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showParties ? 'הסתר מפלגות' : 'השווה למפלגות'}
        </button>

        {showParties && closestParty && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="text-xs text-slate-500 dark:text-slate-400">הכי קרוב אליך:</span>
            <span 
              className="text-xs font-black px-2 py-1 rounded-md text-white shadow-sm"
              style={{ backgroundColor: closestParty.color }}
            >
              {closestParty.name}
            </span>
          </div>
        )}
      </div>

      {/* Chart Wrapper with External Labels */}
      <div className="relative w-full max-w-[450px] mx-auto pt-6 pb-6 px-8">
        
        {/* External Labels */}
        <div className="absolute top-0 left-0 right-0 text-center font-black text-slate-700 dark:text-slate-300 text-sm md:text-base tracking-wide">
          סמכותני (Authoritarian)
        </div>
        <div className="absolute bottom-0 left-0 right-0 text-center font-black text-slate-700 dark:text-slate-300 text-sm md:text-base tracking-wide">
          ליברלי (Libertarian)
        </div>
        <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center w-8">
             <span className="-rotate-90 text-center font-black text-slate-700 dark:text-slate-300 text-sm md:text-base whitespace-nowrap tracking-wide">שמאל (Left)</span>
        </div>
        <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center w-8">
             <span className="rotate-90 text-center font-black text-slate-700 dark:text-slate-300 text-sm md:text-base whitespace-nowrap tracking-wide">ימין (Right)</span>
        </div>

        {/* The Chart Box */}
        <div className="aspect-square relative border-[3px] border-slate-800 dark:border-slate-400 shadow-2xl overflow-hidden bg-white">
            
            {/* Colored Backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-90">
                <div style={{ backgroundColor: bgColors.tl }}></div>
                <div style={{ backgroundColor: bgColors.tr }}></div>
                <div style={{ backgroundColor: bgColors.bl }}></div>
                <div style={{ backgroundColor: bgColors.br }}></div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                {/* Grid Lines - Semi-transparent white to create the "cells" look */}
                <CartesianGrid 
                    stroke="rgba(255,255,255,0.4)" 
                    strokeWidth={1} 
                />
                
                {/* Axes setup with ticks to create the grid cells properly */}
                <XAxis type="number" dataKey="x" domain={[-10, 10]} tickCount={21} hide />
                <YAxis type="number" dataKey="y" domain={[-10, 10]} tickCount={21} hide />
                
                {/* Central Axes - Black and Thick */}
                <ReferenceLine y={0} stroke="#111827" strokeWidth={2} />
                <ReferenceLine x={0} stroke="#111827" strokeWidth={2} />

                {/* User Position - Bold Red Dot */}
                <Scatter name="Your Position" data={data} zIndex={20}>
                  <Cell fill="#ef4444" stroke="#ffffff" strokeWidth={2} r={7} />
                </Scatter>

                {/* Parties */}
                {showParties && (
                  <Scatter name="Parties" data={PARTIES} zIndex={10}>
                    {PARTIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={1} r={4} />
                    ))}
                    <LabelList 
                        dataKey="name" 
                        position="top" 
                        offset={5}
                        style={{ 
                            fill: '#000000', 
                            fontSize: '10px', 
                            fontWeight: '800',
                            textShadow: '0px 0px 4px rgba(255,255,255,0.8)',
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
        <div className="absolute bottom-1 right-2 text-[9px] text-slate-400 dark:text-slate-500 font-mono">
           ({coordinates.x.toFixed(1)}, {coordinates.y.toFixed(1)})
        </div>
      </div>
    </div>
  );
};

export default CompassChart;