import React, { useState } from 'react';
import { DayDuration } from '../types/commute';

interface WeeklyChartCardProps {
  durations: DayDuration[];
  targetMinutes: number;
}

export const WeeklyChartCard: React.FC<WeeklyChartCardProps> = ({
  durations,
  targetMinutes
}) => {
  const [selectedDay, setSelectedDay] = useState<DayDuration | null>(null);

  // SVG height is 64px, targetMinutes guideline mapped
  // 60 minutes = height ~ 55px, baseline 60
  const maxMinutes = 45;
  const chartHeight = 50;

  return (
    <section className="flex flex-col gap-3">
      {/* 2-Card Metrics Mini-Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* CO2 Card */}
        <div className="rounded-2xl bg-surface-container-low p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden group hover:border-secondary/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-on-surface-variant uppercase text-[10px]">CO2 Offset</span>
            <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[16px]">eco</span>
            </div>
          </div>
          <div>
            <span className="font-headline-md text-on-surface font-bold tracking-tight text-[22px]">12.4 kg</span>
            <span className="font-body-sm text-primary block mt-0.5 font-medium">+1.8 kg vs last week</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-secondary/5 blur-xl pointer-events-none" />
        </div>

        {/* Peak Congestion Card */}
        <div className="rounded-2xl bg-surface-container-low p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden group hover:border-tertiary-container/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-on-surface-variant uppercase text-[10px]">Return Peak</span>
            <div className="w-6 h-6 rounded-lg bg-tertiary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary-container text-[16px]">traffic</span>
            </div>
          </div>
          <div>
            <span className="font-headline-md text-on-surface font-bold tracking-tight text-[22px]">5:15 PM</span>
            <span className="font-body-sm text-secondary block mt-0.5 font-medium">Rec: Leave 4:45 PM</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-tertiary-container/5 blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Mini Bar Chart Preview: Weekly Durations */}
      <div className="rounded-2xl bg-surface-container-low p-4 shadow-sm flex flex-col gap-2 border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px]">bar_chart</span>
            <span className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">
              Weekly Commute Durations
            </span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-[10px] bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/30">
            {targetMinutes}m Target
          </span>
        </div>

        {/* Selected Day Toast */}
        {selectedDay && (
          <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-surface-container-high border border-primary/30 animate-fadeIn">
            <span className="text-on-surface font-medium">
              {selectedDay.day}: <strong className="text-primary">{selectedDay.minutes} min</strong> via {selectedDay.mode.toUpperCase()}
            </span>
            <span className={`text-[10px] font-mono font-semibold ${selectedDay.minutes <= targetMinutes ? 'text-primary' : 'text-tertiary-container'}`}>
              {selectedDay.minutes <= targetMinutes ? `-${targetMinutes - selectedDay.minutes}m under` : `+${selectedDay.minutes - targetMinutes}m over`}
            </span>
          </div>
        )}

        {/* Interactive SVG Bar Chart matching mockup specifications */}
        <div className="w-full pt-1">
          <svg className="w-full h-16 overflow-visible" fill="none" viewBox="0 0 320 64" xmlns="http://www.w3.org/2000/svg">
            {/* Target 30m guideline */}
            <line stroke="#3c4a42" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="26" y2="26" />
            
            {durations.map((d, index) => {
              const xPos = 20 + index * 64;
              // Map minutes to bar height
              const height = Math.min(52, Math.max(16, (d.minutes / maxMinutes) * chartHeight + 8));
              const yPos = 60 - height;
              const isSelected = selectedDay?.shortDay === d.shortDay;
              const isTargetDay = d.shortDay === 'TUE'; // Highlight Tuesday from mockup or selected
              const isHighlighted = isSelected || (!selectedDay && isTargetDay);

              return (
                <g 
                  key={d.shortDay} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedDay(selectedDay?.shortDay === d.shortDay ? null : d)}
                >
                  <rect
                    x={xPos}
                    y={yPos}
                    width="28"
                    height={height}
                    rx="4"
                    fill={isHighlighted ? '#10b981' : '#4edea3'}
                    opacity={isHighlighted ? '1' : '0.85'}
                    className="transition-all duration-200 group-hover:brightness-110"
                    stroke={isSelected ? '#dce1fb' : 'transparent'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={xPos + 14}
                    y={yPos + Math.min(height - 4, 28)}
                    fill="#003824"
                    fontFamily="JetBrains Mono"
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {d.minutes}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Day Labels */}
          <div className="flex justify-between px-2 pt-1">
            {durations.map((d) => {
              const isTuesday = d.shortDay === 'TUE';
              const isSelected = selectedDay?.shortDay === d.shortDay;
              return (
                <button
                  key={d.shortDay}
                  onClick={() => setSelectedDay(selectedDay?.shortDay === d.shortDay ? null : d)}
                  className={`font-label-caps text-[10px] transition-colors ${
                    isSelected
                      ? 'text-primary font-bold underline'
                      : isTuesday
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {d.shortDay}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
