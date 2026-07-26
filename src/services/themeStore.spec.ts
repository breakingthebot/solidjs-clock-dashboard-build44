// src/services/themeStore.spec.ts
// Unit tests for themeStore.
// Connects to: src/services/themeStore.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { WATCH_SKINS, getSkinConfig } from './themeStore';

describe('themeStore', () => {
  it('contains registered watch face skins', () => {
    expect(WATCH_SKINS.length).toBe(5);
    expect(WATCH_SKINS[0].id).toBe('cyberpunk');
    expect(WATCH_SKINS[1].id).toBe('classic');
  });

  it('retrieves correct skin config by id', () => {
    const matrixSkin = getSkinConfig('matrix');
    expect(matrixSkin.accent).toBe('#10b981');
    expect(matrixSkin.label).toBe('Digital Matrix');
  });

  it('falls back to default skin for unknown id', () => {
    const fallback = getSkinConfig('unknown' as any);
    expect(fallback.id).toBe('cyberpunk');
  });
});
