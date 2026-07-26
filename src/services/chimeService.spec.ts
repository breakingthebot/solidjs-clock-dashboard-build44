// src/services/chimeService.spec.ts
// Unit tests for chimeService.
// Connects to: src/services/chimeService.ts
// Created: 2026-07-26

import { describe, it, expect, vi } from 'vitest';
import { checkHourlyChimeTrigger, playWebAudioChime } from './chimeService';

describe('chimeService', () => {
  it('correctly detects hourly top-of-hour minute transitions', () => {
    expect(checkHourlyChimeTrigger(59, 0)).toBe(true);
    expect(checkHourlyChimeTrigger(-1, 0)).toBe(true);
    expect(checkHourlyChimeTrigger(14, 15)).toBe(false);
    expect(checkHourlyChimeTrigger(0, 1)).toBe(false);
  });

  it('synthesizes web audio chime without throwing exceptions', () => {
    const mockDestination = {};
    const mockGainNode = {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn()
    };
    const mockOscNode = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };
    const mockCtx = {
      currentTime: 0,
      destination: mockDestination,
      createGain: () => mockGainNode,
      createOscillator: () => mockOscNode
    };

    expect(() => playWebAudioChime('hourly', 0.5, mockCtx)).not.toThrow();
    expect(() => playWebAudioChime('alarm', 0.8, mockCtx)).not.toThrow();
  });
});
