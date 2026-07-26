// src/services/timezoneConverterService.spec.ts
// Unit tests for timezoneConverterService.
// Connects to: src/services/timezoneConverterService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { convertTimestamp, addDateOffset } from './timezoneConverterService';

describe('timezoneConverterService', () => {
  it('converts timestamp between UTC and America/New_York accurately', () => {
    const result = convertTimestamp('2026-07-26T12:00:00Z', 'UTC', 'America/New_York');

    expect(result.sourceTimezone).toBe('UTC');
    expect(result.targetTimezone).toBe('America/New_York');
    expect(result.targetFormatted).toContain('2026');
    expect(result.targetFormatted).toContain('8:00'); // UTC-4 in summer EDT
  });

  it('performs date math addition correctly', () => {
    const base = new Date('2026-07-26T12:00:00Z');
    const future = addDateOffset(base, 2, 5, 30); // +2 days, 5 hours, 30 mins

    expect(future.getUTCDate()).toBe(28);
    expect(future.getUTCHours()).toBe(17);
    expect(future.getUTCMinutes()).toBe(30);
  });
});
