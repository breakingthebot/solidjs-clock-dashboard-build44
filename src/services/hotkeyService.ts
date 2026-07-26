// src/services/hotkeyService.ts
// Keyboard Hotkeys & Power-User Navigation Engine for Solid.js.
// Connects to: src/App.tsx, src/components/HotkeysGuideModal.tsx, src/services/hotkeyService.spec.ts
// Created: 2026-07-26

export interface HotkeyShortcut {
  key: string;
  displayKey: string;
  description: string;
  actionName: string;
}

export const HOTKEY_SHORTCUTS: HotkeyShortcut[] = [
  { key: '?', displayKey: '?', description: 'Toggle Keyboard Shortcuts Guide', actionName: 'toggleHotkeysGuide' },
  { key: 'A', displayKey: 'Shift + A', description: 'Open Add Timezone Modal', actionName: 'openAddClock' },
  { key: 'S', displayKey: 'Shift + S', description: 'Open Watch Face Skins Selector', actionName: 'openSkins' },
  { key: 'P', displayKey: 'Shift + P', description: 'Open Meeting Planner Modal', actionName: 'openScheduler' },
  { key: 'C', displayKey: 'Shift + C', description: 'Open Timezone Converter Modal', actionName: 'openConverter' },
  { key: 'B', displayKey: 'Shift + B', description: 'Open Vault Backup Modal', actionName: 'openVault' },
  { key: 'H', displayKey: 'Shift + H', description: 'Open Global Activity Heatmap', actionName: 'openHeatmap' },
  { key: 'L', displayKey: 'Shift + L', description: 'Open Celestial Events Calculator', actionName: 'openCelestial' },
  { key: 'T', displayKey: 'Shift + T', description: 'Toggle Timers & Stopwatch Widget', actionName: 'toggleTimers' },
  { key: 'Escape', displayKey: 'Esc', description: 'Close Active Modal', actionName: 'closeActiveModal' }
];

export function handleGlobalKeyDown(
  e: KeyboardEvent,
  dispatchers: Record<string, () => void>
): boolean {
  // Ignore hotkeys when typing in input, select, or textarea
  const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
  if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
    return false;
  }

  if (e.key === '?') {
    e.preventDefault();
    dispatchers.toggleHotkeysGuide?.();
    return true;
  }

  if (e.key === 'Escape') {
    dispatchers.closeActiveModal?.();
    return true;
  }

  if (e.shiftKey) {
    const uppercaseKey = e.key.toUpperCase();
    const shortcut = HOTKEY_SHORTCUTS.find(s => s.key === uppercaseKey);
    if (shortcut && dispatchers[shortcut.actionName]) {
      e.preventDefault();
      dispatchers[shortcut.actionName]();
      return true;
    }
  }

  return false;
}
