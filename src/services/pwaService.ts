// src/services/pwaService.ts
// Service Worker Registration & PWA Install Engine for Solid.js.
// Connects to: src/App.tsx, src/services/pwaService.spec.ts
// Created: 2026-07-26

export interface PwaStatus {
  isSupported: boolean;
  isInstalled: boolean;
  isOnline: boolean;
}

export function getPwaStatus(): PwaStatus {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;
  const isInstalled = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
  const isOnline = typeof window !== 'undefined' ? navigator.onLine : true;

  return { isSupported, isInstalled, isOnline };
}

export function registerServiceWorker(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    return navigator.serviceWorker
      .register('/sw.js')
      .then(() => true)
      .catch(() => false);
  }
  return Promise.resolve(false);
}
