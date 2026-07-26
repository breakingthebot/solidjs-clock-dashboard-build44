// src/services/pwaService.spec.ts
// Unit tests for pwaService.
// Connects to: src/services/pwaService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { getPwaStatus, registerServiceWorker } from './pwaService';

describe('pwaService', () => {
  it('returns valid PWA status object', () => {
    const status = getPwaStatus();
    expect(typeof status.isSupported).toBe('boolean');
    expect(typeof status.isInstalled).toBe('boolean');
    expect(typeof status.isOnline).toBe('boolean');
  });

  it('handles service worker registration check without throwing', async () => {
    const registered = await registerServiceWorker();
    expect(typeof registered).toBe('boolean');
  });
});
