// src/services/hotkeyService.spec.ts
// Unit tests for hotkeyService.
// Connects to: src/services/hotkeyService.ts
// Created: 2026-07-26

import { describe, it, expect, vi } from 'vitest';
import { HOTKEY_SHORTCUTS, handleGlobalKeyDown } from './hotkeyService';

describe('hotkeyService', () => {
  it('contains registered keyboard shortcuts', () => {
    expect(HOTKEY_SHORTCUTS.length).toBeGreaterThanOrEqual(8);
    expect(HOTKEY_SHORTCUTS[0].key).toBe('?');
  });

  it('dispatches action on ? key press', () => {
    const mockDispatcher = { toggleHotkeysGuide: vi.fn() };
    const mockEvent = { key: '?', preventDefault: vi.fn(), target: { tagName: 'DIV' } } as any;

    const handled = handleGlobalKeyDown(mockEvent, mockDispatcher);
    expect(handled).toBe(true);
    expect(mockDispatcher.toggleHotkeysGuide).toHaveBeenCalled();
  });

  it('ignores hotkeys inside form inputs', () => {
    const mockDispatcher = { openAddClock: vi.fn() };
    const mockEvent = { key: 'A', shiftKey: true, preventDefault: vi.fn(), target: { tagName: 'INPUT' } } as any;

    const handled = handleGlobalKeyDown(mockEvent, mockDispatcher);
    expect(handled).toBe(false);
    expect(mockDispatcher.openAddClock).not.toHaveBeenCalled();
  });
});
