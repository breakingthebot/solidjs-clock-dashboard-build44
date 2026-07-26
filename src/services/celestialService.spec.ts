// src/services/celestialService.spec.ts
// Unit tests for celestialService.
// Connects to: src/services/celestialService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { calculateCelestialEvents, getMoonPhase } from './celestialService';

describe('celestialService', () => {
  it('calculates solar celestial times for New York location', () => {
    const testDate = new Date('2026-07-26T12:00:00Z');
    const events = calculateCelestialEvents(testDate, 40.7128, -74.006);

    expect(typeof events.sunriseTime).toBe('string');
    expect(typeof events.sunsetTime).toBe('string');
    expect(events.sunriseTime.length).toBeGreaterThan(0);
    expect(events.sunsetTime.length).toBeGreaterThan(0);
    expect(typeof events.moonPhaseName).toBe('string');
  });

  it('calculates moon phase and illumination percentage', () => {
    const moon = getMoonPhase(new Date('2026-07-26T12:00:00Z'));
    expect(typeof moon.name).toBe('string');
    expect(typeof moon.icon).toBe('string');
    expect(moon.illumination).toBeGreaterThanOrEqual(0);
    expect(moon.illumination).toBeLessThanOrEqual(100);
  });
});
