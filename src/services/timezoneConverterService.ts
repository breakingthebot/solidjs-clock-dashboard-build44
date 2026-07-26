// src/services/timezoneConverterService.ts
// Interactive Timezone Converter & Date Math Calculation Engine for Solid.js.
// Connects to: src/components/TimezoneConverterModal.tsx, src/services/timezoneConverterService.spec.ts
// Created: 2026-07-26

export interface ConversionResult {
  sourceTimezone: string;
  targetTimezone: string;
  sourceFormatted: string;
  targetFormatted: string;
  isoTarget: string;
  hoursOffset: number;
}

export function convertTimestamp(
  sourceDateTimeStr: string,
  sourceTz: string,
  targetTz: string,
  is24Hour: boolean = false
): ConversionResult {
  // Parse input datetime string or default to current time
  const parsedDate = sourceDateTimeStr ? new Date(sourceDateTimeStr) : new Date();

  const sourceFormatted = new Intl.DateTimeFormat('en-US', {
    timeZone: sourceTz,
    dateStyle: 'full',
    timeStyle: 'medium',
    hour12: !is24Hour
  }).format(parsedDate);

  const targetFormatted = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTz,
    dateStyle: 'full',
    timeStyle: 'medium',
    hour12: !is24Hour
  }).format(parsedDate);

  // Compute offset difference in hours
  const sourceOffsetMs = getTzOffsetMs(parsedDate, sourceTz);
  const targetOffsetMs = getTzOffsetMs(parsedDate, targetTz);
  const hoursOffset = (targetOffsetMs - sourceOffsetMs) / (1000 * 60 * 60);

  return {
    sourceTimezone: sourceTz,
    targetTimezone: targetTz,
    sourceFormatted,
    targetFormatted,
    isoTarget: parsedDate.toISOString(),
    hoursOffset
  };
}

function getTzOffsetMs(date: Date, timezone: string): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return tzDate.getTime() - utcDate.getTime();
  } catch (e) {
    return 0;
  }
}

export function addDateOffset(
  baseDate: Date,
  days: number = 0,
  hours: number = 0,
  minutes: number = 0
): Date {
  const result = new Date(baseDate.getTime());
  result.setDate(result.getDate() + days);
  result.setHours(result.getHours() + hours);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}
