import React, { useState } from 'react';
import { CommuteHeatmapChart } from './CommuteHeatmapChart';

export const InsightsScreen: React.FC = () => {
  const [activeWindow, setActiveWindow] = useState<'morning' | 'evening'>('evening');

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* 1. Commute Efficiency Score Card */}
      <section className="rounded-2xl bg-surface-container p-4 shadow-lg border border-outline-variant/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <span className="font-headline-sm text-on-surface font-semibold text-[17px]">
              Commute Efficiency Index
            </span>
          </div>
          <span className="font-label-caps text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
            TOP 5% IN METRO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-surface-container-high border-4 border-primary shadow-[0_0_16px_rgba(78,222,163,0.25)] shrink-0">
            <span className="font-metric-lg text-primary text-[28px] font-bold">94</span>
            <span className="text-[10px] text-on-surface-variant font-mono absolute -bottom-1 bg-surface-container-low px-1 rounded">
              /100
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-on-surface font-bold text-sm">Ultra-Optimized Commute</span>
            <span className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">
              Your multi-modal combination of Line 2 rail and E-Bike routes saves an average of <strong className="text-primary">18.4 minutes</strong> per day over private driving.
            </span>
          </div>
        </div>
      </section>

      {/* 2. Recharts Daily Commute Heat Map Visualization (Peak Travel Times vs Carbon Emission Efficiency) */}
      <CommuteHeatmapChart />

      {/* 2. Mode Distribution Matrix */}
      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-on-surface font-semibold text-sm">
            Mode Distribution (Last 30 Days)
          </span>
          <span className="font-label-caps text-[10px] text-on-surface-variant">42 TOTAL TRIPS</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
          <div style={{ width: '52%' }} className="bg-primary h-full" title="Metro: 52%" />
          <div style={{ width: '26%' }} className="bg-secondary h-full" title="E-Bike: 26%" />
          <div style={{ width: '14%' }} className="bg-secondary-container h-full" title="Bus: 14%" />
          <div style={{ width: '8%' }} className="bg-outline-variant h-full" title="Walk/Car: 8%" />
        </div>

        {/* Mode Legend */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-on-surface font-medium">Metro Transit</span>
            </div>
            <span className="font-mono text-primary font-bold">52% (22)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-on-surface font-medium">E-Bike Trail</span>
            </div>
            <span className="font-mono text-secondary font-bold">26% (11)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
              <span className="text-on-surface font-medium">Rapid Bus</span>
            </div>
            <span className="font-mono text-on-surface font-bold">14% (6)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
              <span className="text-on-surface font-medium">Walk & Other</span>
            </div>
            <span className="font-mono text-on-surface-variant font-bold">8% (3)</span>
          </div>
        </div>
      </section>

      {/* 3. Congestion Heatmap & Departure Window Predictor */}
      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-headline-sm text-on-surface font-semibold text-sm block">
              Congestion Curve & Departure Advisory
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Corridor 4A traffic volume forecast
            </span>
          </div>
          <div className="flex rounded-lg bg-surface-container p-0.5 border border-outline-variant/30 text-[10px] font-mono">
            <button
              onClick={() => setActiveWindow('morning')}
              className={`px-2 py-1 rounded ${activeWindow === 'morning' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}
            >
              AM
            </button>
            <button
              onClick={() => setActiveWindow('evening')}
              className={`px-2 py-1 rounded ${activeWindow === 'evening' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Departure Window Recommendation Banner */}
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">timer</span>
          <div className="text-xs">
            <span className="text-primary font-bold block">
              {activeWindow === 'evening' ? 'Recommended: Depart by 4:45 PM or after 6:15 PM' : 'Recommended: Depart by 7:45 AM or after 8:40 AM'}
            </span>
            <span className="text-on-surface-variant text-[11px]">
              {activeWindow === 'evening' ? 'Avoid peak bottleneck between 5:10 PM - 5:45 PM (+14m delays).' : 'Avoid school and tunnel queue between 8:05 AM - 8:30 AM.'}
            </span>
          </div>
        </div>

        {/* Hour-by-Hour Traffic Bars */}
        <div className="grid grid-cols-5 gap-1.5 pt-1 text-center font-mono">
          {(activeWindow === 'evening'
            ? [
                { time: '4:30 PM', delay: '+2m', level: 'low', color: 'bg-primary' },
                { time: '5:00 PM', delay: '+9m', level: 'med', color: 'bg-secondary' },
                { time: '5:15 PM', delay: '+14m', level: 'peak', color: 'bg-tertiary-container' },
                { time: '5:45 PM', delay: '+11m', level: 'high', color: 'bg-tertiary' },
                { time: '6:15 PM', delay: '+3m', level: 'low', color: 'bg-primary' },
              ]
            : [
                { time: '7:30 AM', delay: '+1m', level: 'low', color: 'bg-primary' },
                { time: '8:00 AM', delay: '+8m', level: 'med', color: 'bg-secondary' },
                { time: '8:15 AM', delay: '+15m', level: 'peak', color: 'bg-tertiary-container' },
                { time: '8:45 AM', delay: '+5m', level: 'med', color: 'bg-secondary' },
                { time: '9:15 AM', delay: '+0m', level: 'low', color: 'bg-primary' },
              ]
          ).map((slot, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-container border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant">{slot.time}</span>
              <div className={`w-3.5 h-10 rounded-md ${slot.color} flex items-end justify-center pb-1 text-[8px] text-on-primary font-bold shadow-sm`} />
              <span className="text-[10px] font-bold text-on-surface">{slot.delay}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Environmental & Financial Dividends */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface-container-low p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Trees Saved Equivalent
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">forest</span>
          </div>
          <div>
            <span className="font-metric-lg text-[26px] text-on-surface font-bold">4.2</span>
            <span className="text-xs text-secondary block mt-0.5 font-medium">84.2 kg total CO₂ offset</span>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-low p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Money Saved vs Driving
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          </div>
          <div>
            <span className="font-metric-lg text-[26px] text-on-surface font-bold">$164.20</span>
            <span className="text-xs text-primary block mt-0.5 font-medium">Gas & parking saved</span>
          </div>
        </div>
      </section>
    </div>
  );
};
