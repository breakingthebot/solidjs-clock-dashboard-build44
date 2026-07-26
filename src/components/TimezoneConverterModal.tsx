// src/components/TimezoneConverterModal.tsx
// Interactive Timezone Converter & Date Math Modal Component for Solid.js.
// Connects to: src/App.tsx, src/services/timezoneConverterService.ts
// Created: 2026-07-26

import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { convertTimestamp, addDateOffset } from '../services/timezoneConverterService';
import { PRESET_TIMEZONES } from '../services/clockStore';

interface TimezoneConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimezoneConverterModal: Component<TimezoneConverterModalProps> = (props) => {
  const [sourceTz, setSourceTz] = createSignal('UTC');
  const [targetTz, setTargetTz] = createSignal('America/New_York');
  const [inputDateStr, setInputDateStr] = createSignal(new Date().toISOString().slice(0, 16));
  const [addDays, setAddDays] = createSignal(0);
  const [addHours, setAddHours] = createSignal(0);
  const [copySuccess, setCopySuccess] = createSignal(false);

  const calculatedDate = createMemo(() => {
    const base = inputDateStr() ? new Date(inputDateStr()) : new Date();
    return addDateOffset(base, addDays(), addHours(), 0);
  });

  const conversion = createMemo(() => {
    return convertTimestamp(calculatedDate().toISOString(), sourceTz(), targetTz(), false);
  });

  const handleCopyResult = () => {
    const text = `${conversion().sourceFormatted} (${sourceTz()}) ➔ ${conversion().targetFormatted} (${targetTz()})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const swapTimezones = () => {
    const temp = sourceTz();
    setSourceTz(targetTz());
    setTargetTz(temp);
  };

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card converter-modal-card">
          <div class="modal-header">
            <div>
              <h2>🔄 Timezone Converter & Date Math Calculator</h2>
              <p class="subtitle">Instant timestamp conversion across global timezones</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="converter-body">
            {/* Input Date/Time Picker */}
            <div class="form-group">
              <label for="input-datetime" class="form-label">Base Date & Time</label>
              <input
                id="input-datetime"
                type="datetime-local"
                class="form-input"
                value={inputDateStr()}
                onInput={(e) => setInputDateStr(e.currentTarget.value)}
              />
            </div>

            {/* Timezone Selectors Row */}
            <div class="tz-select-row">
              <div class="form-group flex-1">
                <label for="source-tz" class="form-label">Source Timezone</label>
                <select 
                  id="source-tz"
                  class="form-input" 
                  value={sourceTz()} 
                  onChange={(e) => setSourceTz(e.currentTarget.value)}
                >
                  <For each={PRESET_TIMEZONES}>
                    {(preset) => (
                      <option value={preset.timezone}>{preset.flag} {preset.label}</option>
                    )}
                  </For>
                </select>
              </div>

              <button type="button" onclick={swapTimezones} class="btn btn-secondary swap-btn" title="Swap Source & Target">
                ⇄
              </button>

              <div class="form-group flex-1">
                <label for="target-tz" class="form-label">Target Timezone</label>
                <select 
                  id="target-tz"
                  class="form-input" 
                  value={targetTz()} 
                  onChange={(e) => setTargetTz(e.currentTarget.value)}
                >
                  <For each={PRESET_TIMEZONES}>
                    {(preset) => (
                      <option value={preset.timezone}>{preset.flag} {preset.label}</option>
                    )}
                  </For>
                </select>
              </div>
            </div>

            {/* Quick Date Math Adjuster */}
            <div class="date-math-card card">
              <span class="math-label">⚡ Date Arithmetic Adjuster:</span>
              <div class="math-controls">
                <div class="math-pill">
                  <button type="button" onclick={() => setAddDays(d => d - 1)} class="math-btn">-</button>
                  <span>{addDays()} Days</span>
                  <button type="button" onclick={() => setAddDays(d => d + 1)} class="math-btn">+</button>
                </div>
                <div class="math-pill">
                  <button type="button" onclick={() => setAddHours(h => h - 1)} class="math-btn">-</button>
                  <span>{addHours()} Hours</span>
                  <button type="button" onclick={() => setAddHours(h => h + 1)} class="math-btn">+</button>
                </div>
                {(addDays() !== 0 || addHours() !== 0) && (
                  <button type="button" onclick={() => { setAddDays(0); setAddHours(0); }} class="btn btn-secondary btn-sm">
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Conversion Result Display */}
            <div class="conversion-result-card card fade-in">
              <div class="result-source-row">
                <span class="tz-tag">{conversion().sourceTimezone}</span>
                <span class="formatted-val">{conversion().sourceFormatted}</span>
              </div>

              <div class="result-arrow">⬇️</div>

              <div class="result-target-row">
                <span class="tz-tag target">{conversion().targetTimezone}</span>
                <span class="formatted-val highlight">{conversion().targetFormatted}</span>
              </div>

              <div class="result-footer">
                <span class="offset-info">
                  Time Offset: {conversion().hoursOffset >= 0 ? `+${conversion().hoursOffset}` : conversion().hoursOffset} Hours
                </span>
                <button type="button" onclick={handleCopyResult} class="btn btn-primary btn-sm">
                  {copySuccess() ? '✅ Copied!' : '📋 Copy Conversion'}
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
