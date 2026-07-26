// src/services/workspaceService.ts
// Timezone Grouping & Multi-Tab Workspace Vault Engine for Solid.js.
// Connects to: src/App.tsx, src/services/workspaceService.spec.ts
// Created: 2026-07-26

import { ClockCardItem } from './clockStore';

export interface WorkspaceTab {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
}

export const DEFAULT_WORKSPACES: WorkspaceTab[] = [
  { id: 'all', label: 'All Clocks', icon: '🌐', keywords: [] },
  { id: 'americas', label: 'Americas', icon: '🌎', keywords: ['america', 'new_york', 'chicago', 'los_angeles', 'toronto', 'sao_paulo'] },
  { id: 'emea', label: 'EMEA', icon: '🌍', keywords: ['utc', 'london', 'paris', 'berlin', 'dubai', 'europe', 'africa'] },
  { id: 'apac', label: 'APAC', icon: '🌏', keywords: ['tokyo', 'singapore', 'sydney', 'hong_kong', 'asia', 'australia'] }
];

export function filterClocksByWorkspace(clocks: ClockCardItem[], workspaceId: string): ClockCardItem[] {
  if (workspaceId === 'all') return clocks;

  const workspace = DEFAULT_WORKSPACES.find(w => w.id === workspaceId);
  if (!workspace || workspace.keywords.length === 0) return clocks;

  return clocks.filter(clock => {
    const tzLower = clock.timezone.toLowerCase();
    const labelLower = clock.label.toLowerCase();
    return workspace.keywords.some(kw => tzLower.includes(kw) || labelLower.includes(kw));
  });
}
