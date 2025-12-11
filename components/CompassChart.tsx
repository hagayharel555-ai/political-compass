import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Coordinates } from '../types';

interface CompassChartProps {
  coordinates: Coordinates;
  isDarkMode?: boolean;
}

const CompassChart: React.FC<CompassChartProps> = ({ coordinates, isDarkMode = false }) => {
  const data = [{ x: coordinates.x, y: coordinates.y }];

  // Theme colors
  const gridColor = isDarkMode ? "#334155" : "#cbd5e1"; // Slate 700 vs Slate 300
  const axisColor = isDarkMode ? "#94a3b8" : "#64748b"; // Slate 400 vs Slate 500
  const textColor = isDarkMode ? "#e2e8f0" : "#334155"; // Slate 200 vs Slate 700

  return (
    <div className="w-full h-[400px] relative bg-slate-100 dark:bg-slate-900 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300">
      {/* Background Colors for Quadrants */}
      <div className="absolute inset-0 m-4 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20">
        <div className="bg-red-500/30 rounded-tl-lg border-r border-b border-slate-300 dark:border-slate-800"></div>   {/* Top Left: Auth Left */}
        <div className="bg-blue-500/30 rounded-tr-lg border-l border-b border-slate-300 dark:border-slate-800"></div>  {/* Top Right: Auth Right */}
        <div className="bg-green-500/30 rounded-bl-lg border-r border-t border-slate-300 dark:border-slate-800"></div> {/* Bottom Left: Lib Left */}
        <div className="bg-purple-500/30 rounded-br-lg border-l border-t border-slate-300 dark:border-slate-800"></div>{/* Bottom Right: Lib Right */}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
          <ReferenceLine y={9} stroke="none" label={{ position: 'insideTop', value: 'סמכותני (Authoritarian)', fill: textColor, fontSize: 14, fontWeight: 'bold', dy: -5 }} />
          <ReferenceLine y={-9} stroke="none" label={{ position: 'insideBottom', value: 'ליברלי (Libertarian)', fill: textColor, fontSize: 14, fontWeight: 'bold', dy: 5 }} />
          <ReferenceLine x={-9} stroke="none" label={{ position: 'insideLeft', value: 'שמאל (Left)', fill: textColor, fontSize: 14, fontWeight: 'bold', angle: -90, dx: -5 }} />
          <ReferenceLine x={9} stroke="none" label={{ position: 'insideRight', value: 'ימין (Right)', fill: textColor, fontSize: 14, fontWeight: 'bold', angle: 90, dx: 5 }} />

          <Scatter name="Your Position" data={data}>
             <Cell fill="#facc15" stroke="#000" strokeWidth={2} />
          </Scatter>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Point Annotation */}
      <div className="absolute bottom-2 left-2 text-xs text-slate-400 dark:text-slate-500">
        X: {coordinates.x.toFixed(1)}, Y: {coordinates.y.toFixed(1)}
      </div>
    </div>
  );
};

export default CompassChart;