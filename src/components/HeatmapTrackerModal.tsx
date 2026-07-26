// src/components/HeatmapTrackerModal.tsx
// Global Timezone Heatmap & Activity Tracker Modal Component for Solid.js.
// Connects to: src/App.tsx, src/services/heatmapService.ts
// Created: 2026-07-26

import { Component, createMemo, For, Show } from 'solid-js';
import { calculateTimezoneHeatmap } from '../services/heatmapService';

interface HeatmapTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timezones: string[];
}

export const HeatmapTrackerModal: Component<HeatmapTrackerModalProps> = (props) => {
  const heatmapData = createMemo(() => {
    return calculateTimezoneHeatmap(props.timezones);
  });

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card heatmap-modal-card">
          <div class="modal-header">
            <div>
              <h2>📊 Global Timezone Activity Heatmap</h2>
              <p class="subtitle">24-Hour team working availability matrix & peak overlap window finder</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="heatmap-body">
            {/* Peak Overlap Highlight Banner */}
            <div class="card peak-banner">
              <span class="peak-icon">🌟</span>
              <div>
                <strong>Peak Global Team Overlap Window:</strong>
                <span class="peak-val"> {heatmapData().bestPeakHourUtc}:00 UTC</span>
              </div>
            </div>

            {/* Legend Bar */}
            <div class="heatmap-legend">
              <div class="legend-item">
                <span class="legend-box prime" /> Prime Working (9:00 - 17:00)
              </div>
              <div class="legend-item">
                <span class="legend-box extended" /> Extended (7:00 - 21:00)
              </div>
              <div class="legend-item">
                <span class="legend-box quiet" /> Off-Hours / Sleeping
              </div>
            </div>

            {/* 24-Hour Matrix Grid Table */}
            <div class="heatmap-table-container">
              <table class="heatmap-table">
                <thead>
                  <tr>
                    <th class="tz-col">Timezone</th>
                    <For each={Array.from({ length: 24 }, (_, i) => i)}>
                      {(utcHour) => <th class="hour-col">{utcHour}:00</th>}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={heatmapData().rows}>
                    {(row) => (
                      <tr>
                        <td class="tz-cell" title={row.timezone}>
                          <strong>{row.label}</strong>
                        </td>
                        <For each={row.hours}>
                          {(h) => (
                            <td 
                              class={`heatmap-cell ${h.rating}`} 
                              title={`${row.label}: ${h.localHour}:00 local (${h.utcHour}:00 UTC) - ${h.rating}`}
                            >
                              {h.localHour}
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>

                  {/* Summary Row */}
                  <tr class="summary-row">
                    <td class="tz-cell">
                      <strong>Active Ratio</strong>
                    </td>
                    <For each={heatmapData().summaryCells}>
                      {(summary) => (
                        <td 
                          class={`heatmap-cell summary ${summary.rating}`}
                          title={`${summary.utcHour}:00 UTC: ${summary.activeCount}/${summary.totalTimezones} active`}
                        >
                          {summary.activeCount}
                        </td>
                      )}
                    </For>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="modal-actions">
              <button type="button" onclick={props.onClose} class="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
