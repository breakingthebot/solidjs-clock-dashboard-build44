// src/services/timerStore.ts
// Precision Countdown Timer & Multi-Lap Stopwatch Engine for Solid.js.
// Connects to: src/components/TimersWidget.tsx, src/services/timerStore.spec.ts
// Created: 2026-07-26

export interface LapTimeItem {
  lapNumber: number;
  lapMs: number;
  totalMs: number;
  formattedLap: string;
  formattedTotal: string;
}

export function formatElapsedMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`;
}

export function formatCountdownSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export const COUNTDOWN_PRESETS = [
  { label: '🍅 Pomodoro (25m)', seconds: 25 * 60 },
  { label: '☕ Short Break (5m)', seconds: 5 * 60 },
  { label: '🧘 Long Break (15m)', seconds: 15 * 60 },
  { label: '⚡ Standup (10m)', seconds: 10 * 60 }
];
