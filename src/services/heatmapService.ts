// src/services/heatmapService.ts
// Global Timezone Heatmap & Activity Tracker Engine for Solid.js.
// Connects to: src/components/HeatmapTrackerModal.tsx, src/services/heatmapService.spec.ts
// Created: 2026-07-26

export type OverlapRating = 'prime' | 'extended' | 'quiet';

export interface HeatmapHourCell {
  utcHour: number;
  activeCount: number;
  totalTimezones: number;
  rating: OverlapRating;
}

export interface TimezoneHeatmapRow {
  timezone: string;
  label: string;
  hours: { utcHour: number; localHour: number; rating: OverlapRating }[];
}

export function calculateTimezoneHeatmap(timezones: string[]): {
  summaryCells: HeatmapHourCell[];
  rows: TimezoneHeatmapRow[];
  bestPeakHourUtc: number;
} {
  const now = new Date();
  const summaryCells: HeatmapHourCell[] = [];
  const rows: TimezoneHeatmapRow[] = [];

  // Compute for each of 24 UTC hours
  const activeCountsPerUtc = new Array(24).fill(0);

  timezones.forEach((tz) => {
    const rowHours: { utcHour: number; localHour: number; rating: OverlapRating }[] = [];

    for (let utcHour = 0; utcHour < 24; utcHour++) {
      const testDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, 0, 0));
      const localHourStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false
      }).format(testDate);
      const localHour = parseInt(localHourStr, 10) % 24;

      let rating: OverlapRating = 'quiet';
      if (localHour >= 9 && localHour < 17) {
        rating = 'prime';
        activeCountsPerUtc[utcHour]++;
      } else if ((localHour >= 7 && localHour < 9) || (localHour >= 17 && localHour < 21)) {
        rating = 'extended';
      }

      rowHours.push({ utcHour, localHour, rating });
    }

    rows.push({
      timezone: tz,
      label: tz.split('/').pop()?.replace(/_/g, ' ') || tz,
      hours: rowHours
    });
  });

  let maxActive = -1;
  let bestPeakHourUtc = 14; // default 14:00 UTC

  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const activeCount = activeCountsPerUtc[utcHour];
    if (activeCount > maxActive) {
      maxActive = activeCount;
      bestPeakHourUtc = utcHour;
    }

    const total = timezones.length || 1;
    const ratio = activeCount / total;
    let rating: OverlapRating = 'quiet';
    if (ratio >= 0.5) rating = 'prime';
    else if (ratio > 0) rating = 'extended';

    summaryCells.push({
      utcHour,
      activeCount,
      totalTimezones: total,
      rating
    });
  }

  return { summaryCells, rows, bestPeakHourUtc };
}
