// src/components/WorldMapVisualizer.tsx
// Interactive World Map & Solar Terminator Visualizer Component for Solid.js.
// Connects to: src/App.tsx, src/services/sunCalcService.ts, src/services/clockStore.ts
// Created: 2026-07-26

import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { 
  calculateSubsolarPoint, 
  generateNightOverlaySvgPath, 
  latLngToMapXY, 
  TIMEZONE_COORDINATES 
} from '../services/sunCalcService';
import { ClockCardItem, getFormattedTimeForTimezone } from '../services/clockStore';

interface WorldMapVisualizerProps {
  currentTime: Date;
  clocks: ClockCardItem[];
}

export const WorldMapVisualizer: Component<WorldMapVisualizerProps> = (props) => {
  const [hoveredTz, setHoveredTz] = createSignal<{ name: string; time: string; x: number; y: number } | null>(null);

  const subsolar = createMemo(() => calculateSubsolarPoint(props.currentTime));
  const subsolarXY = createMemo(() => latLngToMapXY(subsolar().lat, subsolar().lng, 800, 400));
  const nightPath = createMemo(() => generateNightOverlaySvgPath(props.currentTime, 800, 400));

  // Map active clocks to lat/lng coordinates
  const mappedClocks = createMemo(() => {
    return props.clocks.map(clk => {
      const coords = TIMEZONE_COORDINATES[clk.timezone] || { lat: 0, lng: 0, label: clk.label };
      const xy = latLngToMapXY(coords.lat, coords.lng, 800, 400);
      const timeInfo = getFormattedTimeForTimezone(props.currentTime, clk.timezone, clk.is24Hour, false);
      return {
        ...clk,
        x: xy.x,
        y: xy.y,
        formattedTime: timeInfo.formattedTime,
        isDaytime: timeInfo.isDaytime
      };
    });
  });

  return (
    <div class="world-map-card card fade-in">
      <div class="world-map-header">
        <div class="map-title-group">
          <h2>🗺️ World Map & Dynamic Solar Terminator</h2>
          <span class="subsolar-badge">
            ☀️ Sun Subsolar Point: {subsolar().lat.toFixed(1)}°N, {subsolar().lng.toFixed(1)}°E
          </span>
        </div>
      </div>

      <div class="map-container">
        <svg viewBox="0 0 800 400" class="world-map-svg">
          {/* Map Grid Lines */}
          <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="4 4" />
          <line x1="400" y1="0" x2="400" y2="400" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="4 4" />

          {/* Simplified Continents Outlines */}
          {/* North America */}
          <path d="M 80 80 Q 140 60 220 90 L 260 160 L 180 220 L 120 180 Z" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" />
          {/* South America */}
          <path d="M 230 230 L 300 250 L 270 360 L 220 300 Z" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" />
          {/* Europe */}
          <path d="M 380 70 L 460 60 L 480 130 L 400 130 Z" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" />
          {/* Africa */}
          <path d="M 380 140 L 480 150 L 490 280 L 420 300 L 370 200 Z" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" />
          {/* Asia */}
          <path d="M 480 60 L 720 70 L 700 200 L 560 220 L 490 130 Z" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" />
          {/* Australia */}
          <path d="M 640 260 L 740 260 L 720 330 L 640 330 Z" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.2)" />

          {/* Dynamic Night Shadow Path Overlay */}
          <path d={nightPath()} fill="rgba(2, 6, 23, 0.65)" />

          {/* Subsolar Sun Marker */}
          <g transform={`translate(${subsolarXY().x}, ${subsolarXY().y})`}>
            <circle r="14" fill="rgba(245, 158, 11, 0.25)" class="sun-pulse" />
            <circle r="7" fill="#f59e0b" />
            <text y="-12" text-anchor="middle" fill="#fef08a" font-size="10" font-weight="700">☀️ Sun</text>
          </g>

          {/* Active Timezone Pins */}
          <For each={mappedClocks()}>
            {(clk) => (
              <g 
                transform={`translate(${clk.x}, ${clk.y})`}
                class="map-pin-group"
                onMouseEnter={() => setHoveredTz({ name: clk.label, time: clk.formattedTime, x: clk.x, y: clk.y })}
                onMouseLeave={() => setHoveredTz(null)}
              >
                <circle r="8" fill={clk.color} opacity="0.4" />
                <circle r="4" fill={clk.color} stroke="#fff" stroke-width="1" />
                <text y="14" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="600">{clk.label.split(' ')[0]}</text>
              </g>
            )}
          </For>
        </svg>

        {/* Hover Tooltip Popup */}
        <Show when={hoveredTz()}>
          <div 
            class="map-tooltip card"
            style={{ 
              left: `${(hoveredTz()!.x / 800) * 100}%`, 
              top: `${(hoveredTz()!.y / 400) * 100}%` 
            }}
          >
            <strong>{hoveredTz()!.name}</strong>
            <span>{hoveredTz()!.time}</span>
          </div>
        </Show>
      </div>
    </div>
  );
};
