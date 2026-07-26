// src/services/sunCalcService.ts
// Subsolar Point & Solar Terminator Path Calculator for World Map Visualizer.
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

export const TIMEZONE_COORDINATES: Record<string, { lat: number; lng: number; label: string }> = {
  'UTC': { lat: 51.4769, lng: 0.0005, label: 'UTC (Greenwich)' },
  'America/New_York': { lat: 40.7128, lng: -74.006, label: 'New York' },
  'Europe/London': { lat: 51.5074, lng: -0.1278, label: 'London' },
  'Europe/Paris': { lat: 48.8566, lng: 2.3522, label: 'Paris' },
  'Asia/Dubai': { lat: 25.2048, lng: 55.2708, label: 'Dubai' },
  'Asia/Tokyo': { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  'Asia/Singapore': { lat: 1.3521, lng: 103.8198, label: 'Singapore' },
  'Australia/Sydney': { lat: -33.8688, lng: 151.2093, label: 'Sydney' }
};

/**
 * Convert Lat/Lng (-90..90, -180..180) to SVG canvas coordinates (0..800, 0..400)
 */
export function latLngToMapXY(lat: number, lng: number, width: number = 800, height: number = 400): MapCoordinates {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

/**
 * Compute the subsolar point (latitude and longitude where sun is directly overhead) for a date.
 */
export function calculateSubsolarPoint(date: Date): SubsolarPoint {
  // Day of year calculation
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Solar declination approximation (latitude of sun in degrees)
  const declination = -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));

  // Subsolar longitude in degrees (-180..180)
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lng = 180 - (utcHours / 24) * 360;
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;

  return { lat: declination, lng };
}

/**
 * Generate an SVG path string for the night region overlay.
 */
export function generateNightOverlaySvgPath(date: Date, width: number = 800, height: number = 400): string {
  const subsolar = calculateSubsolarPoint(date);
  const subsolarRadLat = (subsolar.lat * Math.PI) / 180;
  const subsolarRadLng = (subsolar.lng * Math.PI) / 180;

  const pathPoints: { x: number; y: number }[] = [];

  // Sample longitudes from -180 to 180 degrees
  for (let lng = -180; lng <= 180; lng += 4) {
    const radLng = (lng * Math.PI) / 180;
    const deltaLng = radLng - subsolarRadLng;

    // Calculate solar zenith distance angle: cos(90°) = 0 at night boundary
    // tan(lat) * tan(subsolarLat) = -cos(deltaLng)
    const tanVal = -Math.cos(deltaLng) / Math.tan(subsolarRadLat || 0.001);
    let termLat = (Math.atan(tanVal) * 180) / Math.PI;

    // Clamp boundary
    if (isNaN(termLat)) termLat = subsolar.lat > 0 ? -90 : 90;

    const coords = latLngToMapXY(termLat, lng, width, height);
    pathPoints.push(coords);
  }

  // Construct closed SVG polygon covering the night half
  if (pathPoints.length === 0) return '';

  let path = `M 0 ${height} `;
  path += `L ${pathPoints[0].x} ${pathPoints[0].y} `;

  for (let i = 1; i < pathPoints.length; i++) {
    path += `L ${pathPoints[i].x} ${pathPoints[i].y} `;
  }

  path += `L ${width} ${height} Z`;
  return path;
}
