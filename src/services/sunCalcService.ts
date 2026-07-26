// src/services/sunCalcService.ts
// Precision Solar Terminator & World Map Geographic Engine for Solid.js.
// Connects to: src/components/WorldMapVisualizer.tsx, src/services/sunCalcService.spec.ts
// Created: 2026-07-26

export interface SubsolarPoint {
  lat: number;
  lng: number;
}

export interface MapCoordinates {
  x: number;
  y: number;
}

export interface CityMarker {
  id: string;
  name: string;
  timezone: string;
  lat: number;
  lng: number;
}

export const KNOWN_CITIES: CityMarker[] = [
  { id: 'utc', name: 'Greenwich (UTC)', timezone: 'UTC', lat: 51.4769, lng: 0.0005 },
  { id: 'nyc', name: 'New York', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060 },
  { id: 'london', name: 'London', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
  { id: 'paris', name: 'Paris', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522 },
  { id: 'dubai', name: 'Dubai', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
  { id: 'tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 'singapore', name: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'sydney', name: 'Sydney', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
  { id: 'la', name: 'Los Angeles', timezone: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437 },
  { id: 'chicago', name: 'Chicago', timezone: 'America/Chicago', lat: 41.8781, lng: -87.6298 },
  { id: 'hongkong', name: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.3193, lng: 114.1694 }
];

/**
 * Convert Lat (-90..90) and Lng (-180..180) to canvas XY coordinates (width x height)
 */
export function latLngToMapXY(lat: number, lng: number, width: number = 800, height: number = 400): MapCoordinates {
  const x = Math.max(0, Math.min(width, ((lng + 180) / 360) * width));
  const y = Math.max(0, Math.min(height, ((90 - lat) / 180) * height));
  return { x, y };
}

/**
 * Calculate the exact Subsolar point (latitude and longitude where the Sun is directly overhead at current UTC time).
 */
export function calculateSubsolarPoint(date: Date): SubsolarPoint {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Solar declination approximation in degrees (-23.44..23.44)
  const declination = -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));

  // Subsolar longitude in degrees (-180..180) based on UTC time
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lng = 180 - (utcHours / 24) * 360;
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;

  return { lat: declination, lng };
}

/**
 * Calculates smooth SVG path string for the night-side shadow region across the map canvas.
 */
export function generateNightOverlaySvgPath(date: Date, width: number = 800, height: number = 400): string {
  const subsolar = calculateSubsolarPoint(date);
  const subLatRad = (subsolar.lat * Math.PI) / 180;
  const subLngRad = (subsolar.lng * Math.PI) / 180;

  // Generate curve points for solar terminator boundary (where solar zenith angle = 90 deg)
  const points: { x: number; y: number }[] = [];
  const step = 2; // Every 2 degrees of longitude

  for (let lng = -180; lng <= 180; lng += step) {
    const lngRad = (lng * Math.PI) / 180;
    const deltaLng = lngRad - subLngRad;

    // tan(termLat) = -cos(deltaLng) / tan(subLat)
    const tanSubLat = Math.tan(subLatRad) || 0.0001;
    const tanTermLat = -Math.cos(deltaLng) / tanSubLat;
    let termLat = (Math.atan(tanTermLat) * 180) / Math.PI;

    // Clamp
    if (termLat > 89) termLat = 89;
    if (termLat < -89) termLat = -89;

    const coords = latLngToMapXY(termLat, lng, width, height);
    points.push(coords);
  }

  if (points.length === 0) return '';

  // Determine whether north pole or south pole is in night
  const isNorthPoleInNight = subsolar.lat < 0; // In northern winter, North pole is dark
  const poleY = isNorthPoleInNight ? 0 : height;

  let path = `M 0 ${poleY} `;
  path += `L ${points[0].x} ${points[0].y} `;

  for (let i = 1; i < points.length; i++) {
    path += `L ${points[i].x} ${points[i].y} `;
  }

  path += `L ${width} ${poleY} Z`;
  return path;
}
