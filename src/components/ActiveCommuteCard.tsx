import React, { useEffect, useState } from 'react';
import { VehicleMode } from '../types/commute';

interface ActiveCommuteCardProps {
  isActive: boolean;
  mode: VehicleMode;
  origin: string;
  destination: string;
  corridorTag: string;
  departedTime: string;
  onEndCommute: (elapsedSeconds: number) => void;
}

export const ActiveCommuteCard: React.FC<ActiveCommuteCardProps> = ({
  isActive,
  mode,
  origin,
  destination,
  corridorTag,
  departedTime,
  onEndCommute,
}) => {
  // Start with default mockup elapsed time (24m 21.4s)
  const [seconds, setSeconds] = useState(24 * 60 + 21);
  const [tenths, setTenths] = useState(4);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTenths((prevTenths) => {
        if (prevTenths >= 9) {
          setSeconds((s) => s + 1);
          return 0;
        }
        return prevTenths + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const getModeIcon = () => {
    switch (mode) {
      case 'metro':
        return 'train';
      case 'ebike':
        return 'electric_bike';
      case 'bus':
        return 'directions_bus';
      case 'walk':
        return 'directions_walk';
      case 'car':
        return 'directions_car';
      default:
        return 'train';
    }
  };

  if (!isActive) {
    return (
      <section className="relative rounded-2xl bg-surface-container-high/60 p-4 border border-outline-variant/30 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-outline-variant" />
            <span className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-wider">
              No Active Commute in Progress
            </span>
          </div>
          <span className="font-label-caps text-[10px] text-primary">STANDBY</span>
        </div>
        <p className="font-body-sm text-on-surface-variant text-left mt-2">
          Select your corridor and vehicle mode below, then tap <strong className="text-primary">START</strong> to begin live GPS telemetry tracking.
        </p>
      </section>
    );
  }

  return (
    <section className="relative rounded-2xl bg-surface-container-high p-4 overflow-hidden shadow-xl border border-primary/30">
      {/* Background Neon Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Top Header Status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">{getModeIcon()}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-label-caps text-[11px] text-primary font-bold tracking-widest uppercase">
                ACTIVE COMMUTE
              </span>
            </div>
            <span className="font-body-sm text-on-surface-variant text-xs">
              Departed {departedTime}
            </span>
          </div>
        </div>
        <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 shrink-0">
          {corridorTag}
        </span>
      </div>

      {/* Origin -> Destination Pill */}
      <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-surface-container-low flex items-center gap-2 border border-outline-variant/20">
        <span className="material-symbols-outlined text-[16px] text-primary shrink-0">navigation</span>
        <span className="font-body-sm text-on-surface truncate text-xs font-medium">
          {origin} → {destination}
        </span>
      </div>

      {/* Timer & End Commute Action */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex flex-col">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
            Elapsed Time
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
            <span className="font-metric-lg text-on-surface tracking-tight font-bold text-[26px]">
              {hrs}:{mins}:{secs}.{tenths}
            </span>
          </div>
        </div>
        <button
          onClick={() => onEndCommute(seconds)}
          className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-error-container text-on-error hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0 border border-error/20"
        >
          <span className="material-symbols-outlined text-[18px]">stop_circle</span>
          <span className="font-label-sm text-xs font-semibold">End Commute</span>
        </button>
      </div>
    </section>
  );
};
