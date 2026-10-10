import React from 'react';
import { CommuteRecord } from '../types/commute';

interface TripDetailModalProps {
  commute: CommuteRecord | null;
  onClose: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({ commute, onClose }) => {
  if (!commute) return null;

  const getModeIcon = () => {
    switch (commute.mode) {
      case 'metro':
        return 'subway';
      case 'ebike':
        return 'electric_bike';
      case 'bus':
        return 'directions_bus';
      case 'walk':
        return 'directions_walk';
      case 'car':
        return 'directions_car';
      default:
        return 'commute';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container p-5 shadow-2xl border border-outline-variant/60 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">{getModeIcon()}</span>
            </div>
            <div>
              <span className="font-headline-sm text-on-surface font-semibold text-base block">
                {commute.title}
              </span>
              <span className="font-label-caps text-[10px] text-on-surface-variant">
                {commute.date} • {commute.departureTime}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Big Duration Highlight */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              Total Commute Duration
            </span>
            <span className="font-metric-lg text-primary text-[28px] font-bold">
              {commute.durationMinutes} min {commute.durationSeconds ? `${commute.durationSeconds}s` : ''}
            </span>
          </div>
          <div className="text-right">
            <span className="font-label-caps text-[10px] px-2 py-1 rounded bg-surface-container-high text-secondary-fixed font-bold border border-secondary/20 block">
              {commute.statusLabel}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-1 block font-mono">
              {commute.timeOfDay} Commute
            </span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">
              Average Speed
            </span>
            <span className="font-metric-md text-on-surface font-bold text-sm mt-0.5">
              {commute.avgSpeedKmh} km/h
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">
              Total Distance
            </span>
            <span className="font-metric-md text-on-surface font-bold text-sm mt-0.5">
              {commute.distanceKm} km
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">
              CO₂ Emissions Saved
            </span>
            <span className="font-metric-md text-secondary font-bold text-sm mt-0.5">
              +{commute.co2SavedKg} kg
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase">
              Energy Burned
            </span>
            <span className="font-metric-md text-primary font-bold text-sm mt-0.5">
              {commute.calories ? `${commute.calories} kcal` : 'Passive Transit'}
            </span>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
            Corridor & Waypoints
          </span>
          <div className="flex items-center gap-2 text-xs text-on-surface font-medium">
            <span className="material-symbols-outlined text-primary text-[16px]">alt_route</span>
            <span>{commute.route}</span>
          </div>
          {commute.notes && (
            <p className="text-xs text-on-surface-variant italic mt-1 pt-1.5 border-t border-outline-variant/15">
              "{commute.notes}"
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-xs font-semibold transition-colors border border-outline-variant/40"
        >
          Close Telemetry Card
        </button>
      </div>
    </div>
  );
};
