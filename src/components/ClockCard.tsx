// src/components/ClockCard.tsx
// Fine-grained Reactive Timezone Clock Card Component for Solid.js.
// Connects to: src/App.tsx, src/services/clockStore.ts, src/components/AnalogClock.tsx
// Created: 2026-07-26

import { Component, createMemo } from 'solid-js';
import { ClockCardItem, getFormattedTimeForTimezone } from '../services/clockStore';
import { AnalogClock } from './AnalogClock';

interface ClockCardProps {
  clock: ClockCardItem;
  currentTime: Date;
  onTogglePin: (id: string) => void;
  onToggleFormat: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClockCard: Component<ClockCardProps> = (props) => {
  // Fine-grained reactivity: Only compute time metrics when currentTime updates
  const timeData = createMemo(() => 
    getFormattedTimeForTimezone(props.currentTime, props.clock.timezone, props.clock.is24Hour, props.clock.showSeconds)
  );

  return (
    <div class="clock-card card fade-in" style={{ "border-top-color": props.clock.color }}>
      <div class="clock-card-header">
        <div class="clock-title-group">
          <h3>{props.clock.label}</h3>
          <span class="tz-badge">{props.clock.timezone}</span>
        </div>

        <div class="clock-actions">
          <button 
            type="button" 
            onclick={() => props.onTogglePin(props.clock.id)} 
            class="icon-btn" 
            classList={{ active: props.clock.isPinned }}
            title={props.clock.isPinned ? 'Unpin Clock' : 'Pin to Top'}
          >
            📌
          </button>
          <button 
            type="button" 
            onclick={() => props.onToggleFormat(props.clock.id)} 
            class="icon-btn" 
            title="Toggle 12h / 24h format"
          >
            {props.clock.is24Hour ? '24H' : '12H'}
          </button>
          <button 
            type="button" 
            onclick={() => props.onDelete(props.clock.id)} 
            class="icon-btn danger" 
            title="Remove Clock"
          >
            🗑️
          </button>
        </div>
      </div>

      <div class="clock-card-body">
        {/* Analog Clock Display */}
        <div class="analog-wrapper">
          <AnalogClock 
            hours={timeData().hours} 
            minutes={timeData().minutes} 
            seconds={timeData().seconds} 
            color={props.clock.color} 
            size={110} 
          />
        </div>

        {/* Digital Time & Date */}
        <div class="digital-wrapper">
          <div class="digital-time" style={{ color: props.clock.color }}>
            {timeData().formattedTime}
          </div>
          <div class="digital-date">
            {timeData().formattedDate}
          </div>

          {/* Day / Night Indicator & Offset Badge */}
          <div class="meta-row">
            <span class="day-night-badge" classList={{ daytime: timeData().isDaytime }}>
              {timeData().isDaytime ? '☀️ Day' : '🌙 Night'}
            </span>
            <span class="offset-badge">
              {timeData().offsetHours === 0 
                ? 'Same as local' 
                : `${timeData().offsetHours > 0 ? '+' : ''}${timeData().offsetHours} hrs`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
