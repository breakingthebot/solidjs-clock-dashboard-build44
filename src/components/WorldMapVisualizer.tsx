// src/components/WorldMapVisualizer.tsx
// High-Resolution World Map & Dynamic Solar Terminator Component for Solid.js.
// Connects to: src/App.tsx, src/services/sunCalcService.ts, src/services/clockStore.ts
// Created: 2026-07-26

import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { 
  calculateSubsolarPoint, 
  generateNightOverlaySvgPath, 
  latLngToMapXY, 
  KNOWN_CITIES 
} from '../services/sunCalcService';
import { ClockCardItem, getFormattedTimeForTimezone } from '../services/clockStore';

interface WorldMapVisualizerProps {
  currentTime: Date;
  clocks: ClockCardItem[];
}

export const WorldMapVisualizer: Component<WorldMapVisualizerProps> = (props) => {
  const [hoveredCity, setHoveredCity] = createSignal<{ name: string; time: string; status: string; x: number; y: number } | null>(null);

  const subsolar = createMemo(() => calculateSubsolarPoint(props.currentTime));
  const subsolarXY = createMemo(() => latLngToMapXY(subsolar().lat, subsolar().lng, 800, 400));
  const nightPath = createMemo(() => generateNightOverlaySvgPath(props.currentTime, 800, 400));

  // Map registered city markers with current local times
  const activeCityPins = createMemo(() => {
    return KNOWN_CITIES.map(city => {
      const xy = latLngToMapXY(city.lat, city.lng, 800, 400);
      const activeClock = props.clocks.find(c => c.timezone === city.timezone);
      const is24 = activeClock ? activeClock.is24Hour : false;
      const timeInfo = getFormattedTimeForTimezone(props.currentTime, city.timezone, is24, false);

      return {
        ...city,
        x: xy.x,
        y: xy.y,
        formattedTime: timeInfo.formattedTime,
        isDaytime: timeInfo.isDaytime,
        color: activeClock ? activeClock.color : '#06b6d4'
      };
    });
  });

  return (
    <div class="world-map-card card fade-in">
      {/* Visualizer Title Bar */}
      <div class="world-map-header">
        <div class="map-title-group">
          <h2>🗺️ Live World Map & Day/Night Solar Terminator</h2>
          <span class="subsolar-badge">
            ☀️ Sun Position: {Math.abs(subsolar().lat).toFixed(1)}°{subsolar().lat >= 0 ? 'N' : 'S'}, {Math.abs(subsolar().lng).toFixed(1)}°{subsolar().lng >= 0 ? 'E' : 'W'}
          </span>
        </div>
        <div class="map-legend">
          <span class="legend-item"><span class="legend-dot day"></span> Daytime</span>
          <span class="legend-item"><span class="legend-dot night"></span> Nighttime</span>
        </div>
      </div>

      {/* SVG Canvas Container with Real High-Res Map Background */}
      <div class="map-container">
        <svg viewBox="0 0 800 400" class="world-map-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="nightShadowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(2, 6, 23, 0.72)" />
              <stop offset="100%" stop-color="rgba(2, 6, 23, 0.82)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Real High-Resolution Dark Mode World Map Image */}
          <image 
            href="/world_map_dark.jpg" 
            x="0" 
            y="0" 
            width="800" 
            height="400" 
            preserveAspectRatio="none" 
            opacity="0.9"
          />

          {/* Grid Overlay Lines */}
          <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(6, 182, 212, 0.2)" stroke-width="1" stroke-dasharray="4 4" />
          <line x1="400" y1="0" x2="400" y2="400" stroke="rgba(6, 182, 212, 0.2)" stroke-width="1" stroke-dasharray="4 4" />

          {/* Dynamic Solar Terminator Night Shadow Overlay */}
          <path 
            d={nightPath()} 
            fill="url(#nightShadowGrad)" 
          />

          {/* Subsolar Sun Marker */}
          <g transform={`translate(${subsolarXY().x}, ${subsolarXY().y})`} filter="url(#glow)">
            <circle r="16" fill="rgba(245, 158, 11, 0.25)" class="sun-pulse" />
            <circle r="7" fill="#f59e0b" stroke="#fef08a" stroke-width="2" />
            <text y="-12" text-anchor="middle" fill="#fef08a" font-size="10" font-weight="800">☀️ Sun</text>
          </g>

          {/* City Pin Markers */}
          <For each={activeCityPins()}>
            {(city) => (
              <g 
                transform={`translate(${city.x}, ${city.y})`}
                class="map-pin-group"
                onMouseEnter={() => setHoveredCity({ 
                  name: city.name, 
                  time: city.formattedTime, 
                  status: city.isDaytime ? '☀️ Daytime' : '🌙 Nighttime',
                  x: city.x, 
                  y: city.y 
                })}
                onMouseLeave={() => setHoveredCity(null)}
              >
                <circle r="9" fill={city.color} opacity="0.3" class="pin-pulse" />
                <circle r="4" fill={city.isDaytime ? '#f59e0b' : '#38bdf8'} stroke="#ffffff" stroke-width="1.5" />
                <text y="14" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="700">
                  {city.name.split(' ')[0]}
                </text>
              </g>
            )}
          </For>
        </svg>

        {/* Hover Tooltip Popup */}
        <Show when={hoveredCity()}>
          <div 
            class="map-tooltip card fade-in"
            style={{ 
              left: `${(hoveredCity()!.x / 800) * 100}%`, 
              top: `${(hoveredCity()!.y / 400) * 100}%` 
            }}
          >
            <div class="tooltip-head">
              <strong>{hoveredCity()!.name}</strong>
              <span class="status-tag">{hoveredCity()!.status}</span>
            </div>
            <span class="tooltip-time">{hoveredCity()!.time}</span>
          </div>
        </Show>
      </div>
    </div>
  );
};
