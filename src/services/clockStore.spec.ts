// src/services/clockStore.spec.ts
// Unit tests for clockStore.
// Connects to: src/services/clockStore.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { getFormattedTimeForTimezone, getDefaultClocks, PRESET_TIMEZONES } from './clockStore';

describe('clockStore', () => {
  it('returns default initial clock cards list', () => {
    const clocks = getDefaultClocks();
    expect(clocks.length).toBe(5);
    expect(clocks[0].id).toBe('clk-local');
    expect(clocks[1].timezone).toBe('UTC');
  });

  it('contains expected preset timezones', () => {
    expect(PRESET_TIMEZONES.length).toBeGreaterThan(5);
    const tzNames = PRESET_TIMEZONES.map(t => t.timezone);
    expect(tzNames).toContain('UTC');
    expect(tzNames).toContain('America/New_York');
    expect(tzNames).toContain('Asia/Tokyo');
  });

  it('formats time correctly for UTC timezone', () => {
    const testDate = new Date('2026-07-26T12:30:45Z');
    const result = getFormattedTimeForTimezone(testDate, 'UTC', true, true);

    expect(result.hours).toBe(12);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
    expect(result.isDaytime).toBe(true);
    expect(result.period).toBe('PM');
  });

  it('correctly identifies daytime vs nighttime based on hours', () => {
    const dayDate = new Date('2026-07-26T14:00:00Z');
    const nightDate = new Date('2026-07-26T02:00:00Z');

    expect(getFormattedTimeForTimezone(dayDate, 'UTC').isDaytime).toBe(true);
    expect(getFormattedTimeForTimezone(nightDate, 'UTC').isDaytime).toBe(false);
  });
});
