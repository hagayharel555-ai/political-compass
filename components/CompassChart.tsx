import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, Cell } from 'recharts';
import { Coordinates } from '../types';

interface CompassChartProps {
  coordinates: Coordinates;
}

const CompassChart: React.FC<CompassChartProps> = ({ coordinates }) => {
  const data = [{ x: coordinates.x, y: coordinates.y }];

  // Custom Tick for Quadrant Labels
  const CustomLabel = (props: any) => {
    const { x, y, value, viewBox } = props;
    return (
      <text x={x} y={y} dy={-10} dx={10} fill="#666" fontSize={12} textAnchor="middle">
        {value}
      </text>
    );
  };

  return (
    <div className="w-full h-[400px] relative bg-white rounded-xl shadow-inner border border-slate-200 p-4">
      {/* Background Colors for Quadrants */}
      <div className="absolute inset-0 m-4 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20">
        <div className="bg-red-200 rounded-tl-lg"></div>   {/* Top Left: Auth Left */}
        <div className="bg-blue-200 rounded-tr-lg"></div>  {/* Top Right: Auth Right */}
        <div className="bg-green-200 rounded-bl-lg"></div> {/* Bottom Left: Lib Left */}
        <div className="bg-purple-200 rounded-br-lg"></div>{/* Bottom Right: Lib Right */}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
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
          <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
          <ReferenceLine x={0} stroke="#000" strokeWidth={2} />

          {/* Labels */}
          <ReferenceLine y={9} stroke="none" label={{ position: 'insideTop', value: 'סמכותני (Authoritarian)', fill: '#333', fontSize: 14, fontWeight: 'bold' }} />
          <ReferenceLine y={-9} stroke="none" label={{ position: 'insideBottom', value: 'ליברלי (Libertarian)', fill: '#333', fontSize: 14, fontWeight: 'bold' }} />
          <ReferenceLine x={-9} stroke="none" label={{ position: 'insideLeft', value: 'שמאל (Left)', fill: '#333', fontSize: 14, fontWeight: 'bold', angle: -90 }} />
          <ReferenceLine x={9} stroke="none" label={{ position: 'insideRight', value: 'ימין (Right)', fill: '#333', fontSize: 14, fontWeight: 'bold', angle: 90 }} />

          <Scatter name="Your Position" data={data} fill="#ef4444">
             <Cell fill="#ef4444" />
          </Scatter>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Point Annotation */}
      <div className="absolute bottom-2 left-2 text-xs text-slate-400">
        X: {coordinates.x.toFixed(1)}, Y: {coordinates.y.toFixed(1)}
      </div>
    </div>
  );
};

export default CompassChart;
