import React, { useState, useEffect } from 'react';
import {
  CommuteDirection,
  CommuteRecord,
  CorridorOption,
  DayDuration,
  VehicleMode,
} from './types/commute';
import {
  INITIAL_COMMUTES,
  INITIAL_CORRIDORS,
  INITIAL_WEEKLY_DURATIONS,
} from './data/mockCommutes';
import { Header } from './components/Header';
import { BottomNavigation, NavigationTab } from './components/BottomNavigation';
import { TrackScreen } from './components/TrackScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { TripDetailModal } from './components/TripDetailModal';
import { EndCommuteModal } from './components/EndCommuteModal';
import { AddManualCommuteModal } from './components/AddManualCommuteModal';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/audio';

export default function App() {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<NavigationTab>('track');

  // Commute state
  const [commutes, setCommutes] = useState<CommuteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_commutes');
      if (saved) return JSON.parse(saved);
    } catch {
      // LocalStorage fallback
    }
    return INITIAL_COMMUTES;
  });

  const [origin, setOrigin] = useState('742 Evergreen Terr');
  const [destination, setDestination] = useState('Downtown Tech HQ');
  const [direction, setDirection] = useState<CommuteDirection>('home_to_work');
  const [selectedMode, setSelectedMode] = useState<VehicleMode>('metro');
  const [corridors] = useState<CorridorOption[]>(INITIAL_CORRIDORS);
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorOption>(INITIAL_CORRIDORS[0]);
  const [targetMinutes, setTargetMinutes] = useState(30);

  // Active commute tracking
  const [isCommutingActive, setIsCommutingActive] = useState(true);
  const [activeElapsedSeconds, setActiveElapsedSeconds] = useState(24 * 60 + 25);
  const [streakDays, setStreakDays] = useState(14);
  const [commuterPoints, setCommuterPoints] = useState(420);
  const [durations, setDurations] = useState<DayDuration[]>(INITIAL_WEEKLY_DURATIONS);

  // Modals state
  const [inspectingCommute, setInspectingCommute] = useState<CommuteRecord | null>(null);
  const [showEndCommuteModal, setShowEndCommuteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Persist commutes
  useEffect(() => {
    try {
      localStorage.setItem('kinetic_commutes', JSON.stringify(commutes));
    } catch {
      // safe fallback
    }
  }, [commutes]);

  // Handler: Start a new commute
  const handleStartCommute = () => {
    sound.playStart();
    setIsCommutingActive(true);
  };

  // Handler: Initiate End Commute modal
  const handleEndCommuteTrigger = (elapsedSeconds: number) => {
    sound.playTap();
    setActiveElapsedSeconds(elapsedSeconds);
    setShowEndCommuteModal(true);
  };

  // Handler: Confirm End Commute save
  const handleConfirmSaveCommute = (newCommute: CommuteRecord) => {
    setCommutes([newCommute, ...commutes]);
    setIsCommutingActive(false);
    setShowEndCommuteModal(false);
    setCommuterPoints((prev) => prev + 35);

    // Update Tuesday or current day bar in weekly chart
    setDurations((prev) =>
      prev.map((d) =>
        d.shortDay === 'TUE'
          ? { ...d, minutes: newCommute.durationMinutes, mode: newCommute.mode }
          : d
      )
    );
  };

  // Handler: Add manual commute
  const handleAddManualCommute = (record: CommuteRecord) => {
    sound.playComplete();
    setCommutes([record, ...commutes]);
    setCommuterPoints((prev) => prev + 25);
  };

  // Handler: Save settings
  const handleSaveSettings = (settings: {
    origin: string;
    destination: string;
    targetMinutes: number;
  }) => {
    setOrigin(settings.origin);
    setDestination(settings.destination);
    setTargetMinutes(settings.targetMinutes);
  };

  // Handler: Reset default data
  const handleResetData = () => {
    setCommutes(INITIAL_COMMUTES);
    setIsCommutingActive(true);
    setStreakDays(14);
    setCommuterPoints(420);
    setDurations(INITIAL_WEEKLY_DURATIONS);
    setShowSettingsModal(false);
  };

  return (
    <div className="bg-[#0c1324] text-[#dce1fb] min-h-screen flex flex-col font-sans select-none antialiased">
      {/* Top Fixed Mobile App Header */}
      <Header
        currentTab={currentTab}
        onOpenSettings={() => {
          sound.playTap();
          setShowSettingsModal(true);
        }}
      />

      {/* Main Container constrained to authentic mobile width */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-16 pb-20 flex flex-col">
        {currentTab === 'track' && (
          <TrackScreen
            commutes={commutes}
            isCommutingActive={isCommutingActive}
            activeMode={selectedMode}
            origin={origin}
            destination={destination}
            activeCorridor={selectedCorridor}
            corridors={corridors}
            direction={direction}
            durations={durations}
            targetMinutes={targetMinutes}
            streakDays={streakDays}
            commuterPoints={commuterPoints}
            weeklyAvg="34m 12s"
            onDirectionChange={(dir) => {
              sound.playTap();
              setDirection(dir);
            }}
            onSelectCorridor={(c) => {
              sound.playTap();
              setSelectedCorridor(c);
            }}
            onSelectMode={(m) => {
              sound.playTap();
              setSelectedMode(m);
            }}
            onStartCommute={handleStartCommute}
            onEndCommuteClick={handleEndCommuteTrigger}
            onSelectCommute={(record) => {
              sound.playTap();
              setInspectingCommute(record);
            }}
            onViewAllHistory={() => {
              sound.playTap();
              setCurrentTab('history');
            }}
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            commutes={commutes}
            onSelectCommute={(record) => {
              sound.playTap();
              setInspectingCommute(record);
            }}
            onAddCommuteClick={() => {
              sound.playTap();
              setShowAddModal(true);
            }}
          />
        )}

        {currentTab === 'insights' && <InsightsScreen />}
      </main>

      {/* Fixed Bottom Tab Navigation Bar */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Trip Details Inspection Modal */}
      {inspectingCommute && (
        <TripDetailModal
          commute={inspectingCommute}
          onClose={() => setInspectingCommute(null)}
        />
      )}

      {/* End Commute & Save Modal */}
      {showEndCommuteModal && (
        <EndCommuteModal
          elapsedSeconds={activeElapsedSeconds}
          mode={selectedMode}
          direction={direction}
          origin={direction === 'home_to_work' ? origin : destination}
          destination={direction === 'home_to_work' ? destination : origin}
          corridorName={selectedCorridor.name}
          onConfirmSave={handleConfirmSaveCommute}
          onCancel={() => setShowEndCommuteModal(false)}
        />
      )}

      {/* Manual Trip Entry Modal */}
      {showAddModal && (
        <AddManualCommuteModal
          onAddCommute={handleAddManualCommute}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* User Preferences & Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          origin={origin}
          destination={destination}
          targetMinutes={targetMinutes}
          onSaveSettings={handleSaveSettings}
          onResetData={handleResetData}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
