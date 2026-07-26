// src/services/vaultBackupService.ts
// JSON & CSV Timezone Configuration Vault Backup Engine for Solid.js.
// Connects to: src/components/VaultBackupModal.tsx, src/services/vaultBackupService.spec.ts
// Created: 2026-07-26

import { ClockCardItem } from './clockStore';
import { WatchFaceSkin } from './themeStore';

export interface DashboardVaultData {
  version: string;
  exportTimestamp: string;
  clocks: ClockCardItem[];
  activeSkin: WatchFaceSkin;
  isHourlyChimeEnabled: boolean;
  chimeVolume: number;
}

export function exportToJson(data: DashboardVaultData): string {
  return JSON.stringify(data, null, 2);
}

export function exportToCsv(clocks: ClockCardItem[]): string {
  const headers = ['ID', 'Label', 'Timezone', 'Format', 'Pinned', 'Color'];
  const rows = clocks.map(c => [
    c.id,
    `"${c.label.replace(/"/g, '""')}"`,
    c.timezone,
    c.is24Hour ? '24H' : '12H',
    c.isPinned ? 'YES' : 'NO',
    c.color
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function parseImportJson(jsonStr: string): DashboardVaultData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || !Array.isArray(parsed.clocks)) {
    throw new Error('Invalid vault JSON configuration: Missing clocks array.');
  }

  // Validate clocks array items
  const clocks: ClockCardItem[] = parsed.clocks.map((item: any, idx: number) => ({
    id: item.id || `imported-${Date.now()}-${idx}`,
    label: item.label || 'Imported Timezone',
    timezone: item.timezone || 'UTC',
    is24Hour: Boolean(item.is24Hour),
    showSeconds: true,
    isPinned: Boolean(item.isPinned),
    color: item.color || '#06b6d4'
  }));

  return {
    version: parsed.version || '0.9.0',
    exportTimestamp: parsed.exportTimestamp || new Date().toISOString(),
    clocks,
    activeSkin: (parsed.activeSkin as WatchFaceSkin) || 'cyberpunk',
    isHourlyChimeEnabled: parsed.isHourlyChimeEnabled !== false,
    chimeVolume: typeof parsed.chimeVolume === 'number' ? parsed.chimeVolume : 0.5
  };
}
