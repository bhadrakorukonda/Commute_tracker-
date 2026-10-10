import React, { useState } from 'react';
import { CommuteDirection, CorridorOption, VehicleMode } from '../types/commute';

interface CommuteLauncherCardProps {
  direction: CommuteDirection;
  onDirectionChange: (dir: CommuteDirection) => void;
  selectedCorridor: CorridorOption;
  corridors: CorridorOption[];
  onSelectCorridor: (corridor: CorridorOption) => void;
  selectedMode: VehicleMode;
  onSelectMode: (mode: VehicleMode) => void;
  onStartCommute: () => void;
  isCommutingActive: boolean;
}

export const CommuteLauncherCard: React.FC<CommuteLauncherCardProps> = ({
  direction,
  onDirectionChange,
  selectedCorridor,
  corridors,
  onSelectCorridor,
  selectedMode,
  onSelectMode,
  onStartCommute,
  isCommutingActive,
}) => {
  const [showCorridorDropdown, setShowCorridorDropdown] = useState(false);

  // Mode configurations and durations
  const modeOptions: { id: VehicleMode; label: string; icon: string; duration: number }[] = [
    { id: 'metro', label: 'Metro', icon: 'subway', duration: 28 },
    { id: 'ebike', label: 'E-Bike', icon: 'electric_bike', duration: 34 },
    { id: 'bus', label: 'Bus', icon: 'directions_bus', duration: 42 },
    { id: 'walk', label: 'Walk', icon: 'directions_walk', duration: 68 },
    { id: 'car', label: 'Car', icon: 'directions_car', duration: 36 },
  ];

  const currentModeConfig = modeOptions.find((m) => m.id === selectedMode) || modeOptions[0];

  // Dynamic ETA calculation
  const now = new Date();
  const departHours = String(now.getHours()).padStart(2, '0');
  const departMinutes = String(now.getMinutes()).padStart(2, '0');

  const etaDate = new Date(now.getTime() + (currentModeConfig.duration + selectedCorridor.trafficDelay) * 60000);
  const etaHours = String(etaDate.getHours()).padStart(2, '0');
  const etaMinutes = String(etaDate.getMinutes()).padStart(2, '0');

  return (
    <section className="rounded-2xl bg-surface-container p-4 shadow-lg flex flex-col gap-3.5 border border-outline-variant/30">
      {/* 1. Direction Switcher */}
      <div className="flex rounded-xl bg-surface-container-lowest p-1 shadow-inner border border-outline-variant/20">
        <button
          onClick={() => onDirectionChange('home_to_work')}
          className={`flex-1 py-1.5 rounded-lg font-label-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            direction === 'home_to_work'
              ? 'bg-surface-container-high text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Home → Work</span>
        </button>
        <button
          onClick={() => onDirectionChange('work_to_home')}
          className={`flex-1 py-1.5 rounded-lg font-label-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            direction === 'work_to_home'
              ? 'bg-surface-container-high text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">domain</span>
          <span>Work → Home</span>
        </button>
      </div>

      {/* 2. Corridor Selector */}
      <div className="relative">
        <div
          onClick={() => setShowCorridorDropdown(!showCorridorDropdown)}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low text-on-surface shadow-sm cursor-pointer border border-outline-variant/30 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="material-symbols-outlined text-primary text-[18px]">alt_route</span>
            <div className="truncate">
              <span className="font-label-caps text-on-surface-variant block uppercase text-[10px]">
                Optimized Corridor
              </span>
              <span className="font-body-sm text-on-surface truncate font-medium text-xs">
                {selectedCorridor.name}
              </span>
            </div>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 transition-transform ${showCorridorDropdown ? 'rotate-180' : ''}`}>
            unfold_more
          </span>
        </div>

        {/* Dropdown Options */}
        {showCorridorDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-xl bg-surface-container-high shadow-2xl border border-outline-variant/60 z-20 flex flex-col gap-1">
            {corridors.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCorridor(c);
                  setShowCorridorDropdown(false);
                }}
                className={`p-2 rounded-lg cursor-pointer flex flex-col gap-0.5 transition-colors ${
                  selectedCorridor.id === c.id
                    ? 'bg-primary/10 border border-primary/30 text-primary'
                    : 'hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{c.name}</span>
                  <span className="font-mono text-[10px] text-secondary">{c.line}</span>
                </div>
                <span className="text-[11px] text-on-surface-variant truncate">{c.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Mode Selector Carousel */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-caps text-on-surface-variant tracking-wider uppercase text-[10px]">
          Select Telemetry Vehicle
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {modeOptions.map((opt) => {
            const isSelected = selectedMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectMode(opt.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl shadow-sm transition-transform active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-md font-bold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                  {opt.icon}
                </span>
                <span className={`font-label-sm text-[11px] mt-1 ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {opt.label}
                </span>
                <span className={`font-label-caps text-[10px] ${isSelected ? 'text-on-primary/80 font-bold' : 'text-on-surface-variant'}`}>
                  {opt.duration}m
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Start Action + Status Telemetry */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-outline-variant/20">
        <div className="flex flex-col">
          <span className="font-label-caps text-primary tracking-wider uppercase font-semibold flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            READY TO ROLL • {departHours}:{departMinutes}
          </span>
          <span className="font-body-md text-on-surface font-semibold text-sm">
            Destination ETA: {etaHours}:{etaMinutes}
          </span>
          <span className="font-label-caps text-secondary-fixed text-[10px]">
            {selectedCorridor.trafficDelay > 0
              ? `Expected Traffic: +${selectedCorridor.trafficDelay}m delay`
              : 'Expected Traffic: +0m delay'}
          </span>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartCommute}
          disabled={isCommutingActive}
          className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0 transition-all ${
            isCommutingActive
              ? 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'
              : 'bg-gradient-to-tr from-primary to-secondary text-on-primary shadow-[0_0_24px_rgba(78,222,163,0.35)] active:scale-90 hover:brightness-105 cursor-pointer'
          }`}
          id="startCommutePulse"
        >
          <span className="material-symbols-outlined text-[28px] leading-none">play_arrow</span>
          <span className="font-label-caps text-[9px] tracking-wider font-bold uppercase mt-0.5">
            {isCommutingActive ? 'ACTIVE' : 'START'}
          </span>
        </button>
      </div>
    </section>
  );
};
