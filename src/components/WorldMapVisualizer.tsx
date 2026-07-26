// src/components/WorldMapVisualizer.tsx
// High-Precision SVG World Map & Dynamic Solar Terminator Component for Solid.js.
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

      {/* SVG Canvas Container */}
      <div class="map-container">
        <svg viewBox="0 0 800 400" class="world-map-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradients */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#091328" />
              <stop offset="100%" stop-color="#030712" />
            </linearGradient>

            <linearGradient id="nightShadowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(2, 6, 23, 0.75)" />
              <stop offset="100%" stop-color="rgba(2, 6, 23, 0.85)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Ocean Background */}
          <rect width="800" height="400" fill="url(#oceanGrad)" rx="8" />

          {/* Latitude & Longitude Grid Lines */}
          {/* Equator */}
          <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(6, 182, 212, 0.25)" stroke-width="1" stroke-dasharray="4 4" />
          {/* Prime Meridian */}
          <line x1="400" y1="0" x2="400" y2="400" stroke="rgba(6, 182, 212, 0.25)" stroke-width="1" stroke-dasharray="4 4" />
          {/* Tropics */}
          <line x1="0" y1="148" x2="800" y2="148" stroke="rgba(245, 158, 11, 0.15)" stroke-dasharray="2 4" />
          <line x1="0" y1="252" x2="800" y2="252" stroke="rgba(245, 158, 11, 0.15)" stroke-dasharray="2 4" />

          {/* Detailed Vector World Continent Landmasses */}
          {/* North America */}
          <path 
            d="M 40 50 L 140 30 L 220 35 L 275 80 L 250 140 L 220 150 L 195 180 L 180 200 L 165 170 L 120 180 L 110 145 L 80 135 L 45 100 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1.2" 
          />

          {/* South America */}
          <path 
            d="M 230 195 L 275 205 L 325 240 L 290 320 L 260 365 L 245 365 L 235 300 L 220 235 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1.2" 
          />

          {/* Greenland */}
          <path 
            d="M 290 20 L 350 15 L 370 45 L 320 60 L 295 40 Z" 
            fill="rgba(30, 41, 59, 0.7)" 
            stroke="rgba(56, 189, 248, 0.3)" 
            stroke-width="1" 
          />

          {/* Europe */}
          <path 
            d="M 380 115 L 400 75 L 435 55 L 465 65 L 485 100 L 460 125 L 415 125 L 390 125 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1.2" 
          />

          {/* UK & Ireland */}
          <path 
            d="M 385 75 L 395 72 L 398 88 L 388 90 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1" 
          />

          {/* Africa */}
          <path 
            d="M 375 130 L 440 125 L 515 175 L 475 250 L 445 300 L 420 300 L 385 200 L 355 165 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1.2" 
          />

          {/* Asia */}
          <path 
            d="M 485 100 L 530 60 L 680 45 L 775 60 L 760 110 L 705 135 L 650 165 L 620 185 L 575 175 L 565 145 L 510 145 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1.2" 
          />

          {/* Japan */}
          <path 
            d="M 705 110 L 715 105 L 718 125 L 708 128 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1" 
          />

          {/* Australia */}
          <path 
            d="M 645 235 L 725 230 L 740 270 L 720 325 L 655 315 L 635 270 Z" 
            fill="rgba(30, 41, 59, 0.85)" 
            stroke="rgba(56, 189, 248, 0.4)" 
            stroke-width="1.2" 
          />

          {/* Dynamic Solar Terminator Night Shadow Overlay */}
          <path 
            d={nightPath()} 
            fill="url(#nightShadowGrad)" 
            style={{ "mix-blend-mode": "multiply" }}
          />

          {/* Subsolar Sun Marker */}
          <g transform={`translate(${subsolarXY().x}, ${subsolarXY().y})`} filter="url(#glow)">
            <circle r="18" fill="rgba(245, 158, 11, 0.2)" class="sun-pulse" />
            <circle r="8" fill="#f59e0b" stroke="#fef08a" stroke-width="2" />
            <text y="-14" text-anchor="middle" fill="#fef08a" font-size="11" font-weight="800">☀️ Subsolar Sun</text>
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
                <text y="14" text-anchor="middle" fill="#e2e8f0" font-size="10" font-weight="600">
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
