// src/components/ChimeSettingsModal.tsx
// Audio Chime & Hourly Bell Notification Settings Modal for Solid.js.
// Connects to: src/App.tsx, src/services/chimeService.ts
// Created: 2026-07-26

import { Component, Show } from 'solid-js';
import { playWebAudioChime } from '../services/chimeService';

interface ChimeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const ChimeSettingsModal: Component<ChimeSettingsModalProps> = (props) => {
  const handleTestHourly = () => {
    playWebAudioChime('hourly', props.volume);
  };

  const handleTestAlarm = () => {
    playWebAudioChime('alarm', props.volume);
  };

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card chime-modal-card">
          <div class="modal-header">
            <div>
              <h2>🔔 Audio Chime & Hourly Bell Settings</h2>
              <p class="subtitle">Auditory top-of-the-hour bell chimes & timezone alerts</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="chime-body">
            {/* Hourly Bell Toggle */}
            <div class="form-checkbox card chime-toggle-card">
              <label>
                <input
                  type="checkbox"
                  checked={props.isEnabled}
                  onChange={props.onToggleEnabled}
                />
                <div>
                  <strong>Enable Top-of-Hour Bell Chime</strong>
                  <p class="checkbox-subtext">Plays a two-tone crystal glass chime every hour on :00</p>
                </div>
              </label>
            </div>

            {/* Volume Control */}
            <div class="form-group">
              <label for="chime-volume" class="form-label">
                Chime Volume: {Math.round(props.volume * 100)}%
              </label>
              <input
                id="chime-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="form-range"
                value={props.volume}
                onInput={(e) => props.onVolumeChange(parseFloat(e.currentTarget.value))}
              />
            </div>

            {/* Test Audio Synthesizer Buttons */}
            <div class="test-buttons-card card">
              <span class="test-label">🔊 Synthesizer Preview Test:</span>
              <div class="test-btn-row">
                <button type="button" onclick={handleTestHourly} class="btn btn-secondary">
                  🔔 Test Hourly Chime
                </button>
                <button type="button" onclick={handleTestAlarm} class="btn btn-secondary">
                  🚨 Test Alarm Ring
                </button>
              </div>
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
