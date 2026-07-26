// src/services/timerStore.spec.ts
// Unit tests for timerStore.
// Connects to: src/services/timerStore.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { formatElapsedMs, formatCountdownSeconds, COUNTDOWN_PRESETS } from './timerStore';

describe('timerStore', () => {
  it('formats milliseconds into mm:ss.ms string', () => {
    expect(formatElapsedMs(1250)).toBe('00:01.25');
    expect(formatElapsedMs(65430)).toBe('01:05.43');
    expect(formatElapsedMs(0)).toBe('00:00.00');
  });

  it('formats seconds into countdown hh:mm:ss or mm:ss string', () => {
    expect(formatCountdownSeconds(1500)).toBe('25:00'); // 25 minutes
    expect(formatCountdownSeconds(3665)).toBe('01:01:05'); // 1h 1m 5s
    expect(formatCountdownSeconds(0)).toBe('00:00');
  });

  it('contains expected countdown presets', () => {
    expect(COUNTDOWN_PRESETS.length).toBe(4);
    expect(COUNTDOWN_PRESETS[0].seconds).toBe(1500); // 25m Pomodoro
  });
});
