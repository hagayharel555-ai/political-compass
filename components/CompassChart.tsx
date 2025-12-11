import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Coordinates } from '../types';

interface CompassChartProps {
  coordinates: Coordinates;
}

const CompassChart: React.FC<CompassChartProps> = ({ coordinates }) => {
  const data = [{ x: coordinates.x, y: coordinates.y }];

  return (
    <div className="w-full h-[400px] relative bg-slate-900 rounded-xl shadow-inner border border-slate-800 p-4">
      {/* Background Colors for Quadrants - Dark Theme */}
      <div className="absolute inset-0 m-4 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20">
        <div className="bg-red-500/30 rounded-tl-lg border-r border-b border-slate-800"></div>   {/* Top Left: Auth Left */}
        <div className="bg-blue-500/30 rounded-tr-lg border-l border-b border-slate-800"></div>  {/* Top Right: Auth Right */}
        <div className="bg-green-500/30 rounded-bl-lg border-r border-t border-slate-800"></div> {/* Bottom Left: Lib Left */}
        <div className="bg-purple-500/30 rounded-br-lg border-l border-t border-slate-800"></div>{/* Bottom Right: Lib Right */}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
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
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />
          <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} />

          {/* Labels */}
          <ReferenceLine y={9} stroke="none" label={{ position: 'insideTop', value: 'סמכותני (Authoritarian)', fill: '#e2e8f0', fontSize: 14, fontWeight: 'bold', dy: -5 }} />
          <ReferenceLine y={-9} stroke="none" label={{ position: 'insideBottom', value: 'ליברלי (Libertarian)', fill: '#e2e8f0', fontSize: 14, fontWeight: 'bold', dy: 5 }} />
          <ReferenceLine x={-9} stroke="none" label={{ position: 'insideLeft', value: 'שמאל (Left)', fill: '#e2e8f0', fontSize: 14, fontWeight: 'bold', angle: -90, dx: -5 }} />
          <ReferenceLine x={9} stroke="none" label={{ position: 'insideRight', value: 'ימין (Right)', fill: '#e2e8f0', fontSize: 14, fontWeight: 'bold', angle: 90, dx: 5 }} />

          <Scatter name="Your Position" data={data}>
             <Cell fill="#facc15" stroke="#000" strokeWidth={2} />
          </Scatter>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Point Annotation */}
      <div className="absolute bottom-2 left-2 text-xs text-slate-500">
        X: {coordinates.x.toFixed(1)}, Y: {coordinates.y.toFixed(1)}
      </div>
    </div>
  );
};

export default CompassChart;