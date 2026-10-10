import React, { useState, useEffect } from 'react';
import { VehicleMode } from '../types/commute';

interface TransitMapCardProps {
  mode: VehicleMode;
  isActiveCommute: boolean;
  corridorName: string;
}

export const TransitMapCard: React.FC<TransitMapCardProps> = ({
  mode,
  isActiveCommute,
  corridorName
}) => {
  const [speed, setSpeed] = useState(34);
  const [stationIndex, setStationIndex] = useState(0);
  const [mapLayer, setMapLayer] = useState<'hybrid' | 'radar'>('hybrid');
  const [zoomLevel, setZoomLevel] = useState(1);

  const stations = [
    'Approaching Westlake Station',
    'Passing Capitol Hill Tunnel',
    'Arriving University St Station',
    'En route to Downtown Tech HQ'
  ];

  // Dynamic speed telemetry
  useEffect(() => {
    if (!isActiveCommute) return;
    const interval = setInterval(() => {
      const baseSpeed = mode === 'ebike' ? 24 : mode === 'walk' ? 5 : mode === 'car' ? 42 : 35;
      const variation = Math.floor(Math.random() * 7) - 3;
      setSpeed(Math.max(2, baseSpeed + variation));
    }, 2500);
    return () => clearInterval(interval);
  }, [isActiveCommute, mode]);

  // Dynamic station progression
  useEffect(() => {
    if (!isActiveCommute) return;
    const stationInterval = setInterval(() => {
      setStationIndex((prev) => (prev + 1) % stations.length);
    }, 9000);
    return () => clearInterval(stationInterval);
  }, [isActiveCommute]);

  return (
    <section className="rounded-2xl bg-surface-container overflow-hidden shadow-lg flex flex-col border border-outline-variant/30">
      <div className="relative w-full h-48 bg-surface-container-highest overflow-hidden select-none">
        {/* Map Layer Image / Radar Canvas */}
        <div 
          className={`w-full h-full bg-cover bg-center transition-transform duration-500 ease-out ${
            zoomLevel === 2 ? 'scale-125' : zoomLevel === 0.5 ? 'scale-90' : 'scale-100'
          }`}
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBqH4308NdPu2QLlRpRWOK9HnJceDV2Rjy-peX-cSgWjMEPeWdZgCNfSOw5MBfVHrjYtA_Mc3-ehnMpy9EKodUIyaiJ5J0K4lDptPshC7qrn8XMQiEseJ_ZsmeVu5QkPiqjzdTSaD_Lg1De4DuhzrEGT7lszOp0AUJIATMTWDg0USvSyCaRYtBszMzmN6-IVBP44YNJLZujMjoVcksCgI3ZZ9rhJG1nxXhbieX43YixV9KkOv4-R8XyA')`,
            filter: mapLayer === 'radar' ? 'contrast(130%) hue-rotate(140deg) brightness(0.85)' : 'none'
          }}
        />

        {/* Dynamic Vector Transit Path Overlay (SVG) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 200" 
          preserveAspectRatio="none"
        >
          {/* Glowing route line */}
          <path
            d="M 40 160 Q 140 130, 210 95 T 360 40"
            fill="none"
            stroke="#10b981"
            strokeWidth="5"
            strokeOpacity="0.4"
          />
          <path
            d="M 40 160 Q 140 130, 210 95 T 360 40"
            fill="none"
            stroke="#4edea3"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />

          {/* Station Waypoints */}
          <circle cx="40" cy="160" r="5" fill="#4edea3" stroke="#0c1324" strokeWidth="2" />
          <circle cx="160" cy="120" r="4.5" fill="#68fcbf" stroke="#0c1324" strokeWidth="2" />
          <circle cx="260" cy="75" r="4.5" fill="#68fcbf" stroke="#0c1324" strokeWidth="2" />
          <circle cx="360" cy="40" r="6" fill="#ff7a73" stroke="#0c1324" strokeWidth="2" />

          {/* Real-time moving vehicle beacon */}
          {isActiveCommute && (
            <g className="transition-all duration-1000 ease-in-out" transform={`translate(${140 + stationIndex * 50}, ${130 - stationIndex * 26})`}>
              <circle cx="0" cy="0" r="14" fill="#4edea3" opacity="0.3" className="animate-radar-ring" />
              <circle cx="0" cy="0" r="8" fill="#4edea3" />
              <circle cx="0" cy="0" r="3.5" fill="#003824" />
            </g>
          )}
        </svg>

        {/* Scrim Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/25 to-transparent pointer-events-none" />

        {/* Top Floating Telemetry Pills */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <div className="flex flex-wrap gap-1.5">
            <span className="font-label-caps bg-surface-container-lowest/90 backdrop-blur-md text-primary px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 font-semibold border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              CORRIDOR 4A
            </span>
            <span className="font-label-caps bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-2.5 py-1 rounded-full shadow-md font-metric-md border border-outline-variant/40">
              SPEED: {speed} KM/H
            </span>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg p-0.5 border border-outline-variant/40">
            <button 
              onClick={() => setMapLayer(prev => prev === 'hybrid' ? 'radar' : 'hybrid')}
              title="Toggle Radar/Hybrid"
              className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors text-[16px] flex items-center"
            >
              <span className="material-symbols-outlined text-[17px]">
                {mapLayer === 'radar' ? 'radar' : 'layers'}
              </span>
            </button>
            <button 
              onClick={() => setZoomLevel(prev => prev === 1 ? 2 : prev === 2 ? 0.5 : 1)}
              title="Toggle Zoom"
              className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors text-[16px] flex items-center"
            >
              <span className="material-symbols-outlined text-[17px]">
                {zoomLevel === 2 ? 'zoom_out' : 'zoom_in'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Station / Position Status */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <div className="font-label-sm bg-surface-container-high/90 backdrop-blur-md text-on-surface px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-outline-variant/40 truncate">
            <span className="material-symbols-outlined text-primary text-[15px] shrink-0">pin_drop</span>
            <span className="truncate">{stations[stationIndex]}</span>
          </div>
          <span className="font-label-caps bg-surface-container-lowest/90 backdrop-blur-md text-secondary-fixed px-2 py-1.5 rounded-md shadow-sm border border-secondary/20 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
            LIVE POS OK
          </span>
        </div>
      </div>
    </section>
  );
};
