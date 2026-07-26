// src/services/vaultBackupService.spec.ts
// Unit tests for vaultBackupService.
// Connects to: src/services/vaultBackupService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { exportToJson, exportToCsv, parseImportJson, DashboardVaultData } from './vaultBackupService';

describe('vaultBackupService', () => {
  const mockVaultData: DashboardVaultData = {
    version: '0.9.0',
    exportTimestamp: '2026-07-26T15:00:00Z',
    clocks: [
      { id: 'c1', label: 'London', timezone: 'Europe/London', is24Hour: true, showSeconds: true, isPinned: true, color: '#06b6d4' },
      { id: 'c2', label: 'Tokyo', timezone: 'Asia/Tokyo', is24Hour: false, showSeconds: true, isPinned: false, color: '#f43f5e' }
    ],
    activeSkin: 'cyberpunk',
    isHourlyChimeEnabled: true,
    chimeVolume: 0.8
  };

  it('exports vault data to valid JSON string', () => {
    const jsonStr = exportToJson(mockVaultData);
    expect(jsonStr).toContain('London');
    expect(jsonStr).toContain('cyberpunk');
  });

  it('exports clocks list to valid CSV string', () => {
    const csvStr = exportToCsv(mockVaultData.clocks);
    expect(csvStr).toContain('ID,Label,Timezone,Format,Pinned,Color');
    expect(csvStr).toContain('c1,"London",Europe/London,24H,YES,#06b6d4');
  });

  it('parses valid JSON string back into vault structure', () => {
    const jsonStr = exportToJson(mockVaultData);
    const parsed = parseImportJson(jsonStr);

    expect(parsed.clocks.length).toBe(2);
    expect(parsed.clocks[0].label).toBe('London');
    expect(parsed.activeSkin).toBe('cyberpunk');
    expect(parsed.chimeVolume).toBe(0.8);
  });

  it('throws error for invalid JSON string missing clocks array', () => {
    expect(() => parseImportJson('{"invalid": true}')).toThrow('Invalid vault JSON configuration');
  });
});
