import React, { useState } from 'react';
import { CommuteRecord, CommuteDirection, VehicleMode } from '../types/commute';
import { sound } from '../utils/audio';

interface EndCommuteModalProps {
  elapsedSeconds: number;
  mode: VehicleMode;
  direction: CommuteDirection;
  origin: string;
  destination: string;
  corridorName: string;
  onConfirmSave: (newCommute: CommuteRecord) => void;
  onCancel: () => void;
}

export const EndCommuteModal: React.FC<EndCommuteModalProps> = ({
  elapsedSeconds,
  mode,
  direction,
  origin,
  destination,
  corridorName,
  onConfirmSave,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');

  const mins = Math.max(1, Math.floor(elapsedSeconds / 60));
  const secs = elapsedSeconds % 60;

  // Derive realistic telemetry
  const distanceKm = Number(((mins / 60) * (mode === 'metro' ? 34 : mode === 'ebike' ? 24 : mode === 'bus' ? 20 : 5)).toFixed(1));
  const avgSpeedKmh = Number((distanceKm / (mins / 60)).toFixed(1));
  const co2SavedKg = Number((distanceKm * 0.18).toFixed(1));
  const calories = mode === 'ebike' ? Math.round(mins * 5.2) : mode === 'walk' ? Math.round(mins * 4.8) : undefined;

  const handleSave = () => {
    sound.playComplete();
    const now = new Date();
    const hours = now.getHours();
    const timeOfDay = hours >= 12 ? 'PM' : 'AM';
    const depTimeFormatted = `${hours % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${timeOfDay}`;

    const newRecord: CommuteRecord = {
      id: `commute-${Date.now()}`,
      direction,
      title: direction === 'home_to_work' ? 'Home → Work' : 'Work → Home',
      route: `${corridorName} • Dep ${depTimeFormatted}`,
      mode,
      departureTime: depTimeFormatted,
      durationMinutes: mins,
      durationSeconds: secs,
      status: mins <= 30 ? 'optimal' : mins <= 38 ? 'on_time' : 'delay',
      statusLabel: mins <= 30 ? 'OPTIMAL' : mins <= 38 ? 'ON TIME' : 'DELAY',
      statusDelta: mins <= 30 ? '-2m' : '+4m',
      co2SavedKg,
      distanceKm,
      avgSpeedKmh,
      calories,
      date: 'Today',
      timeOfDay,
      notes: notes.trim() || 'Recorded via Live Telemetry Sync.',
    };

    onConfirmSave(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container p-5 shadow-2xl border border-primary/40 flex flex-col gap-4">
        {/* Celebration header */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-1">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/40 shadow-[0_0_20px_rgba(78,222,163,0.3)]">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
          </div>
          <span className="font-headline-md text-on-surface font-bold text-lg">
            Commute Completed!
          </span>
          <span className="font-label-caps text-secondary text-xs font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
            +35 PTS EARNED • STREAK MAINTAINED
          </span>
        </div>

        {/* Telemetry Summary Card */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Recorded Duration</span>
            <span className="font-metric-lg text-primary text-xl font-bold font-mono">
              {mins}m {secs}s
            </span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-outline-variant/20 pt-2">
            <span className="text-on-surface-variant">Corridor Route</span>
            <span className="text-on-surface font-medium truncate max-w-[170px] text-right">
              {origin} → {destination}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center pt-1 border-t border-outline-variant/20 font-mono text-xs">
            <div className="p-1.5 rounded-lg bg-surface-container-high">
              <span className="text-[9px] text-on-surface-variant block">SPEED</span>
              <span className="font-bold text-on-surface">{avgSpeedKmh} km/h</span>
            </div>
            <div className="p-1.5 rounded-lg bg-surface-container-high">
              <span className="text-[9px] text-on-surface-variant block">DISTANCE</span>
              <span className="font-bold text-on-surface">{distanceKm} km</span>
            </div>
            <div className="p-1.5 rounded-lg bg-surface-container-high">
              <span className="text-[9px] text-on-surface-variant block">CO₂ OFFSET</span>
              <span className="font-bold text-secondary">+{co2SavedKg} kg</span>
            </div>
          </div>
        </div>

        {/* Commute Notes Input */}
        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase">
            Trip Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Smooth transit, boarded platform 2..."
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-sm font-bold text-xs shadow-lg shadow-primary/20 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save & Commit to Log</span>
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-label-sm text-xs transition-colors"
          >
            Cancel / Resume Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
