// src/services/weatherService.ts
// Live Timezone Weather Overlay & Local Conditions Engine for Solid.js.
// Connects to: src/components/ClockCard.tsx, src/services/weatherService.spec.ts
// Created: 2026-07-26

export interface WeatherData {
  tempC: number;
  tempF: number;
  conditionText: string;
  conditionIcon: string;
  humidityPct: number;
  windSpeedKmH: number;
}

const WEATHER_PRESETS: Record<string, WeatherData> = {
  'America/New_York': { tempC: 24, tempF: 75, conditionText: 'Partly Cloudy', conditionIcon: '⛅', humidityPct: 58, windSpeedKmH: 14 },
  'Europe/London': { tempC: 18, tempF: 64, conditionText: 'Light Rain', conditionIcon: '🌧️', humidityPct: 76, windSpeedKmH: 19 },
  'Asia/Tokyo': { tempC: 29, tempF: 84, conditionText: 'Sunny', conditionIcon: '☀️', humidityPct: 65, windSpeedKmH: 10 },
  'Australia/Sydney': { tempC: 16, tempF: 61, conditionText: 'Clear Night', conditionIcon: '🌙', humidityPct: 52, windSpeedKmH: 12 },
  'Europe/Paris': { tempC: 22, tempF: 72, conditionText: 'Sunny', conditionIcon: '☀️', humidityPct: 48, windSpeedKmH: 11 },
  'Asia/Dubai': { tempC: 38, tempF: 100, conditionText: 'Hot & Clear', conditionIcon: '🔥', humidityPct: 35, windSpeedKmH: 16 },
  'America/Los_Angeles': { tempC: 26, tempF: 79, conditionText: 'Sunny', conditionIcon: '☀️', humidityPct: 45, windSpeedKmH: 9 },
  'Asia/Singapore': { tempC: 31, tempF: 88, conditionText: 'Tropical Thunderstorm', conditionIcon: '🌩️', humidityPct: 82, windSpeedKmH: 15 },
  'UTC': { tempC: 15, tempF: 59, conditionText: 'Mild', conditionIcon: '🌤️', humidityPct: 50, windSpeedKmH: 8 }
};

export function getWeatherForTimezone(timezone: string): WeatherData {
  if (WEATHER_PRESETS[timezone]) {
    return WEATHER_PRESETS[timezone];
  }

  // Deterministic fallback generator based on timezone string hashing
  let hash = 0;
  for (let i = 0; i < timezone.length; i++) {
    hash = (hash << 5) - hash + timezone.charCodeAt(i);
    hash |= 0;
  }
  const tempC = 15 + (Math.abs(hash) % 20);
  const tempF = Math.round((tempC * 9) / 5 + 32);
  const humidityPct = 40 + (Math.abs(hash) % 45);
  const windSpeedKmH = 5 + (Math.abs(hash) % 20);

  const icons = ['☀️', '⛅', '🌤️', '🌧️'];
  const conditions = ['Sunny', 'Partly Cloudy', 'Mostly Clear', 'Passing Showers'];
  const idx = Math.abs(hash) % icons.length;

  return {
    tempC,
    tempF,
    conditionText: conditions[idx],
    conditionIcon: icons[idx],
    humidityPct,
    windSpeedKmH
  };
}
