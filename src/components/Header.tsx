import React from 'react';

interface HeaderProps {
  currentTab: 'track' | 'history' | 'insights';
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenSettings }) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'track':
        return 'Track';
      case 'history':
        return 'History';
      case 'insights':
        return 'Insights';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0c1324]/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.35)] border-b border-outline-variant/20">
      <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between">
        {/* Left Live Sync Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(78,222,163,0.8)]" />
            <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-wider">
              LIVE SYNC
            </span>
          </div>
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase hidden xs:inline">
            KINETIC COMMUTE
          </span>
        </div>

        {/* Right Tab Title & Profile Button */}
        <div className="flex items-center gap-2.5">
          <span className="font-headline-sm text-on-surface font-semibold text-base capitalize">
            {getTabTitle()}
          </span>
          <button
            onClick={onOpenSettings}
            title="Commuter Telemetry Settings"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
