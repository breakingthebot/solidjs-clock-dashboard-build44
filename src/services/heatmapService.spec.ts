// src/services/heatmapService.spec.ts
// Unit tests for heatmapService.
// Connects to: src/services/heatmapService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { calculateTimezoneHeatmap } from './heatmapService';

describe('heatmapService', () => {
  it('calculates 24-hour heatmap matrix for given timezones', () => {
    const result = calculateTimezoneHeatmap(['UTC', 'America/New_York', 'Asia/Tokyo']);

    expect(result.summaryCells.length).toBe(24);
    expect(result.rows.length).toBe(3);
    expect(typeof result.bestPeakHourUtc).toBe('number');
    expect(result.bestPeakHourUtc).toBeGreaterThanOrEqual(0);
    expect(result.bestPeakHourUtc).toBeLessThan(24);
  });

  it('correctly rates working hours as prime, extended, or quiet', () => {
    const result = calculateTimezoneHeatmap(['UTC']);
    const row = result.rows[0];

    const hour12 = row.hours.find(h => h.localHour === 12);
    expect(hour12?.rating).toBe('prime');

    const hour3 = row.hours.find(h => h.localHour === 3);
    expect(hour3?.rating).toBe('quiet');
  });
});
