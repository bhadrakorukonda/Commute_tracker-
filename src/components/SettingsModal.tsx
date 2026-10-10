import React, { useState } from 'react';

interface SettingsModalProps {
  origin: string;
  destination: string;
  targetMinutes: number;
  onSaveSettings: (settings: { origin: string; destination: string; targetMinutes: number }) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  origin,
  destination,
  targetMinutes,
  onSaveSettings,
  onResetData,
  onClose,
}) => {
  const [localOrigin, setLocalOrigin] = useState(origin);
  const [localDestination, setLocalDestination] = useState(destination);
  const [localTarget, setLocalTarget] = useState(targetMinutes);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = () => {
    onSaveSettings({
      origin: localOrigin.trim() || '742 Evergreen Terr',
      destination: localDestination.trim() || 'Downtown Tech HQ',
      targetMinutes: localTarget,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container p-5 shadow-2xl border border-outline-variant/60 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <span className="font-headline-sm text-on-surface font-semibold text-base">
              Commuter Telemetry Settings
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
              Home Base Address
            </label>
            <input
              type="text"
              value={localOrigin}
              onChange={(e) => setLocalOrigin(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
              Work Destination
            </label>
            <input
              type="text"
              value={localDestination}
              onChange={(e) => setLocalDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">
                Target Commute Time
              </label>
              <span className="font-mono text-primary font-bold">{localTarget} min</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={localTarget}
              onChange={(e) => setLocalTarget(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
              <span>15m Fast</span>
              <span>30m Ideal</span>
              <span>60m Outer</span>
            </div>
          </div>

          {/* Sound Feedback Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">volume_up</span>
              <span className="font-medium text-on-surface">Audio Telemetry Cues</span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-sm text-xs font-bold shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            Apply Preferences
          </button>
          <button
            onClick={onResetData}
            className="w-full py-2 rounded-xl text-error text-[11px] font-mono hover:bg-error-container/20 transition-colors"
          >
            Reset Commute Logs to Default
          </button>
        </div>
      </div>
    </div>
  );
};
