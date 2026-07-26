// src/services/sunCalcService.spec.ts
// Unit tests for sunCalcService.
// Connects to: src/services/sunCalcService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { calculateSubsolarPoint, latLngToMapXY, generateNightOverlaySvgPath, TIMEZONE_COORDINATES } from './sunCalcService';

describe('sunCalcService', () => {
  it('converts lat/lng coordinates to map canvas XY', () => {
    const origin = latLngToMapXY(0, 0, 800, 400);
    expect(origin.x).toBe(400);
    expect(origin.y).toBe(200);

    const topLeft = latLngToMapXY(90, -180, 800, 400);
    expect(topLeft.x).toBe(0);
    expect(topLeft.y).toBe(0);
  });

  it('calculates valid subsolar point for UTC date', () => {
    const testDate = new Date('2026-07-26T12:00:00Z');
    const subsolar = calculateSubsolarPoint(testDate);

    expect(subsolar.lat).toBeGreaterThan(15); // Summer in northern hemisphere
    expect(subsolar.lat).toBeLessThan(25);
    expect(subsolar.lng).toBeGreaterThanOrEqual(-180);
    expect(subsolar.lng).toBeLessThanOrEqual(180);
  });

  it('generates valid non-empty SVG path string for night overlay', () => {
    const testDate = new Date('2026-07-26T18:30:00Z');
    const path = generateNightOverlaySvgPath(testDate, 800, 400);

    expect(path).toContain('M 0 400');
    expect(path).toContain('L 800 400 Z');
  });

  it('contains expected timezone map coordinates', () => {
    expect(TIMEZONE_COORDINATES['America/New_York']).toBeDefined();
    expect(TIMEZONE_COORDINATES['Asia/Tokyo'].lat).toBe(35.6762);
  });
});
