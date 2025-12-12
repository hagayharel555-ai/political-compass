import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from 'recharts';
import { Coordinates } from '../types';
import { Users, Eye, EyeOff } from 'lucide-react';

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

  // Theme colors
  const gridColor = isDarkMode ? "#334155" : "#cbd5e1"; // Slate 700 vs Slate 300
  const axisColor = isDarkMode ? "#94a3b8" : "#64748b"; // Slate 400 vs Slate 500
  const textColor = isDarkMode ? "#e2e8f0" : "#334155"; // Slate 200 vs Slate 700

  return (
    <div className="w-full relative bg-slate-100 dark:bg-slate-900 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300 flex flex-col gap-4">
      
      {/* Controls Header */}
      <div className="flex justify-between items-center px-2">
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

      {/* Chart Container - Fixed Aspect Ratio for Mobile */}
      <div className="w-full aspect-square relative max-h-[500px] mx-auto">
        {/* Background Colors for Quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20 dark:opacity-15">
          <div className="bg-red-500/30 rounded-tl-lg border-r border-b border-slate-300 dark:border-slate-800"></div>   {/* Top Left: Auth Left */}
          <div className="bg-blue-500/30 rounded-tr-lg border-l border-b border-slate-300 dark:border-slate-800"></div>  {/* Top Right: Auth Right */}
          <div className="bg-green-500/30 rounded-bl-lg border-r border-t border-slate-300 dark:border-slate-800"></div> {/* Bottom Left: Lib Left */}
          <div className="bg-purple-500/30 rounded-br-lg border-l border-t border-slate-300 dark:border-slate-800"></div>{/* Bottom Right: Lib Right */}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Economic" 
              domain={[-10, 10]} 
              tickCount={5}
              hide
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Social" 
              domain={[-10, 10]} 
              tickCount={5}
              hide
            />
            
            {/* Axis Lines */}
            <ReferenceLine y={0} stroke={axisColor} strokeWidth={2} />
            <ReferenceLine x={0} stroke={axisColor} strokeWidth={2} />

            {/* Labels */}
            <ReferenceLine y={10} stroke="none" label={{ position: 'insideTop', value: 'סמכותני', fill: textColor, fontSize: 12, fontWeight: 'bold', dy: -15 }} />
            <ReferenceLine y={-10} stroke="none" label={{ position: 'insideBottom', value: 'ליברלי', fill: textColor, fontSize: 12, fontWeight: 'bold', dy: 15 }} />
            <ReferenceLine x={-10} stroke="none" label={{ position: 'insideLeft', value: 'שמאל', fill: textColor, fontSize: 12, fontWeight: 'bold', angle: -90, dx: -10 }} />
            <ReferenceLine x={10} stroke="none" label={{ position: 'insideRight', value: 'ימין', fill: textColor, fontSize: 12, fontWeight: 'bold', angle: 90, dx: 10 }} />

            {/* User Position */}
            <Scatter name="Your Position" data={data} zIndex={20}>
              <Cell fill="#facc15" stroke="#000" strokeWidth={2} />
            </Scatter>

            {/* Parties Overlay */}
            {showParties && (
              <Scatter name="Parties" data={PARTIES} zIndex={10}>
                {PARTIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} stroke={entry.color} />
                ))}
                <LabelList 
                  dataKey="name" 
                  position="top" 
                  style={{ 
                    fill: isDarkMode ? '#e2e8f0' : '#1e293b', 
                    fontSize: '10px', 
                    fontWeight: 'bold',
                    textShadow: isDarkMode ? '0px 1px 2px black' : '0px 0px 2px white'
                  }} 
                />
              </Scatter>
            )}

            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Point Annotation */}
        <div className="absolute bottom-0 left-0 p-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          X: {coordinates.x.toFixed(1)}, Y: {coordinates.y.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default CompassChart;