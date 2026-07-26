// src/components/TimersWidget.tsx
// Precision Stopwatch & Countdown Timer Component for Solid.js.
// Connects to: src/App.tsx, src/services/timerStore.ts
// Created: 2026-07-26

import { Component, createSignal, onCleanup, For } from 'solid-js';
import { formatElapsedMs, formatCountdownSeconds, COUNTDOWN_PRESETS, LapTimeItem } from '../services/timerStore';

export const TimersWidget: Component = () => {
  const [activeTab, setActiveTab] = createSignal<'stopwatch' | 'countdown'>('stopwatch');

  // --- Stopwatch State ---
  const [swTime, setSwTime] = createSignal(0);
  const [swRunning, setSwRunning] = createSignal(false);
  const [laps, setLaps] = createSignal<LapTimeItem[]>([]);
  let swInterval: any = null;
  let lastLapTotalMs = 0;

  const toggleStopwatch = () => {
    if (swRunning()) {
      clearInterval(swInterval);
      setSwRunning(false);
    } else {
      const startTime = Date.now() - swTime();
      swInterval = setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 30);
      setSwRunning(true);
    }
  };

  const resetStopwatch = () => {
    clearInterval(swInterval);
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
    lastLapTotalMs = 0;
  };

  const recordLap = () => {
    if (swTime() === 0) return;
    const currentTotal = swTime();
    const lapMs = currentTotal - lastLapTotalMs;
    lastLapTotalMs = currentTotal;

    const newLap: LapTimeItem = {
      lapNumber: laps().length + 1,
      lapMs,
      totalMs: currentTotal,
      formattedLap: formatElapsedMs(lapMs),
      formattedTotal: formatElapsedMs(currentTotal)
    };

    setLaps(prev => [newLap, ...prev]);
  };

  // --- Countdown State ---
  const [cdSeconds, setCdSeconds] = createSignal(25 * 60);
  const [cdInitial, setCdInitial] = createSignal(25 * 60);
  const [cdRunning, setCdRunning] = createSignal(false);
  const [cdCompleted, setCdCompleted] = createSignal(false);
  let cdInterval: any = null;

  const toggleCountdown = () => {
    if (cdRunning()) {
      clearInterval(cdInterval);
      setCdRunning(false);
    } else {
      if (cdSeconds() <= 0) return;
      setCdCompleted(false);
      cdInterval = setInterval(() => {
        setCdSeconds(prev => {
          if (prev <= 1) {
            clearInterval(cdInterval);
            setCdRunning(false);
            setCdCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCdRunning(true);
    }
  };

  const resetCountdown = () => {
    clearInterval(cdInterval);
    setCdRunning(false);
    setCdSeconds(cdInitial());
    setCdCompleted(false);
  };

  const selectPreset = (secs: number) => {
    clearInterval(cdInterval);
    setCdRunning(false);
    setCdInitial(secs);
    setCdSeconds(secs);
    setCdCompleted(false);
  };

  onCleanup(() => {
    clearInterval(swInterval);
    clearInterval(cdInterval);
  });

  return (
    <div class="timers-widget-card card fade-in">
      <div class="timers-header">
        <div class="tab-buttons">
          <button 
            type="button" 
            class="tab-btn" 
            classList={{ active: activeTab() === 'stopwatch' }}
            onclick={() => setActiveTab('stopwatch')}
          >
            ⏱️ Precision Stopwatch
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            classList={{ active: activeTab() === 'countdown' }}
            onclick={() => setActiveTab('countdown')}
          >
            ⏳ Countdown Timer
          </button>
        </div>
      </div>

      <div class="timers-body">
        {/* --- Stopwatch View --- */}
        {activeTab() === 'stopwatch' && (
          <div class="timer-tab-content">
            <div class="display-val stopwatch-val">
              {formatElapsedMs(swTime())}
            </div>

            <div class="timer-controls">
              <button 
                type="button" 
                onclick={toggleStopwatch} 
                class="btn" 
                classList={{ "btn-primary": !swRunning(), "btn-secondary": swRunning() }}
              >
                {swRunning() ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button 
                type="button" 
                onclick={recordLap} 
                class="btn btn-secondary" 
                disabled={!swRunning()}
              >
                🏁 Record Lap
              </button>
              <button 
                type="button" 
                onclick={resetStopwatch} 
                class="btn btn-secondary"
              >
                🔄 Reset
              </button>
            </div>

            {/* Laps List */}
            {laps().length > 0 && (
              <div class="laps-table card">
                <div class="laps-head">
                  <span>Lap #</span>
                  <span>Split Time</span>
                  <span>Total Time</span>
                </div>
                <div class="laps-list">
                  <For each={laps()}>
                    {(lap) => (
                      <div class="lap-row">
                        <span class="lap-num">Lap {lap.lapNumber}</span>
                        <span class="lap-split">{lap.formattedLap}</span>
                        <span class="lap-total">{lap.formattedTotal}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Countdown View --- */}
        {activeTab() === 'countdown' && (
          <div class="timer-tab-content">
            <div class="preset-row">
              <For each={COUNTDOWN_PRESETS}>
                {(preset) => (
                  <button
                    type="button"
                    class="preset-pill-btn"
                    classList={{ active: cdInitial() === preset.seconds }}
                    onclick={() => selectPreset(preset.seconds)}
                  >
                    {preset.label}
                  </button>
                )}
              </For>
            </div>

            <div class="display-val countdown-val" classList={{ completed: cdCompleted() }}>
              {cdCompleted() ? '🔔 TIME IS UP!' : formatCountdownSeconds(cdSeconds())}
            </div>

            <div class="timer-controls">
              <button 
                type="button" 
                onclick={toggleCountdown} 
                class="btn" 
                classList={{ "btn-primary": !cdRunning(), "btn-secondary": cdRunning() }}
              >
                {cdRunning() ? '⏸️ Pause' : '▶️ Start Timer'}
              </button>
              <button 
                type="button" 
                onclick={resetCountdown} 
                class="btn btn-secondary"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
