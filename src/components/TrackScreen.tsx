import React from 'react';
import { CommuteDirection, CommuteRecord, CorridorOption, DayDuration, VehicleMode } from '../types/commute';
import { ActiveCommuteCard } from './ActiveCommuteCard';
import { CommuteLauncherCard } from './CommuteLauncherCard';
import { TransitMapCard } from './TransitMapCard';
import { WeeklyChartCard } from './WeeklyChartCard';
import { RecentCommutesFeed } from './RecentCommutesFeed';

interface TrackScreenProps {
  commutes: CommuteRecord[];
  isCommutingActive: boolean;
  activeMode: VehicleMode;
  origin: string;
  destination: string;
  activeCorridor: CorridorOption;
  corridors: CorridorOption[];
  direction: CommuteDirection;
  durations: DayDuration[];
  targetMinutes: number;
  streakDays: number;
  commuterPoints: number;
  weeklyAvg: string;
  onDirectionChange: (dir: CommuteDirection) => void;
  onSelectCorridor: (c: CorridorOption) => void;
  onSelectMode: (m: VehicleMode) => void;
  onStartCommute: () => void;
  onEndCommuteClick: (elapsedSeconds: number) => void;
  onSelectCommute: (record: CommuteRecord) => void;
  onViewAllHistory: () => void;
}

export const TrackScreen: React.FC<TrackScreenProps> = ({
  commutes,
  isCommutingActive,
  activeMode,
  origin,
  destination,
  activeCorridor,
  corridors,
  direction,
  durations,
  targetMinutes,
  streakDays,
  commuterPoints,
  weeklyAvg,
  onDirectionChange,
  onSelectCorridor,
  onSelectMode,
  onStartCommute,
  onEndCommuteClick,
  onSelectCommute,
  onViewAllHistory,
}) => {
  // Format current date nicely or default to mockup date
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateFormatted = `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`;
  const isMorning = now.getHours() < 12;

  return (
    <div className="flex flex-col w-full gap-4">
      {/* 1. Top Date & Weekly Stats Pill Header */}
      <section className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-on-surface font-semibold tracking-tight text-[20px]">
            {dateFormatted}
          </span>
          <span className="font-label-caps text-[11px] px-2.5 py-1 rounded-full bg-surface-container-high text-primary flex items-center gap-1.5 shadow-sm border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {isMorning ? 'MORNING RUN' : 'EVENING COMMUTE'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Weekly Avg pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface shadow-sm shrink-0 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[15px] text-primary">speed</span>
            <span className="font-body-sm text-[12px] text-on-surface-variant">Weekly Avg:</span>
            <span className="font-metric-md text-[14px] text-on-surface font-semibold">{weeklyAvg}</span>
            <span className="font-label-caps text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">
              -4%
            </span>
          </div>

          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface shadow-sm shrink-0 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[15px] text-tertiary-container">
              local_fire_department
            </span>
            <span className="font-metric-md text-[14px] text-on-surface font-bold">{streakDays}</span>
            <span className="font-body-sm text-[12px] text-on-surface-variant">Days</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="font-label-caps text-[10px] text-secondary font-semibold">
              {commuterPoints} PTS
            </span>
          </div>
        </div>
      </section>

      {/* 2. Active Commute State Banner (Elevated Active Card) */}
      <ActiveCommuteCard
        isActive={isCommutingActive}
        mode={activeMode}
        origin={direction === 'home_to_work' ? origin : destination}
        destination={direction === 'home_to_work' ? destination : origin}
        corridorTag={activeCorridor.line}
        departedTime="08:14 AM"
        onEndCommute={onEndCommuteClick}
      />

      {/* 3. Commute Launcher Card (Primary Action Hub) */}
      <CommuteLauncherCard
        direction={direction}
        onDirectionChange={onDirectionChange}
        selectedCorridor={activeCorridor}
        corridors={corridors}
        onSelectCorridor={onSelectCorridor}
        selectedMode={activeMode}
        onSelectMode={onSelectMode}
        onStartCommute={onStartCommute}
        isCommutingActive={isCommutingActive}
      />

      {/* 4. Transit Radar Map Card */}
      <TransitMapCard
        mode={activeMode}
        isActiveCommute={isCommutingActive}
        corridorName={activeCorridor.name}
      />

      {/* 5. Quick Telemetry & Weekly Benchmarks Mini-Grid */}
      <WeeklyChartCard
        durations={durations}
        targetMinutes={targetMinutes}
      />

      {/* 6. Recent Commutes Feed */}
      <RecentCommutesFeed
        commutes={commutes}
        onSelectCommute={onSelectCommute}
        onViewAllHistory={onViewAllHistory}
      />
    </div>
  );
};
