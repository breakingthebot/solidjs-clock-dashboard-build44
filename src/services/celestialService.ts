// src/services/celestialService.ts
// Solar & Lunar Celestial Event Calculator Engine for Solid.js.
// Connects to: src/components/CelestialEventsModal.tsx, src/services/celestialService.spec.ts
// Created: 2026-07-26

import { calculateSubsolarPoint } from './sunCalcService';

export interface CelestialTimes {
  sunriseTime: string;
  sunsetTime: string;
  solarNoonTime: string;
  dawnTime: string;
  duskTime: string;
  goldenHourTime: string;
  moonPhaseName: string;
  moonPhaseIcon: string;
  moonIlluminationPct: number;
}

export function calculateCelestialEvents(date: Date, lat: number = 40.7128, lng: number = -74.006): CelestialTimes {
  // Approximate solar times based on solar declination and hour angle
  const subsolar = calculateSubsolarPoint(date);
  
  // Calculate approximate sunrise/sunset offset from solar noon
  // Lat/lng solar noon UTC approximation
  const solarNoonHour = 12 - lng / 15;
  const noonDate = new Date(date);
  noonDate.setUTCHours(Math.floor(solarNoonHour), Math.floor((solarNoonHour % 1) * 60), 0);

  // Approximate day length variation based on latitude and declination
  const radLat = (lat * Math.PI) / 180;
  const radDec = (subsolar.lat * Math.PI) / 180;
  const cosHourAngle = -Math.tan(radLat) * Math.tan(radDec);
  
  // Clamped hour angle (0 to PI)
  const hourAngleRad = Math.acos(Math.max(-1, Math.min(1, cosHourAngle)));
  const dayLengthHours = (hourAngleRad * 2 * 180) / (Math.PI * 15);
  const halfDayMs = (dayLengthHours / 2) * 3600 * 1000;

  const sunriseDate = new Date(noonDate.getTime() - halfDayMs);
  const sunsetDate = new Date(noonDate.getTime() + halfDayMs);
  const dawnDate = new Date(sunriseDate.getTime() - 30 * 60 * 1000);
  const duskDate = new Date(sunsetDate.getTime() + 30 * 60 * 1000);
  const goldenHourDate = new Date(sunsetDate.getTime() - 45 * 60 * 1000);

  const timeFmt = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });
  const moonInfo = getMoonPhase(date);

  return {
    sunriseTime: timeFmt.format(sunriseDate),
    sunsetTime: timeFmt.format(sunsetDate),
    solarNoonTime: timeFmt.format(noonDate),
    dawnTime: timeFmt.format(dawnDate),
    duskTime: timeFmt.format(duskDate),
    goldenHourTime: timeFmt.format(goldenHourDate),
    moonPhaseName: moonInfo.name,
    moonPhaseIcon: moonInfo.icon,
    moonIlluminationPct: moonInfo.illumination
  };
}

export function getMoonPhase(date: Date): { name: string; icon: string; illumination: number } {
  // Synodic month = 29.53058867 days
  const knownNewMoon = new Date('2026-01-18T18:00:00Z').getTime();
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const cycle = (diffDays % 29.53058867 + 29.53058867) % 29.53058867;
  const phaseFraction = cycle / 29.53058867;
  const illumination = Math.round((1 - Math.cos(phaseFraction * 2 * Math.PI)) * 50);

  if (phaseFraction < 0.03 || phaseFraction > 0.97) return { name: 'New Moon', icon: '🌑', illumination };
  if (phaseFraction < 0.22) return { name: 'Waxing Crescent', icon: '🌒', illumination };
  if (phaseFraction < 0.28) return { name: 'First Quarter', icon: '🌓', illumination };
  if (phaseFraction < 0.47) return { name: 'Waxing Gibbous', icon: '🌔', illumination };
  if (phaseFraction < 0.53) return { name: 'Full Moon', icon: '🌕', illumination };
  if (phaseFraction < 0.72) return { name: 'Waning Gibbous', icon: '🌖', illumination };
  if (phaseFraction < 0.78) return { name: 'Last Quarter', icon: '🌗', illumination };
  return { name: 'Waning Crescent', icon: '🌘', illumination };
}
