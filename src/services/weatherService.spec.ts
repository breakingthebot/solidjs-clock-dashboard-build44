// src/services/weatherService.spec.ts
// Unit tests for weatherService.
// Connects to: src/services/weatherService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { getWeatherForTimezone } from './weatherService';

describe('weatherService', () => {
  it('returns valid weather data for preset timezones', () => {
    const ny = getWeatherForTimezone('America/New_York');
    expect(ny.tempC).toBe(24);
    expect(ny.tempF).toBe(75);
    expect(ny.conditionIcon).toBe('⛅');
    expect(ny.humidityPct).toBe(58);
  });

  it('generates fallback weather data for unlisted timezones', () => {
    const custom = getWeatherForTimezone('Pacific/Honolulu');
    expect(typeof custom.tempC).toBe('number');
    expect(typeof custom.tempF).toBe('number');
    expect(typeof custom.conditionIcon).toBe('string');
    expect(custom.tempF).toBe(Math.round((custom.tempC * 9) / 5 + 32));
  });
});
