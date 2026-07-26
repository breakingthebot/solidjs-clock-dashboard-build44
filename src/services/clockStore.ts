// src/services/clockStore.ts
// Fine-grained Reactive Time Store for Solid.js Clock Dashboard.
// Connects to: src/App.tsx, src/components/ClockCard.tsx, src/services/clockStore.spec.ts
// Created: 2026-07-26

import { createSignal, onCleanup } from 'solid-js';

export interface ClockCardItem {
  id: string;
  label: string;
  timezone: string;
  is24Hour: boolean;
  showSeconds: boolean;
  color: string;
  isPinned: boolean;
}

export interface FormattedTimeResult {
  formattedTime: string;
  formattedDate: string;
  hours: number;
  minutes: number;
  seconds: number;
  period: string; // AM/PM
  isDaytime: boolean;
  offsetHours: number;
}

export const PRESET_TIMEZONES: { label: string; timezone: string; flag: string }[] = [
  { label: 'UTC Universal Time', timezone: 'UTC', flag: '🌐' },
  { label: 'New York (EDT/EST)', timezone: 'America/New_York', flag: '🇺🇸' },
  { label: 'London (BST/GMT)', timezone: 'Europe/London', flag: '🇬🇧' },
  { label: 'Paris (CEST/CET)', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { label: 'Dubai (GST)', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { label: 'Tokyo (JST)', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { label: 'Singapore (SGT)', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { label: 'Sydney (AEST/AEDT)', timezone: 'Australia/Sydney', flag: '🇦🇺' }
];

export function getFormattedTimeForTimezone(
  date: Date, 
  timezone: string, 
  is24Hour: boolean = false, 
  showSeconds: boolean = true
): FormattedTimeResult {
  try {
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: !is24Hour
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };

    const formatter = new Intl.DateTimeFormat('en-US', timeOptions);
    const formattedTime = formatter.format(date);
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

    // Extract hours/minutes/seconds in target timezone
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(date);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    for (const part of parts) {
      if (part.type === 'hour') hours = parseInt(part.value, 10);
      if (part.type === 'minute') minutes = parseInt(part.value, 10);
      if (part.type === 'second') seconds = parseInt(part.value, 10);
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const isDaytime = hours >= 6 && hours < 18;

    // Calculate offset relative to local system time in hours
    const localOffsetMinutes = date.getTimezoneOffset();
    const tzDateStr = date.toLocaleString('en-US', { timeZone: timezone });
    const tzDate = new Date(tzDateStr);
    const diffMs = tzDate.getTime() - new Date(date.toLocaleString('en-US')).getTime();
    const offsetHours = Math.round(diffMs / (1000 * 60 * 60));

    return {
      formattedTime,
      formattedDate,
      hours,
      minutes,
      seconds,
      period,
      isDaytime,
      offsetHours
    };
  } catch (e) {
    // Fallback if timezone is invalid
    return {
      formattedTime: date.toLocaleTimeString(),
      formattedDate: date.toLocaleDateString(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      period: date.getHours() >= 12 ? 'PM' : 'AM',
      isDaytime: date.getHours() >= 6 && date.getHours() < 18,
      offsetHours: 0
    };
  }
}

export function createLiveClockSignal() {
  const [now, setNow] = createSignal(new Date());

  const timer = setInterval(() => {
    setNow(new Date());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return now;
}

export function getDefaultClocks(): ClockCardItem[] {
  return [
    { id: 'clk-local', label: 'Local System Time', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, is24Hour: false, showSeconds: true, color: '#06b6d4', isPinned: true },
    { id: 'clk-utc', label: 'UTC Universal Time', timezone: 'UTC', is24Hour: true, showSeconds: true, color: '#10b981', isPinned: true },
    { id: 'clk-ny', label: 'New York (US East)', timezone: 'America/New_York', is24Hour: false, showSeconds: true, color: '#3b82f6', isPinned: false },
    { id: 'clk-tokyo', label: 'Tokyo (Japan)', timezone: 'Asia/Tokyo', is24Hour: false, showSeconds: true, color: '#ec4899', isPinned: false },
    { id: 'clk-london', label: 'London (UK)', timezone: 'Europe/London', is24Hour: false, showSeconds: true, color: '#8b5cf6', isPinned: false }
  ];
}
