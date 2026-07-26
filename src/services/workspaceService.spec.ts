// src/services/workspaceService.spec.ts
// Unit tests for workspaceService.
// Connects to: src/services/workspaceService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { DEFAULT_WORKSPACES, filterClocksByWorkspace } from './workspaceService';
import { getDefaultClocks } from './clockStore';

describe('workspaceService', () => {
  it('provides default workspace tabs', () => {
    expect(DEFAULT_WORKSPACES.length).toBe(4);
    expect(DEFAULT_WORKSPACES[0].id).toBe('all');
  });

  it('filters clock list by active workspace category', () => {
    const clocks = getDefaultClocks();
    const apacClocks = filterClocksByWorkspace(clocks, 'apac');
    expect(apacClocks.length).toBeGreaterThan(0);
    expect(apacClocks.some(c => c.timezone.includes('Tokyo') || c.timezone.includes('Sydney'))).toBe(true);
  });
});
