// src/components/CelestialEventsModal.tsx
// Solar & Lunar Phase Celestial Event Calculator Modal for Solid.js.
// Connects to: src/App.tsx, src/services/celestialService.ts
// Created: 2026-07-26

import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { calculateCelestialEvents } from '../services/celestialService';

interface CelestialEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CITY_PRESETS = [
  { label: '🗽 New York', lat: 40.7128, lng: -74.006 },
  { label: '🇬🇧 London', lat: 51.5074, lng: -0.1278 },
  { label: '🇯🇵 Tokyo', lat: 35.6762, lng: 139.6503 },
  { label: '🇦🇺 Sydney', lat: -33.8688, lng: 151.2093 },
  { label: '🇫🇷 Paris', lat: 48.8566, lng: 2.3522 },
  { label: '🇦🇪 Dubai', lat: 25.2048, lng: 55.2708 }
];

export const CelestialEventsModal: Component<CelestialEventsModalProps> = (props) => {
  const [selectedCityIdx, setSelectedCityIdx] = createSignal(0);
  const [customLat, setCustomLat] = createSignal(40.7128);
  const [customLng, setCustomLng] = createSignal(-74.006);

  const activeLat = () => customLat();
  const activeLng = () => customLng();

  const celestialData = createMemo(() => {
    return calculateCelestialEvents(new Date(), activeLat(), activeLng());
  });

  const selectCityPreset = (idx: number) => {
    setSelectedCityIdx(idx);
    setCustomLat(CITY_PRESETS[idx].lat);
    setCustomLng(CITY_PRESETS[idx].lng);
  };

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card celestial-modal-card">
          <div class="modal-header">
            <div>
              <h2>☀️ Solar & Lunar Celestial Calculator</h2>
              <p class="subtitle">Sunrise, sunset, golden hour & moon phase illumination tracking</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="celestial-body">
            {/* Location City Presets */}
            <div class="form-group">
              <label class="form-label">Select Major City Location</label>
              <div class="preset-btn-group">
                <For each={CITY_PRESETS}>
                  {(preset, idx) => (
                    <button
                      type="button"
                      class="btn btn-secondary btn-sm"
                      classList={{ active: selectedCityIdx() === idx() }}
                      onclick={() => selectCityPreset(idx())}
                    >
                      {preset.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Solar Timeline Display Grid */}
            <div class="solar-grid">
              <div class="solar-card card">
                <span class="solar-icon">🌅</span>
                <div class="solar-info">
                  <span class="solar-title">Dawn / Twilight</span>
                  <span class="solar-val">{celestialData().dawnTime}</span>
                </div>
              </div>

              <div class="solar-card card highlight">
                <span class="solar-icon">☀️</span>
                <div class="solar-info">
                  <span class="solar-title">Sunrise</span>
                  <span class="solar-val">{celestialData().sunriseTime}</span>
                </div>
              </div>

              <div class="solar-card card">
                <span class="solar-icon">🕛</span>
                <div class="solar-info">
                  <span class="solar-title">Solar Noon</span>
                  <span class="solar-val">{celestialData().solarNoonTime}</span>
                </div>
              </div>

              <div class="solar-card card highlight">
                <span class="solar-icon">🌇</span>
                <div class="solar-info">
                  <span class="solar-title">Sunset</span>
                  <span class="solar-val">{celestialData().sunsetTime}</span>
                </div>
              </div>

              <div class="solar-card card">
                <span class="solar-icon">🏙️</span>
                <div class="solar-info">
                  <span class="solar-title">Golden Hour</span>
                  <span class="solar-val">{celestialData().goldenHourTime}</span>
                </div>
              </div>

              <div class="solar-card card">
                <span class="solar-icon">🌆</span>
                <div class="solar-info">
                  <span class="solar-title">Dusk</span>
                  <span class="solar-val">{celestialData().duskTime}</span>
                </div>
              </div>
            </div>

            {/* Lunar Phase Card */}
            <div class="lunar-card card">
              <span class="lunar-icon">{celestialData().moonPhaseIcon}</span>
              <div class="lunar-info">
                <h4>Moon Phase: <strong>{celestialData().moonPhaseName}</strong></h4>
                <p class="lunar-subtext">Illumination Level: <strong>{celestialData().moonIlluminationPct}%</strong></p>
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
