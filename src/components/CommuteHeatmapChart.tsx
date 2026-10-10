import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ComposedChart,
  Area,
  Line,
  Bar,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';

export interface HeatmapDataPoint {
  day: string;
  dayIndex: number; // 1 to 5 (Mon to Fri)
  time: string;
  timeHour: number; // 6 to 19
  congestionDelayMin: number;
  carbonEfficiencyPct: number; // 0 to 100%
  carbonSavedKg: number;
  peakLevel: 'low' | 'moderate' | 'peak' | 'severe';
  recommendedRoute: string;
}

// 5 weekdays x 9 key transit intervals
export const WEEKLY_HEATMAP_DATA: HeatmapDataPoint[] = [
  // MONDAY
  { day: 'Mon', dayIndex: 1, time: '6:30 AM', timeHour: 6.5, congestionDelayMin: 1, carbonEfficiencyPct: 96, carbonSavedKg: 3.4, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Mon', dayIndex: 1, time: '7:30 AM', timeHour: 7.5, congestionDelayMin: 4, carbonEfficiencyPct: 92, carbonSavedKg: 3.2, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Mon', dayIndex: 1, time: '8:15 AM', timeHour: 8.25, congestionDelayMin: 12, carbonEfficiencyPct: 78, carbonSavedKg: 2.8, peakLevel: 'peak', recommendedRoute: 'Train Express 2' },
  { day: 'Mon', dayIndex: 1, time: '9:00 AM', timeHour: 9, congestionDelayMin: 3, carbonEfficiencyPct: 91, carbonSavedKg: 3.1, peakLevel: 'low', recommendedRoute: 'E-Bike Trail' },
  { day: 'Mon', dayIndex: 1, time: '12:00 PM', timeHour: 12, congestionDelayMin: 2, carbonEfficiencyPct: 94, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Rapid Bus 84X' },
  { day: 'Mon', dayIndex: 1, time: '4:15 PM', timeHour: 16.25, congestionDelayMin: 3, carbonEfficiencyPct: 93, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Mon', dayIndex: 1, time: '5:15 PM', timeHour: 17.25, congestionDelayMin: 13, carbonEfficiencyPct: 75, carbonSavedKg: 2.6, peakLevel: 'peak', recommendedRoute: 'Sound Express' },
  { day: 'Mon', dayIndex: 1, time: '5:45 PM', timeHour: 17.75, congestionDelayMin: 9, carbonEfficiencyPct: 82, carbonSavedKg: 2.9, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Mon', dayIndex: 1, time: '6:45 PM', timeHour: 18.75, congestionDelayMin: 2, carbonEfficiencyPct: 95, carbonSavedKg: 3.4, peakLevel: 'low', recommendedRoute: 'Line 4 Metro' },

  // TUESDAY (Heaviest return peak)
  { day: 'Tue', dayIndex: 2, time: '6:30 AM', timeHour: 6.5, congestionDelayMin: 2, carbonEfficiencyPct: 95, carbonSavedKg: 3.4, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Tue', dayIndex: 2, time: '7:30 AM', timeHour: 7.5, congestionDelayMin: 6, carbonEfficiencyPct: 89, carbonSavedKg: 3.1, peakLevel: 'moderate', recommendedRoute: 'E-Bike Route 9' },
  { day: 'Tue', dayIndex: 2, time: '8:15 AM', timeHour: 8.25, congestionDelayMin: 15, carbonEfficiencyPct: 72, carbonSavedKg: 2.5, peakLevel: 'severe', recommendedRoute: 'Train Express 2' },
  { day: 'Tue', dayIndex: 2, time: '9:00 AM', timeHour: 9, congestionDelayMin: 5, carbonEfficiencyPct: 88, carbonSavedKg: 3.0, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Tue', dayIndex: 2, time: '12:00 PM', timeHour: 12, congestionDelayMin: 3, carbonEfficiencyPct: 93, carbonSavedKg: 3.2, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Tue', dayIndex: 2, time: '4:15 PM', timeHour: 16.25, congestionDelayMin: 4, carbonEfficiencyPct: 92, carbonSavedKg: 3.2, peakLevel: 'low', recommendedRoute: 'E-Bike Trail' },
  { day: 'Tue', dayIndex: 2, time: '5:15 PM', timeHour: 17.25, congestionDelayMin: 16, carbonEfficiencyPct: 69, carbonSavedKg: 2.4, peakLevel: 'severe', recommendedRoute: 'Line 2 Subterranean' },
  { day: 'Tue', dayIndex: 2, time: '5:45 PM', timeHour: 17.75, congestionDelayMin: 11, carbonEfficiencyPct: 79, carbonSavedKg: 2.8, peakLevel: 'peak', recommendedRoute: 'Line 2 Metro' },
  { day: 'Tue', dayIndex: 2, time: '6:45 PM', timeHour: 18.75, congestionDelayMin: 3, carbonEfficiencyPct: 93, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },

  // WEDNESDAY
  { day: 'Wed', dayIndex: 3, time: '6:30 AM', timeHour: 6.5, congestionDelayMin: 1, carbonEfficiencyPct: 97, carbonSavedKg: 3.5, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Wed', dayIndex: 3, time: '7:30 AM', timeHour: 7.5, congestionDelayMin: 5, carbonEfficiencyPct: 91, carbonSavedKg: 3.2, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Wed', dayIndex: 3, time: '8:15 AM', timeHour: 8.25, congestionDelayMin: 14, carbonEfficiencyPct: 74, carbonSavedKg: 2.6, peakLevel: 'severe', recommendedRoute: 'Train Express 2' },
  { day: 'Wed', dayIndex: 3, time: '9:00 AM', timeHour: 9, congestionDelayMin: 4, carbonEfficiencyPct: 90, carbonSavedKg: 3.1, peakLevel: 'low', recommendedRoute: 'E-Bike Route 9' },
  { day: 'Wed', dayIndex: 3, time: '12:00 PM', timeHour: 12, congestionDelayMin: 2, carbonEfficiencyPct: 95, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Rapid Bus 84X' },
  { day: 'Wed', dayIndex: 3, time: '4:15 PM', timeHour: 16.25, congestionDelayMin: 3, carbonEfficiencyPct: 94, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Wed', dayIndex: 3, time: '5:15 PM', timeHour: 17.25, congestionDelayMin: 14, carbonEfficiencyPct: 73, carbonSavedKg: 2.5, peakLevel: 'severe', recommendedRoute: 'Sound Express 2' },
  { day: 'Wed', dayIndex: 3, time: '5:45 PM', timeHour: 17.75, congestionDelayMin: 8, carbonEfficiencyPct: 84, carbonSavedKg: 3.0, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Wed', dayIndex: 3, time: '6:45 PM', timeHour: 18.75, congestionDelayMin: 2, carbonEfficiencyPct: 95, carbonSavedKg: 3.4, peakLevel: 'low', recommendedRoute: 'Line 4 Metro' },

  // THURSDAY
  { day: 'Thu', dayIndex: 4, time: '6:30 AM', timeHour: 6.5, congestionDelayMin: 1, carbonEfficiencyPct: 96, carbonSavedKg: 3.4, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Thu', dayIndex: 4, time: '7:30 AM', timeHour: 7.5, congestionDelayMin: 7, carbonEfficiencyPct: 87, carbonSavedKg: 3.0, peakLevel: 'moderate', recommendedRoute: 'E-Bike Trail' },
  { day: 'Thu', dayIndex: 4, time: '8:15 AM', timeHour: 8.25, congestionDelayMin: 13, carbonEfficiencyPct: 76, carbonSavedKg: 2.7, peakLevel: 'peak', recommendedRoute: 'Train Express 2' },
  { day: 'Thu', dayIndex: 4, time: '9:00 AM', timeHour: 9, congestionDelayMin: 4, carbonEfficiencyPct: 90, carbonSavedKg: 3.1, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Thu', dayIndex: 4, time: '12:00 PM', timeHour: 12, congestionDelayMin: 3, carbonEfficiencyPct: 93, carbonSavedKg: 3.2, peakLevel: 'low', recommendedRoute: 'Rapid Bus 84X' },
  { day: 'Thu', dayIndex: 4, time: '4:15 PM', timeHour: 16.25, congestionDelayMin: 5, carbonEfficiencyPct: 90, carbonSavedKg: 3.1, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Thu', dayIndex: 4, time: '5:15 PM', timeHour: 17.25, congestionDelayMin: 15, carbonEfficiencyPct: 71, carbonSavedKg: 2.5, peakLevel: 'severe', recommendedRoute: 'Line 2 Metro' },
  { day: 'Thu', dayIndex: 4, time: '5:45 PM', timeHour: 17.75, congestionDelayMin: 10, carbonEfficiencyPct: 80, carbonSavedKg: 2.8, peakLevel: 'peak', recommendedRoute: 'Line 4 Metro' },
  { day: 'Thu', dayIndex: 4, time: '6:45 PM', timeHour: 18.75, congestionDelayMin: 2, carbonEfficiencyPct: 94, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },

  // FRIDAY (Earlier evening peak)
  { day: 'Fri', dayIndex: 5, time: '6:30 AM', timeHour: 6.5, congestionDelayMin: 1, carbonEfficiencyPct: 97, carbonSavedKg: 3.5, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Fri', dayIndex: 5, time: '7:30 AM', timeHour: 7.5, congestionDelayMin: 4, carbonEfficiencyPct: 92, carbonSavedKg: 3.2, peakLevel: 'moderate', recommendedRoute: 'E-Bike Trail' },
  { day: 'Fri', dayIndex: 5, time: '8:15 AM', timeHour: 8.25, congestionDelayMin: 10, carbonEfficiencyPct: 81, carbonSavedKg: 2.9, peakLevel: 'peak', recommendedRoute: 'Train Express 2' },
  { day: 'Fri', dayIndex: 5, time: '9:00 AM', timeHour: 9, congestionDelayMin: 2, carbonEfficiencyPct: 94, carbonSavedKg: 3.3, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
  { day: 'Fri', dayIndex: 5, time: '12:00 PM', timeHour: 12, congestionDelayMin: 4, carbonEfficiencyPct: 91, carbonSavedKg: 3.2, peakLevel: 'moderate', recommendedRoute: 'Rapid Bus 84X' },
  { day: 'Fri', dayIndex: 5, time: '3:45 PM', timeHour: 15.75, congestionDelayMin: 6, carbonEfficiencyPct: 89, carbonSavedKg: 3.1, peakLevel: 'moderate', recommendedRoute: 'Line 2 Metro' },
  { day: 'Fri', dayIndex: 5, time: '4:45 PM', timeHour: 16.75, congestionDelayMin: 12, carbonEfficiencyPct: 77, carbonSavedKg: 2.7, peakLevel: 'peak', recommendedRoute: 'Line 2 Metro' },
  { day: 'Fri', dayIndex: 5, time: '5:30 PM', timeHour: 17.5, congestionDelayMin: 9, carbonEfficiencyPct: 83, carbonSavedKg: 2.9, peakLevel: 'moderate', recommendedRoute: 'Line 4 Metro' },
  { day: 'Fri', dayIndex: 5, time: '6:45 PM', timeHour: 18.75, congestionDelayMin: 1, carbonEfficiencyPct: 96, carbonSavedKg: 3.4, peakLevel: 'low', recommendedRoute: 'Line 2 Metro' },
];

export const CommuteHeatmapChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'matrix' | 'curves'>('matrix');
  const [hoveredPoint, setHoveredPoint] = useState<HeatmapDataPoint | null>(null);

  const days = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Color generator based on Congestion vs Carbon Emission Efficiency
  const getCellColor = (delay: number, efficiency: number) => {
    if (delay >= 14 || efficiency <= 72) {
      return '#ff7a73'; // Severe peak / low efficiency (coral pink)
    }
    if (delay >= 10 || efficiency <= 80) {
      return '#ffb3ad'; // Peak / medium-low efficiency
    }
    if (delay >= 5 || efficiency <= 88) {
      return '#fbbf24'; // Moderate congestion (amber)
    }
    if (efficiency >= 93) {
      return '#4edea3'; // Optimal green zone (bright mint)
    }
    return '#10b981'; // High efficiency (emerald)
  };

  // Hourly profile data for ComposedChart (Curves view)
  const hourlyCurveData = useMemo(() => {
    const timeSlots = [
      { label: '6:30 AM', hour: 6.5 },
      { label: '7:30 AM', hour: 7.5 },
      { label: '8:15 AM', hour: 8.25 },
      { label: '9:00 AM', hour: 9 },
      { label: '12:00 PM', hour: 12 },
      { label: '4:15 PM', hour: 16.25 },
      { label: '5:15 PM', hour: 17.25 },
      { label: '5:45 PM', hour: 17.75 },
      { label: '6:45 PM', hour: 18.75 },
    ];

    return timeSlots.map((slot) => {
      let filtered = WEEKLY_HEATMAP_DATA.filter((p) => Math.abs(p.timeHour - slot.hour) < 0.6);
      if (selectedDay !== 'All') {
        filtered = filtered.filter((p) => p.day === selectedDay);
      }

      const avgDelay = filtered.length
        ? Number((filtered.reduce((sum, p) => sum + p.congestionDelayMin, 0) / filtered.length).toFixed(1))
        : 0;

      const avgEfficiency = filtered.length
        ? Number((filtered.reduce((sum, p) => sum + p.carbonEfficiencyPct, 0) / filtered.length).toFixed(1))
        : 85;

      const avgCarbon = filtered.length
        ? Number((filtered.reduce((sum, p) => sum + p.carbonSavedKg, 0) / filtered.length).toFixed(1))
        : 3.0;

      return {
        time: slot.label,
        peakDelayMin: avgDelay,
        carbonEfficiencyPct: avgEfficiency,
        carbonSavedKg: avgCarbon,
        isEcoSweetSpot: avgDelay <= 4 && avgEfficiency >= 92,
      };
    });
  }, [selectedDay]);

  // Scatter chart data formatted for Recharts
  const scatterData = useMemo(() => {
    let dataset = WEEKLY_HEATMAP_DATA;
    if (selectedDay !== 'All') {
      dataset = dataset.filter((d) => d.day === selectedDay);
    }
    return dataset.map((d) => ({
      ...d,
      x: d.timeHour,
      y: d.dayIndex,
      z: d.carbonEfficiencyPct,
    }));
  }, [selectedDay]);

  const dayIndexMap: Record<number, string> = {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
  };

  const timeHourTicks = [6.5, 7.5, 8.25, 9, 12, 16.25, 17.25, 17.75, 18.75];
  const timeHourLabels: Record<number, string> = {
    6.5: '6:30A',
    7.5: '7:30A',
    8.25: '8:15A',
    9: '9:00A',
    12: '12:00P',
    16.25: '4:15P',
    17.25: '5:15P',
    17.75: '5:45P',
    18.75: '6:45P',
  };

  return (
    <section className="rounded-2xl bg-surface-container p-4 shadow-lg border border-outline-variant/30 flex flex-col gap-3.5 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Header and Telemetry Mode Switcher */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
            </div>
            <div>
              <span className="font-headline-sm text-on-surface font-semibold text-sm block">
                Daily Commute Heat Map
              </span>
              <span className="font-label-caps text-[10px] text-on-surface-variant">
                Peak Travel Times vs Carbon Efficiency
              </span>
            </div>
          </div>

          {/* Toggle between Heatmap Matrix and Dual Curves */}
          <div className="flex rounded-lg bg-surface-container-lowest p-0.5 border border-outline-variant/30 text-[10px] font-mono">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-2 py-1 rounded transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Matrix
            </button>
            <button
              onClick={() => setActiveTab('curves')}
              className={`px-2 py-1 rounded transition-colors ${
                activeTab === 'curves'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Curves
            </button>
          </div>
        </div>

        {/* Day Filter Chips */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-1">
          <span className="font-label-caps text-[10px] text-on-surface-variant shrink-0 uppercase">
            Filter:
          </span>
          <div className="flex items-center gap-1">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                  selectedDay === d
                    ? 'bg-surface-container-high text-primary font-bold border border-primary/30'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Heatmap Visualization (Tab 1: Matrix View with Recharts Scatter) */}
      {activeTab === 'matrix' && (
        <div className="flex flex-col gap-2">
          <div className="w-full h-56 bg-surface-container-low rounded-xl p-2 border border-outline-variant/20 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 12, right: 12, bottom: 20, left: -16 }}
              >
                <CartesianGrid
                  stroke="#3c4a42"
                  strokeDasharray="2 4"
                  opacity={0.35}
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[6, 19.5]}
                  ticks={timeHourTicks}
                  tickFormatter={(val) => timeHourLabels[val] || ''}
                  stroke="#86948a"
                  tick={{ fontSize: 9, fill: '#bbcabf', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0.5, 5.5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(val) => dayIndexMap[val] || ''}
                  stroke="#86948a"
                  tick={{ fontSize: 10, fill: '#bbcabf', fontFamily: 'JetBrains Mono', fontWeight: 600 }}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="z" range={[90, 260]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#4edea3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const data = payload[0].payload as HeatmapDataPoint;
                    return (
                      <div className="p-2.5 rounded-xl bg-surface-container-highest/95 backdrop-blur-md border border-primary/40 shadow-2xl text-xs font-mono flex flex-col gap-1 min-w-[170px] z-50">
                        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-1">
                          <span className="font-bold text-on-surface">
                            {data.day} • {data.time}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                              data.peakLevel === 'severe'
                                ? 'bg-error-container text-on-error'
                                : data.peakLevel === 'peak'
                                ? 'bg-tertiary-container/30 text-tertiary-container'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            {data.peakLevel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-0.5">
                          <span className="text-on-surface-variant">Peak Delay:</span>
                          <span className="text-on-surface font-bold">+{data.congestionDelayMin}m</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">Carbon Efficiency:</span>
                          <span className="text-primary font-bold">{data.carbonEfficiencyPct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">CO₂ Avoided:</span>
                          <span className="text-secondary font-bold">+{data.carbonSavedKg} kg</span>
                        </div>
                        <div className="text-[10px] text-secondary-fixed pt-1 border-t border-outline-variant/20 truncate">
                          ★ Rec: {data.recommendedRoute}
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={scatterData}
                  shape={(props: { cx?: number; cy?: number; payload?: HeatmapDataPoint }) => {
                    const { cx = 0, cy = 0, payload } = props;
                    if (!payload) return <circle cx={cx} cy={cy} r={6} fill="#4edea3" />;
                    const color = getCellColor(payload.congestionDelayMin, payload.carbonEfficiencyPct);
                    const isSevere = payload.peakLevel === 'severe';

                    return (
                      <g className="cursor-pointer transition-transform hover:scale-125">
                        <rect
                          x={cx - 10}
                          y={cy - 10}
                          width={20}
                          height={20}
                          rx={5}
                          fill={color}
                          opacity={0.88}
                          stroke={isSevere ? '#ffb4ab' : '#0c1324'}
                          strokeWidth={isSevere ? 1.5 : 1}
                        />
                        {/* Center core pulse dot for high-congestion spots */}
                        {isSevere && (
                          <circle cx={cx} cy={cy} r={2} fill="#690005" />
                        )}
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend for Heatmap */}
          <div className="flex items-center justify-between text-[10px] font-mono px-1">
            <span className="text-on-surface-variant">Efficiency Grade:</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#4edea3]" />
                <span className="text-on-surface">Optimal (92%+)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#fbbf24]" />
                <span className="text-on-surface">Moderate</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#ff7a73]" />
                <span className="text-on-surface">Peak Bottleneck</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alternative View (Tab 2: Recharts Composed Dual Curve) */}
      {activeTab === 'curves' && (
        <div className="flex flex-col gap-2">
          <div className="w-full h-56 bg-surface-container-low rounded-xl p-2 border border-outline-variant/20">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={hourlyCurveData}
                margin={{ top: 10, right: 10, bottom: 20, left: -20 }}
              >
                <defs>
                  <linearGradient id="peakDelayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7a73" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ff7a73" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4edea3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#3c4a42" strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  stroke="#86948a"
                  tick={{ fontSize: 9, fill: '#bbcabf', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                />
                {/* Left Y Axis: Peak Delay Minutes */}
                <YAxis
                  yAxisId="delay"
                  domain={[0, 20]}
                  stroke="#ff7a73"
                  tick={{ fontSize: 9, fill: '#ff7a73', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  label={{
                    value: 'Delay (m)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#ff7a73',
                    fontSize: 8,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                {/* Right Y Axis: Carbon Efficiency % */}
                <YAxis
                  yAxisId="efficiency"
                  orientation="right"
                  domain={[50, 100]}
                  stroke="#4edea3"
                  tick={{ fontSize: 9, fill: '#4edea3', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  label={{
                    value: 'Eco %',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#4edea3',
                    fontSize: 8,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Tooltip
                  content={({ payload, label }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-surface-container-highest/95 backdrop-blur-md border border-primary/40 shadow-xl text-xs font-mono flex flex-col gap-1 min-w-[160px]">
                        <span className="font-bold text-on-surface border-b border-outline-variant/30 pb-1">
                          {selectedDay} • {label}
                        </span>
                        <div className="flex justify-between text-[11px] text-tertiary-container pt-0.5">
                          <span>Peak Delay:</span>
                          <span className="font-bold">+{d.peakDelayMin} min</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-primary">
                          <span>Carbon Efficiency:</span>
                          <span className="font-bold">{d.carbonEfficiencyPct}%</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-secondary">
                          <span>CO₂ Avoided:</span>
                          <span className="font-bold">+{d.carbonSavedKg} kg</span>
                        </div>
                        {d.isEcoSweetSpot && (
                          <span className="text-[10px] text-secondary font-bold bg-secondary/10 px-1.5 py-0.5 rounded mt-1">
                            ✓ ECO SWEET SPOT WINDOW
                          </span>
                        )}
                      </div>
                    );
                  }}
                />
                {/* Shaded Area for Peak Delay */}
                <Area
                  yAxisId="delay"
                  type="monotone"
                  dataKey="peakDelayMin"
                  name="Peak Delay (min)"
                  stroke="#ff7a73"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#peakDelayGradient)"
                />
                {/* Glowing Line for Carbon Efficiency */}
                <Line
                  yAxisId="efficiency"
                  type="monotone"
                  dataKey="carbonEfficiencyPct"
                  name="Carbon Efficiency (%)"
                  stroke="#4edea3"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#4edea3', stroke: '#0c1324' }}
                  activeDot={{ r: 5, fill: '#68fcbf', stroke: '#dce1fb', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono px-1">
            <span className="flex items-center gap-1.5 text-tertiary-container">
              <span className="w-2.5 h-1.5 rounded bg-[#ff7a73]" />
              <span>Peak Congestion Curve (Delay)</span>
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-1.5 rounded bg-[#4edea3]" />
              <span>Carbon Efficiency % (Eco)</span>
            </span>
          </div>
        </div>
      )}

      {/* Sweet Spot Insights Pill Strip */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/20 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col">
          <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
            <span>WORST PEAK BOTTLENECK</span>
            <span className="material-symbols-outlined text-[13px] text-tertiary-container">warning</span>
          </div>
          <span className="text-on-surface font-bold text-xs mt-0.5">
            Tue & Thu 5:15 PM
          </span>
          <span className="text-[10px] text-tertiary-container mt-0.5">
            +16m delay • 69% Eco Efficacy
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col">
          <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
            <span>OPTIMAL GREEN WINDOW</span>
            <span className="material-symbols-outlined text-[13px] text-secondary">eco</span>
          </div>
          <span className="text-on-surface font-bold text-xs mt-0.5">
            Daily 7:15A & 4:30P
          </span>
          <span className="text-[10px] text-secondary mt-0.5">
            +2m delay • 96% Eco Efficacy
          </span>
        </div>
      </div>
    </section>
  );
};
