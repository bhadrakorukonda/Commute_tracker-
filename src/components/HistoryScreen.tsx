import React, { useState } from 'react';
import { CommuteRecord, VehicleMode } from '../types/commute';

interface HistoryScreenProps {
  commutes: CommuteRecord[];
  onSelectCommute: (commute: CommuteRecord) => void;
  onAddCommuteClick: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  commutes,
  onSelectCommute,
  onAddCommuteClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('all');

  const modes: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Modes', icon: 'grid_view' },
    { id: 'metro', label: 'Metro', icon: 'subway' },
    { id: 'ebike', label: 'E-Bike', icon: 'electric_bike' },
    { id: 'bus', label: 'Bus', icon: 'directions_bus' },
    { id: 'walk', label: 'Walk', icon: 'directions_walk' },
    { id: 'car', label: 'Car', icon: 'directions_car' },
  ];

  const filteredCommutes = commutes.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMode = selectedModeFilter === 'all' || c.mode === selectedModeFilter;
    return matchesSearch && matchesMode;
  });

  // Calculate aggregated stats
  const totalMinutes = commutes.reduce((acc, c) => acc + c.durationMinutes, 0);
  const totalCo2 = commutes.reduce((acc, c) => acc + c.co2SavedKg, 0);
  const totalCalories = commutes.reduce((acc, c) => acc + (c.calories || 0), 0);
  const onTimePercentage = Math.round(
    (commutes.filter((c) => c.status !== 'delay').length / (commutes.length || 1)) * 100
  );

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Top Banner Stats */}
      <section className="rounded-2xl bg-surface-container p-4 shadow-lg border border-outline-variant/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">history</span>
            <span className="font-headline-sm text-on-surface font-semibold text-[17px]">
              Commute Log & Telemetry
            </span>
          </div>
          <button
            onClick={onAddCommuteClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Log Trip</span>
          </button>
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-outline-variant/20">
          <div className="flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">Trips</span>
            <span className="font-metric-md text-on-surface font-bold text-base">{commutes.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">Total Time</span>
            <span className="font-metric-md text-on-surface font-bold text-base">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">Punctuality</span>
            <span className="font-metric-md text-secondary font-bold text-base">{onTimePercentage}%</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">CO2 Offset</span>
            <span className="font-metric-md text-primary font-bold text-base">{totalCo2.toFixed(1)}kg</span>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search routes, stations, notes..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 text-xs border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Mode Filters Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModeFilter(m.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
              selectedModeFilter === m.id
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Commutes List */}
      <div className="flex flex-col gap-2.5">
        {filteredCommutes.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-3xl mb-1 text-on-surface-variant/60 block">
              filter_alt_off
            </span>
            No commutes match your search or filter.
          </div>
        ) : (
          filteredCommutes.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCommute(c)}
              className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all shadow-sm flex flex-col gap-2 border border-outline-variant/30 hover:border-primary/40 cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">
                      {c.mode === 'metro'
                        ? 'subway'
                        : c.mode === 'ebike'
                        ? 'electric_bike'
                        : c.mode === 'bus'
                        ? 'directions_bus'
                        : c.mode === 'walk'
                        ? 'directions_walk'
                        : 'directions_car'}
                    </span>
                  </div>
                  <div>
                    <span className="font-body-md text-on-surface font-semibold text-sm group-hover:text-primary transition-colors block">
                      {c.title}
                    </span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">
                      {c.date} • {c.departureTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-metric-md text-on-surface font-bold text-base">
                    {c.durationMinutes} min
                  </span>
                  <span
                    className={`font-label-caps text-[9px] px-1.5 py-0.5 rounded ${
                      c.status === 'optimal' || c.status === 'fast_run'
                        ? 'bg-secondary/20 text-secondary-fixed'
                        : c.status === 'delay'
                        ? 'bg-tertiary-container/20 text-tertiary-fixed'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {c.statusLabel}
                  </span>
                </div>
              </div>

              {/* Sub-telemetry strip */}
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/15 font-mono text-[11px]">
                <span className="truncate">{c.route}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span>{c.avgSpeedKmh} km/h</span>
                  <span>•</span>
                  <span>{c.distanceKm} km</span>
                  <span>•</span>
                  <span className="text-secondary">+{c.co2SavedKg}kg CO₂</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
