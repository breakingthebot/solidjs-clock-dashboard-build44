// src/components/AddClockModal.tsx
// Add Timezone Clock Modal Component for Solid.js.
// Connects to: src/App.tsx, src/services/clockStore.ts
// Created: 2026-07-26

import { Component, createSignal, For, Show } from 'solid-js';
import { PRESET_TIMEZONES, ClockCardItem } from '../services/clockStore';

interface AddClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClock: (clock: Omit<ClockCardItem, 'id'>) => void;
}

export const AddClockModal: Component<AddClockModalProps> = (props) => {
  const [label, setLabel] = createSignal('');
  const [timezone, setTimezone] = createSignal('UTC');
  const [color, setColor] = createSignal('#06b6d4');
  const [is24Hour, setIs24Hour] = createSignal(false);

  const handleSelectPreset = (preset: { label: string; timezone: string }) => {
    setLabel(preset.label);
    setTimezone(preset.timezone);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!label().trim() || !timezone().trim()) return;

    props.onAddClock({
      label: label().trim(),
      timezone: timezone().trim(),
      is24Hour: is24Hour(),
      showSeconds: true,
      color: color(),
      isPinned: false
    });

    setLabel('');
    props.onClose();
  };

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card">
          <div class="modal-header">
            <h2>⏰ Add Timezone Clock</h2>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <form onSubmit={handleSubmit} class="modal-body">
            <div class="preset-section">
              <label class="form-label">Popular Presets</label>
              <div class="preset-pills">
                <For each={PRESET_TIMEZONES}>
                  {(preset) => (
                    <button
                      type="button"
                      class="preset-pill-btn"
                      classList={{ active: timezone() === preset.timezone }}
                      onclick={() => handleSelectPreset(preset)}
                    >
                      {preset.flag} {preset.label.split(' ')[0]}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div class="form-group">
              <label for="clock-label" class="form-label">Clock Display Name</label>
              <input
                id="clock-label"
                type="text"
                class="form-input"
                placeholder="e.g. Tokyo Office, London Team"
                value={label()}
                onInput={(e) => setLabel(e.currentTarget.value)}
                required
              />
            </div>

            <div class="form-group">
              <label for="clock-tz" class="form-label">Timezone Identifier</label>
              <input
                id="clock-tz"
                type="text"
                class="form-input"
                placeholder="e.g. America/New_York, UTC, Asia/Tokyo"
                value={timezone()}
                onInput={(e) => setTimezone(e.currentTarget.value)}
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Theme Color Accent</label>
              <div class="color-picker-row">
                {['#06b6d4', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map((c) => (
                  <button
                    type="button"
                    class="color-dot"
                    classList={{ active: color() === c }}
                    style={{ background: c }}
                    onclick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div class="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={is24Hour()}
                  onChange={(e) => setIs24Hour(e.currentTarget.checked)}
                />
                Use 24-Hour Format by default
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" onclick={props.onClose} class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">➕ Add Clock</button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
};
