// src/services/sunCalcService.spec.ts
// Unit tests for sunCalcService.
// Connects to: src/services/sunCalcService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { calculateSubsolarPoint, latLngToMapXY, generateNightOverlaySvgPath, KNOWN_CITIES } from './sunCalcService';

describe('sunCalcService', () => {
  it('converts Lat/Lng to map canvas XY coordinates accurately', () => {
    const origin = latLngToMapXY(0, 0, 800, 400);
    expect(origin.x).toBe(400);
    expect(origin.y).toBe(200);

    const topLeft = latLngToMapXY(90, -180, 800, 400);
    expect(topLeft.x).toBe(0);
    expect(topLeft.y).toBe(0);

    const bottomRight = latLngToMapXY(-90, 180, 800, 400);
    expect(bottomRight.x).toBe(800);
    expect(bottomRight.y).toBe(400);
  });

  it('calculates subsolar declination and longitude within valid solar range', () => {
    const date = new Date('2026-07-26T12:00:00Z');
    const subsolar = calculateSubsolarPoint(date);

    expect(subsolar.lat).toBeGreaterThan(15);
    expect(subsolar.lat).toBeLessThan(25);
    expect(subsolar.lng).toBeGreaterThanOrEqual(-180);
    expect(subsolar.lng).toBeLessThanOrEqual(180);
  });

  it('generates closed valid SVG polygon path for night overlay', () => {
    const date = new Date('2026-07-26T18:00:00Z');
    const path = generateNightOverlaySvgPath(date, 800, 400);

    expect(path).toContain('M 0');
    expect(path).toContain('Z');
  });

  it('contains registered cities list', () => {
    expect(KNOWN_CITIES.length).toBeGreaterThan(5);
    expect(KNOWN_CITIES.find(c => c.timezone === 'America/New_York')).toBeDefined();
  });
});
