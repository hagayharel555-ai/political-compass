import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Cell, LabelList, ReferenceArea } from 'recharts';
import { Coordinates } from '../types';

interface CompassChartProps {
  coordinates: Coordinates;
  compareCoordinates?: Coordinates | null;
  userName?: string;
  friendName?: string;
  isDarkMode?: boolean;
  isAccessible?: boolean;
  hideControls?: boolean;
  isPrinting?: boolean; 
}

const CompassChart: React.FC<CompassChartProps> = ({ 
  coordinates, 
  compareCoordinates, 
  userName = "אני",
  friendName = "חבר",
  isDarkMode = false, 
  isAccessible = false, 
  hideControls = false,
  isPrinting = false
}) => {
  const safeCoords = {
    x: Number.isNaN(Number(coordinates.x)) ? 0 : Number(coordinates.x),
    y: Number.isNaN(Number(coordinates.y)) ? 0 : Number(coordinates.y),
    z: Number.isNaN(Number(coordinates.z)) ? 0 : Number(coordinates.z)
  };

  const userData = [{ x: safeCoords.x, y: safeCoords.y, name: userName || "אני" }];
  
  const compareData = compareCoordinates ? [{ 
    x: Number.isNaN(Number(compareCoordinates.x)) ? 0 : Number(compareCoordinates.x), 
    y: Number.isNaN(Number(compareCoordinates.y)) ? 0 : Number(compareCoordinates.y), 
    name: friendName || "חבר" 
  }] : [];

  // Colors matched to the user's mockup image
  const colors = isPrinting ? {
    authLeft: "#ffbaba", // Pink
    authRight: "#badaff", // Blue
    libLeft: "#baffba", // Green
    libRight: "#fff2ba", // Yellow
    grid: "#e2e8f0",
    axis: "#475569"
  } : isAccessible ? {
    authLeft: "#e0e0e0", authRight: "#f0f0f0", libLeft: "#d0d0d0", libRight: "#e0e0e0", grid: "#000000", axis: "#000000"
  } : {
    authLeft: "#ff4d4d", authRight: "#4d94ff", libLeft: "#44cc44", libRight: "#ffcc00",
    grid: (isDarkMode && !isPrinting) ? "#334155" : "#cbd5e1",
    axis: (isDarkMode && !isPrinting) ? "#f8fafc" : "#0f172a"
  };

  const opacity = (isAccessible || isPrinting) ? 1 : 0.7;
  const ticks = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];

  const ChartContent = (
    <ScatterChart 
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      width={isPrinting ? 500 : undefined}
      height={isPrinting ? 500 : undefined}
    >
      <XAxis type="number" dataKey="x" domain={[-10, 10]} ticks={ticks} hide />
      <YAxis type="number" dataKey="y" domain={[-10, 10]} ticks={ticks} hide />
      
      <ReferenceArea x1={-10} x2={0} y1={0} y2={10} fill={colors.authLeft} fillOpacity={opacity} />
      <ReferenceArea x1={0} x2={10} y1={0} y2={10} fill={colors.authRight} fillOpacity={opacity} />
      <ReferenceArea x1={-10} x2={0} y1={-10} y2={0} fill={colors.libLeft} fillOpacity={opacity} />
      <ReferenceArea x1={0} x2={10} y1={-10} y2={0} fill={colors.libRight} fillOpacity={opacity} />

      <CartesianGrid stroke={colors.grid} strokeDasharray="0" strokeOpacity={isPrinting ? 1 : 0.3} />
      <ReferenceLine x={0} stroke={colors.axis} strokeWidth={2} />
      <ReferenceLine y={0} stroke={colors.axis} strokeWidth={2} />

      {compareData.length > 0 && (
        <Scatter name={friendName} data={compareData} isAnimationActive={false}>
          <Cell fill="#475569" stroke="white" strokeWidth={2} r={isPrinting ? 8 : 8} />
          <LabelList dataKey="name" position="top" offset={10} style={{ fill: '#0f172a', fontWeight: '800', fontSize: isPrinting ? '12px' : '11px', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px' }} />
        </Scatter>
      )}

      <Scatter name={userName} data={userData} isAnimationActive={false}>
        <Cell fill="#dc2626" stroke="#ffffff" strokeWidth={isPrinting ? 2 : 3} r={isPrinting ? 6 : 12} />
        {!isPrinting && <LabelList dataKey="name" position="top" offset={12} style={{ fill: '#0f172a', fontWeight: '900', fontSize: '13px', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '4px' }} />}
      </Scatter>
    </ScatterChart>
  );

  // If printing, we use a dedicated grid layout to ensure labels are captured by html2canvas
  if (isPrinting) {
      return (
          <div className="flex flex-col items-center justify-center p-4 bg-transparent w-[700px]">
              {/* Top Label */}
              <div className="mb-2 text-center">
                  <span className="text-2xl font-black text-slate-500 uppercase tracking-tight block">
                    סמכותני (Authoritarian)
                  </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                  {/* Left Label (Rotated) */}
                  <div className="h-[500px] w-12 flex items-center justify-center">
                      <span 
                        className="text-2xl font-black text-slate-500 uppercase tracking-tight whitespace-nowrap transform -rotate-90"
                      >
                         שמאל כלכלי (Economic Left)
                      </span>
                  </div>

                  {/* Chart */}
                  <div className="w-[500px] h-[500px] border-[2px] border-[#475569] bg-white overflow-hidden relative">
                      {ChartContent}
                      <div className="absolute -bottom-6 -right-2 text-[12px] font-bold text-slate-600">
                        ({safeCoords.x.toFixed(1)} , {safeCoords.y.toFixed(1)})
                      </div>
                  </div>

                  {/* Right Label (Rotated) */}
                  <div className="h-[500px] w-12 flex items-center justify-center">
                      <span 
                        className="text-2xl font-black text-slate-500 uppercase tracking-tight whitespace-nowrap transform rotate-90"
                      >
                         ימין כלכלי (Economic Right)
                      </span>
                  </div>
              </div>

               {/* Bottom Label */}
               <div className="mt-2 text-center">
                  <span className="text-2xl font-black text-slate-500 uppercase tracking-tight block">
                    ליברלי (Libertarian)
                  </span>
              </div>
          </div>
      );
  }

  // Standard Responsive Layout for Web View
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {!hideControls && (
        <div className="w-full flex justify-center">
          <div className="flex items-center gap-3 text-sm font-black bg-white/80 dark:bg-slate-800/80 px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-md">
            <div className="w-4 h-4 rounded-full bg-red-600 ring-2 ring-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <span className="text-slate-900 dark:text-white">המיקום הפוליטי שלך</span>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-[500px] aspect-square mx-auto">
        {/* Top Label */}
        <div className="absolute -top-12 left-0 right-0 text-center flex justify-center items-end">
            <span className="font-black uppercase tracking-tight text-xs md:text-sm text-slate-800 dark:text-slate-100">
                סמכותני
            </span>
        </div>
        
        {/* Bottom Label */}
        <div className="absolute -bottom-12 left-0 right-0 text-center flex justify-center items-start">
            <span className="font-black uppercase tracking-tight text-xs md:text-sm text-slate-800 dark:text-slate-100">
                ליברלי
            </span>
        </div>

        {/* Left Label */}
        <div className="absolute top-0 bottom-0 -left-16 flex items-center justify-center">
             <span 
                className="font-black uppercase tracking-tight whitespace-nowrap text-xs md:text-sm text-slate-800 dark:text-slate-100" 
                style={{ transform: 'rotate(-90deg)' }}
             >
                 שמאל כלכלי
             </span>
        </div>

        {/* Right Label */}
        <div className="absolute top-0 bottom-0 -right-16 flex items-center justify-center">
             <span 
                className="font-black uppercase tracking-tight whitespace-nowrap text-xs md:text-sm text-slate-800 dark:text-slate-100" 
                style={{ transform: 'rotate(90deg)' }}
             >
                 ימין כלכלי
             </span>
        </div>

        <div className="absolute inset-0 border-[2px] border-slate-900 dark:border-slate-400 shadow-2xl bg-white overflow-hidden rounded-sm">
            <ResponsiveContainer width="100%" height="100%">
            {ChartContent}
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompassChart;