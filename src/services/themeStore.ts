// src/services/themeStore.ts
// Custom Themes & Watch Face Skin Engine for Solid.js.
// Connects to: src/components/SkinSelectorModal.tsx, src/components/AnalogClock.tsx, src/services/themeStore.spec.ts
// Created: 2026-07-26

export type WatchFaceSkin = 'cyberpunk' | 'classic' | 'minimalist' | 'matrix' | 'quartz';

export interface SkinConfig {
  id: WatchFaceSkin;
  label: string;
  icon: string;
  description: string;
  bgGrad: string;
  cardBg: string;
  accent: string;
  handHourColor: string;
  handMinColor: string;
  handSecColor: string;
  faceBg: string;
  ticksColor: string;
}

export const WATCH_SKINS: SkinConfig[] = [
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Neon',
    icon: '⚡',
    description: 'Vibrant neon cyan & magenta accents with glowing hands',
    bgGrad: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 100%)',
    cardBg: 'rgba(15, 23, 42, 0.85)',
    accent: '#06b6d4',
    handHourColor: '#f43f5e',
    handMinColor: '#06b6d4',
    handSecColor: '#f59e0b',
    faceBg: 'rgba(15, 23, 42, 0.9)',
    ticksColor: '#38bdf8'
  },
  {
    id: 'classic',
    label: 'Classic Quartz',
    icon: '⌚',
    description: 'Elegant monochrome watch face with silver hands',
    bgGrad: 'radial-gradient(circle at 50% 0%, #1f2937 0%, #111827 100%)',
    cardBg: 'rgba(31, 41, 55, 0.85)',
    accent: '#9ca3af',
    handHourColor: '#f3f4f6',
    handMinColor: '#d1d5db',
    handSecColor: '#ef4444',
    faceBg: 'rgba(17, 24, 39, 0.9)',
    ticksColor: '#9ca3af'
  },
  {
    id: 'minimalist',
    label: 'Minimalist Clean',
    icon: '✨',
    description: 'Sleek frameless design with subtle indicator ticks',
    bgGrad: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%)',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    accent: '#38bdf8',
    handHourColor: '#f8fafc',
    handMinColor: '#94a3b8',
    handSecColor: '#38bdf8',
    faceBg: 'transparent',
    ticksColor: 'rgba(255, 255, 255, 0.2)'
  },
  {
    id: 'matrix',
    label: 'Digital Matrix',
    icon: '🟢',
    description: 'Phosphor terminal green glow with high-contrast dials',
    bgGrad: 'radial-gradient(circle at 50% 0%, #022c22 0%, #020617 100%)',
    cardBg: 'rgba(6, 78, 59, 0.4)',
    accent: '#10b981',
    handHourColor: '#34d399',
    handMinColor: '#10b981',
    handSecColor: '#a7f3d0',
    faceBg: 'rgba(2, 44, 34, 0.8)',
    ticksColor: '#10b981'
  },
  {
    id: 'quartz',
    label: 'Royal Amber',
    icon: '👑',
    description: 'Warm gold & amber quartz tones',
    bgGrad: 'radial-gradient(circle at 50% 0%, #451a03 0%, #0f172a 100%)',
    cardBg: 'rgba(120, 53, 15, 0.3)',
    accent: '#f59e0b',
    handHourColor: '#fbbf24',
    handMinColor: '#f59e0b',
    handSecColor: '#fef08a',
    faceBg: 'rgba(69, 26, 3, 0.7)',
    ticksColor: '#fbbf24'
  }
];

export function getSkinConfig(skinId: WatchFaceSkin): SkinConfig {
  return WATCH_SKINS.find(s => s.id === skinId) || WATCH_SKINS[0];
}
