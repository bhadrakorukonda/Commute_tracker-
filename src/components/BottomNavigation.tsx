import React from 'react';
import { sound } from '../utils/audio';

export type NavigationTab = 'track' | 'history' | 'insights';

interface BottomNavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'track', label: 'Track', icon: 'near_me' },
    { id: 'history', label: 'History', icon: 'timeline' },
    { id: 'insights', label: 'Insights', icon: 'analytics' },
  ];

  const handleSelect = (tab: NavigationTab) => {
    sound.playTap();
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#070d1f]/95 backdrop-blur-xl shadow-[0_-2px_16px_rgba(0,0,0,0.5)] border-t border-outline-variant/30">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[72px] min-h-[44px] gap-0.5 transition-all select-none cursor-pointer ${
                isActive
                  ? 'text-primary font-semibold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary mt-0.5 shadow-[0_0_4px_rgba(78,222,163,0.9)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
