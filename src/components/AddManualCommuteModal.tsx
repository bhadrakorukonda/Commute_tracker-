import React, { useState } from 'react';
import { CommuteRecord, CommuteDirection, VehicleMode } from '../types/commute';

interface AddManualCommuteModalProps {
  onAddCommute: (record: CommuteRecord) => void;
  onClose: () => void;
}

export const AddManualCommuteModal: React.FC<AddManualCommuteModalProps> = ({
  onAddCommute,
  onClose,
}) => {
  const [direction, setDirection] = useState<CommuteDirection>('home_to_work');
  const [mode, setMode] = useState<VehicleMode>('metro');
  const [duration, setDuration] = useState('32');
  const [departureTime, setDepartureTime] = useState('08:15 AM');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(duration) || 30;
    const isMorning = departureTime.toUpperCase().includes('AM');

    const newRecord: CommuteRecord = {
      id: `commute-${Date.now()}`,
      direction,
      title: direction === 'home_to_work' ? 'Home → Work' : 'Work → Home',
      route: `${mode.toUpperCase()} Manual Log • Dep ${departureTime}`,
      mode,
      departureTime,
      durationMinutes: mins,
      status: mins <= 30 ? 'optimal' : mins <= 38 ? 'on_time' : 'delay',
      statusLabel: mins <= 30 ? 'OPTIMAL' : mins <= 38 ? 'ON TIME' : 'DELAY',
      statusDelta: mins <= 30 ? '-2m' : '+5m',
      co2SavedKg: Number((mins * 0.08).toFixed(1)),
      distanceKm: Number((mins * 0.4).toFixed(1)),
      avgSpeedKmh: 32,
      date: 'Today',
      timeOfDay: isMorning ? 'AM' : 'PM',
      notes: notes.trim() || 'Manually logged commute entry.',
    };

    onAddCommute(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container p-5 shadow-2xl border border-outline-variant/60 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">add_task</span>
            <span className="font-headline-sm text-on-surface font-semibold text-base">
              Log Past Commute
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          {/* Direction */}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
              Direction
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('home_to_work')}
                className={`py-2 rounded-xl text-center font-medium ${
                  direction === 'home_to_work'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Home → Work
              </button>
              <button
                type="button"
                onClick={() => setDirection('work_to_home')}
                className={`py-2 rounded-xl text-center font-medium ${
                  direction === 'work_to_home'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Work → Home
              </button>
            </div>
          </div>

          {/* Mode */}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
              Vehicle Mode
            </label>
            <div className="grid grid-cols-5 gap-1 text-center font-medium">
              {(['metro', 'ebike', 'bus', 'walk', 'car'] as VehicleMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`py-1.5 rounded-lg text-[11px] capitalize ${
                    mode === m
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Departure */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
                Duration (min)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
                Departure
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Express line was quick..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-primary text-on-primary font-label-sm text-xs font-bold shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            Add to Commute Log
          </button>
        </form>
      </div>
    </div>
  );
};
