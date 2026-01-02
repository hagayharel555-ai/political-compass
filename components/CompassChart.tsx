import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from 'recharts';
import { Coordinates } from '../types';

interface CompassChartProps {
  coordinates: Coordinates;
  compareCoordinates?: Coordinates | null;
  userName?: string;
  friendName?: string;
  isDarkMode?: boolean;
  isAccessible?: boolean;
  hideControls?: boolean;
}

const CompassChart: React.FC<CompassChartProps> = ({ 
  coordinates, 
  compareCoordinates, 
  userName = "אני",
  friendName = "חבר",
  isDarkMode = false, 
  isAccessible = false, 
  hideControls = false 
}) => {
  const userData = [{ x: coordinates.x, y: coordinates.y, name: userName || "אני" }];
  const compareData = compareCoordinates ? [{ x: compareCoordinates.x, y: compareCoordinates.y, name: friendName || "חבר" }] : [];

  // Classic Political Compass Colors
  const bgColors = isAccessible ? {
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
  const userDotStroke = "#ffffff";
  const compareDotFill = "#64748b"; // Slate-500 for friend
  
  return (
    <div className="w-full flex flex-col gap-6 items-center">
      
      {/* Controls Header */}
      {!hideControls && (
        <div className="w-full flex justify-between items-center px-2">
          {compareCoordinates ? (
             <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span className="text-slate-600 dark:text-slate-400 max-w-[80px] truncate">{friendName}</span>
                <span className="w-2 h-2 rounded-full bg-red-500 ml-2"></span>
                <span className="text-slate-600 dark:text-slate-400 max-w-[80px] truncate">{userName}</span>
             </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-slate-600 dark:text-slate-400">המיקום שלך</span>
            </div>
          )}
          <div /> {/* Spacer */}
        </div>
      )}

      {/* Chart Wrapper */}
      <div className="relative w-full max-w-[450px] mx-auto pt-6 pb-6 px-8">
        
        {/* Labels */}
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
            
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-90" dir="ltr">
                <div style={{ backgroundColor: bgColors.tl }}></div>
                <div style={{ backgroundColor: bgColors.tr }}></div>
                <div style={{ backgroundColor: bgColors.bl }}></div>
                <div style={{ backgroundColor: bgColors.br }}></div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={gridColor} strokeWidth={1} />
                <XAxis type="number" dataKey="x" domain={[-10, 10]} tickCount={21} hide />
                <YAxis type="number" dataKey="y" domain={[-10, 10]} tickCount={21} hide />
                <ReferenceLine y={0} stroke={axisColor} strokeWidth={isAccessible ? 3 : 2} />
                <ReferenceLine x={0} stroke={axisColor} strokeWidth={isAccessible ? 3 : 2} />

                {/* Friend Position */}
                {compareData.length > 0 && (
                     <Scatter name={friendName} data={compareData} zIndex={15}>
                        <Cell fill={compareDotFill} stroke={userDotStroke} strokeWidth={2} r={isAccessible ? 8 : 6} />
                        <LabelList dataKey="name" position="top" offset={5} style={{ fill: compareDotFill, fontSize: '12px', fontWeight: 'bold' }} />
                     </Scatter>
                )}

                {/* User Position */}
                <Scatter name={userName} data={userData} zIndex={20}>
                  <Cell fill={userDotFill} stroke={userDotStroke} strokeWidth={2} r={isAccessible ? 9 : 7} />
                  {compareData.length > 0 && <LabelList dataKey="name" position="top" offset={5} style={{ fill: userDotFill, fontSize: '12px', fontWeight: 'bold' }} />}
                </Scatter>
                
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