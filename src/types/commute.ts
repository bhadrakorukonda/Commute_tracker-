export type VehicleMode = 'metro' | 'ebike' | 'bus' | 'walk' | 'car';

export type CommuteDirection = 'home_to_work' | 'work_to_home';

export type CommuteStatus = 'on_time' | 'fast_run' | 'delay' | 'optimal';

export interface CommuteRecord {
  id: string;
  direction: CommuteDirection;
  title: string;
  route: string;
  mode: VehicleMode;
  departureTime: string;
  durationMinutes: number;
  durationSeconds?: number;
  status: CommuteStatus;
  statusLabel: string;
  statusDelta?: string;
  calories?: number;
  co2SavedKg: number;
  distanceKm: number;
  avgSpeedKmh: number;
  date: string;
  timeOfDay: 'AM' | 'PM';
  notes?: string;
}

export interface CorridorOption {
  id: string;
  name: string;
  line: string;
  estimatedMinutes: number;
  trafficDelay: number;
  modes: VehicleMode[];
  description: string;
}

export interface DayDuration {
  day: string;
  shortDay: string;
  minutes: number;
  targetMinutes: number;
  mode: VehicleMode;
}
