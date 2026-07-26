// src/services/themeStore.ts
// Custom Themes & Watch Face Skin Engine for Solid.js.
// Connects to: src/components/SkinSelectorModal.tsx, src/components/AnalogClock.tsx, src/components/ClockCard.tsx
// Created: 2026-07-26

export type WatchFaceSkin = 'cyberpunk' | 'classic' | 'minimalist' | 'matrix' | 'quartz';

export interface SkinConfig {
  id: WatchFaceSkin;
  label: string;
  icon: string;
  description: string;
  bgGrad: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  handHourColor: string;
  handMinColor: string;
  handSecColor: string;
  faceBg: string;
  faceBorder: string;
  ticksColor: string;
  digitColor: string;
}

export const WATCH_SKINS: SkinConfig[] = [
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Neon',
    icon: '⚡',
    description: 'Vibrant neon cyan & magenta accents with glowing hands',
    bgGrad: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 100%)',
    cardBg: 'rgba(15, 23, 42, 0.85)',
    cardBorder: '#06b6d4',
    accent: '#06b6d4',
    handHourColor: '#f43f5e',
    handMinColor: '#06b6d4',
    handSecColor: '#fbbf24',
    faceBg: '#0f172a',
    faceBorder: '#06b6d4',
    ticksColor: '#38bdf8',
    digitColor: '#06b6d4'
  },
  {
    id: 'classic',
    label: 'Classic Quartz',
    icon: '⌚',
    description: 'Elegant porcelain white face with polished brass gold rim and black steel hands',
    bgGrad: 'radial-gradient(circle at 50% 0%, #1f2937 0%, #111827 100%)',
    cardBg: 'rgba(30, 41, 59, 0.9)',
    cardBorder: '#d97706',
    accent: '#d97706',
    handHourColor: '#0f172a',
    handMinColor: '#1e293b',
    handSecColor: '#dc2626',
    faceBg: '#f8fafc',
    faceBorder: '#d97706',
    ticksColor: '#0f172a',
    digitColor: '#fbbf24'
  },
  {
    id: 'minimalist',
    label: 'Minimalist Clean',
    icon: '✨',
    description: 'Sleek frameless design with subtle white indicator ticks',
    bgGrad: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%)',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    cardBorder: '#475569',
    accent: '#38bdf8',
    handHourColor: '#ffffff',
    handMinColor: '#cbd5e1',
    handSecColor: '#94a3b8',
    faceBg: 'rgba(255, 255, 255, 0.05)',
    faceBorder: '#e2e8f0',
    ticksColor: '#ffffff',
    digitColor: '#e2e8f0'
  },
  {
    id: 'matrix',
    label: 'Digital Matrix',
    icon: '🟢',
    description: 'Phosphor terminal green glow with high-contrast dials',
    bgGrad: 'radial-gradient(circle at 50% 0%, #022c22 0%, #020617 100%)',
    cardBg: 'rgba(6, 78, 59, 0.5)',
    cardBorder: '#10b981',
    accent: '#10b981',
    handHourColor: '#34d399',
    handMinColor: '#10b981',
    handSecColor: '#6ee7b7',
    faceBg: '#022c22',
    faceBorder: '#10b981',
    ticksColor: '#10b981',
    digitColor: '#10b981'
  },
  {
    id: 'quartz',
    label: 'Royal Amber',
    icon: '👑',
    description: 'Rich warm gold & amber quartz face with golden hands',
    bgGrad: 'radial-gradient(circle at 50% 0%, #451a03 0%, #0f172a 100%)',
    cardBg: 'rgba(120, 53, 15, 0.4)',
    cardBorder: '#f59e0b',
    accent: '#f59e0b',
    handHourColor: '#fef08a',
    handMinColor: '#fbbf24',
    handSecColor: '#ffffff',
    faceBg: '#78350f',
    faceBorder: '#fbbf24',
    ticksColor: '#fef08a',
    digitColor: '#fbbf24'
  }
];

export function getSkinConfig(skinId: WatchFaceSkin): SkinConfig {
  return WATCH_SKINS.find(s => s.id === skinId) || WATCH_SKINS[0];
}
