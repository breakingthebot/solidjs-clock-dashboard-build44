// src/components/AnalogClock.tsx
// Analog Clock Component with smooth SVG hands & custom skins for Solid.js.
// Connects to: src/components/ClockCard.tsx, src/services/themeStore.ts
// Created: 2026-07-26

import { Component, createMemo } from 'solid-js';
import { getSkinConfig, WatchFaceSkin } from '../services/themeStore';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  color?: string;
  size?: number;
  skin?: WatchFaceSkin;
}

export const AnalogClock: Component<AnalogClockProps> = (props) => {
  const size = () => props.size || 120;
  const radius = () => size() / 2;
  const skin = createMemo(() => getSkinConfig(props.skin || 'cyberpunk'));
  const color = () => props.color || skin().accent;

  const secondAngle = () => (props.seconds / 60) * 360;
  const minuteAngle = () => ((props.minutes + props.seconds / 60) / 60) * 360;
  const hourAngle = () => (((props.hours % 12) + props.minutes / 60) / 12) * 360;

  return (
    <div class="analog-clock-container" style={{ width: `${size()}px`, height: `${size()}px` }}>
      <svg width={size()} height={size()} viewBox={`0 0 ${size()} ${size()}`}>
        {/* Clock Face Circle */}
        <circle 
          cx={radius()} 
          cy={radius()} 
          r={radius() - 4} 
          fill={skin().faceBg} 
          stroke={color()} 
          stroke-width="2" 
        />

        {/* Hour Ticks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            x1={radius() + (radius() - 12) * Math.sin((angle * Math.PI) / 180)}
            y1={radius() - (radius() - 12) * Math.cos((angle * Math.PI) / 180)}
            x2={radius() + (radius() - 6) * Math.sin((angle * Math.PI) / 180)}
            y2={radius() - (radius() - 6) * Math.cos((angle * Math.PI) / 180)}
            stroke={skin().ticksColor}
            stroke-width={angle % 90 === 0 ? "2.5" : "1.5"}
          />
        ))}

        {/* Hour Hand */}
        <line
          x1={radius()}
          y1={radius()}
          x2={radius() + (radius() - 32) * Math.sin((hourAngle() * Math.PI) / 180)}
          y2={radius() - (radius() - 32) * Math.cos((hourAngle() * Math.PI) / 180)}
          stroke={skin().handHourColor}
          stroke-width="3.5"
          stroke-linecap="round"
        />

        {/* Minute Hand */}
        <line
          x1={radius()}
          y1={radius()}
          x2={radius() + (radius() - 20) * Math.sin((minuteAngle() * Math.PI) / 180)}
          y2={radius() - (radius() - 20) * Math.cos((minuteAngle() * Math.PI) / 180)}
          stroke={skin().handMinColor}
          stroke-width="2.5"
          stroke-linecap="round"
        />

        {/* Second Hand */}
        <line
          x1={radius()}
          y1={radius()}
          x2={radius() + (radius() - 12) * Math.sin((secondAngle() * Math.PI) / 180)}
          y2={radius() - (radius() - 12) * Math.cos((secondAngle() * Math.PI) / 180)}
          stroke={skin().handSecColor}
          stroke-width="1.5"
          stroke-linecap="round"
        />

        {/* Center Pivot Dot */}
        <circle cx={radius()} cy={radius()} r="4" fill={color()} />
      </svg>
    </div>
  );
};
