import React, { useState } from 'react';
import { CommuteRecord } from '../types/commute';

interface RecentCommutesFeedProps {
  commutes: CommuteRecord[];
  onSelectCommute: (commute: CommuteRecord) => void;
  onViewAllHistory: () => void;
}

export const RecentCommutesFeed: React.FC<RecentCommutesFeedProps> = ({
  commutes,
  onSelectCommute,
  onViewAllHistory,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'AM' | 'PM'>('ALL');

  const filteredCommutes = commutes.filter((c) => {
    if (filter === 'ALL') return true;
    return c.timeOfDay === filter;
  });

  const getModeIcon = (mode: string) => {
    switch (mode) {
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

  const getStatusBadge = (status: string, label: string) => {
    switch (status) {
      case 'on_time':
        return (
          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold border border-primary/20">
            {label}
          </span>
        );
      case 'fast_run':
        return (
          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-md bg-secondary-container/20 text-secondary-fixed font-bold border border-secondary/20">
            {label}
          </span>
        );
      case 'delay':
        return (
          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-md bg-tertiary-container/20 text-tertiary-fixed font-bold border border-tertiary-container/30">
            {label}
          </span>
        );
      case 'optimal':
        return (
          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-md bg-primary-container/20 text-primary-fixed-dim font-bold border border-primary/20">
            {label}
          </span>
        );
      default:
        return (
          <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-bold">
            {label}
          </span>
        );
    }
  };

  const getIconColor = (mode: string) => {
    switch (mode) {
      case 'metro':
        return 'text-secondary';
      case 'ebike':
        return 'text-primary';
      case 'bus':
        return 'text-tertiary-container';
      default:
        return 'text-primary';
    }
  };

  return (
    <section className="flex flex-col gap-3 mb-4">
      {/* Header and Filter Buttons */}
      <div className="flex items-center justify-between">
        <span className="font-headline-sm text-on-surface font-semibold tracking-tight text-[18px]">
          Recent Commutes
        </span>
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          {(['ALL', 'AM', 'PM'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-0.5 rounded-lg font-label-caps text-[10px] transition-all ${
                filter === tab
                  ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-2.5">
        {filteredCommutes.slice(0, 4).map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCommute(c)}
            className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all shadow-sm flex flex-col gap-2 border border-outline-variant/30 hover:border-outline-variant cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[19px] ${getIconColor(c.mode)}`}>
                  {getModeIcon(c.mode)}
                </span>
                <span className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                  {c.title}
                </span>
              </div>
              {getStatusBadge(c.status, c.statusLabel)}
            </div>

            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[13px]">
              <span className="truncate pr-2">{c.route}</span>
              <div className="flex items-center gap-2 shrink-0">
                {c.calories && (
                  <span className="font-label-caps text-[10px] text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded">
                    {c.calories} kcal
                  </span>
                )}
                <span className="font-metric-md text-on-surface font-semibold text-[17px]">
                  {c.durationMinutes} min
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All History Shortcut */}
      <button
        onClick={onViewAllHistory}
        className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary font-label-sm text-xs flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-colors"
      >
        <span>View Full Commute Log & Splits</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </section>
  );
};
