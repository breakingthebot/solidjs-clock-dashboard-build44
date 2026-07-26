// src/App.tsx
// Main Solid.js Application Entry Component for Real-time Clock Dashboard.
// Connects to: src/services/clockStore.ts, src/components/ClockCard.tsx, src/components/AddClockModal.tsx
// Created: 2026-07-26

import { Component, createSignal, For, createMemo, Show } from 'solid-js';
import { createLiveClockSignal, getDefaultClocks, ClockCardItem, getFormattedTimeForTimezone } from './services/clockStore';
import { ClockCard } from './components/ClockCard';
import { AddClockModal } from './components/AddClockModal';
import { MeetingSchedulerModal } from './components/MeetingSchedulerModal';
import { TimersWidget } from './components/TimersWidget';
import { TimezoneConverterModal } from './components/TimezoneConverterModal';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { WatchFaceSkin } from './services/themeStore';

export const App: Component = () => {
  // Fine-grained reactive signal ticking every 1000ms
  const now = createLiveClockSignal();

  // Active clock list signal
  const [clocks, setClocks] = createSignal<ClockCardItem[]>(getDefaultClocks());
  const [activeSkin, setActiveSkin] = createSignal<WatchFaceSkin>('cyberpunk');
  const [isAddModalOpen, setIsAddModalOpen] = createSignal(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = createSignal(false);
  const [isConverterOpen, setIsConverterOpen] = createSignal(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = createSignal(false);
  const [isTimersVisible, setIsTimersVisible] = createSignal(true);

  // Master UTC time string computed reactively
  const masterUtcTime = createMemo(() => 
    getFormattedTimeForTimezone(now(), 'UTC', true, true).formattedTime
  );

  const masterLocalTime = createMemo(() => 
    getFormattedTimeForTimezone(now(), Intl.DateTimeFormat().resolvedOptions().timeZone, false, true).formattedTime
  );

  const activeTimezones = createMemo(() => clocks().map(c => c.timezone));

  // Pinned vs Unpinned sorted clock list
  const sortedClocks = createMemo(() => {
    return [...clocks()].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  });

  const handleTogglePin = (id: string) => {
    setClocks(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  };

  const handleToggleFormat = (id: string) => {
    setClocks(prev => prev.map(c => c.id === id ? { ...c, is24Hour: !c.is24Hour } : c));
  };

  const handleDeleteClock = (id: string) => {
    setClocks(prev => prev.filter(c => c.id !== id));
  };

  const handleAddClock = (newClockData: Omit<ClockCardItem, 'id'>) => {
    const newId = 'clk-' + Date.now();
    setClocks(prev => [...prev, { ...newClockData, id: newId }]);
  };

  const handleResetDefaults = () => {
    setClocks(getDefaultClocks());
  };

  return (
    <main class="container">
      {/* Top Header & Dashboard Branding */}
      <header class="app-header card">
        <div class="brand-box">
          <span class="logo-icon">🌐</span>
          <div>
            <h1 class="app-title">Solid.js Timezone Clock Dashboard</h1>
            <p class="subtitle">Fine-grained reactive updates • Zero unnecessary DOM re-renders</p>
          </div>
        </div>

        <div class="header-stats">
          <button 
            type="button" 
            onclick={() => setIsSkinModalOpen(true)} 
            class="btn btn-secondary"
            title="Change watch face aesthetic theme skin"
          >
            🎨 Skins
          </button>
          <button 
            type="button" 
            onclick={() => setIsConverterOpen(true)} 
            class="btn btn-secondary"
            title="Convert past or future timestamps between timezones"
          >
            🔄 Converter
          </button>
          <button 
            type="button" 
            onclick={() => setIsTimersVisible(!isTimersVisible())} 
            class="btn btn-secondary"
          >
            ⏱️ {isTimersVisible() ? 'Hide Timers' : 'Show Timers'}
          </button>
          <button 
            type="button" 
            onclick={() => setIsSchedulerOpen(true)} 
            class="btn btn-secondary"
            title="Calculate overlapping meeting working hours across active timezones"
          >
            📅 Meeting Planner
          </button>
          <div class="stat-pill">
            Active Clocks: <strong>{clocks().length}</strong>
          </div>
          <div class="stat-pill">
            Pinned: <strong>{clocks().filter(c => c.isPinned).length}</strong>
          </div>
          <button 
            type="button" 
            onclick={() => setIsAddModalOpen(true)} 
            class="btn btn-primary"
          >
            ⏰ Add Timezone
          </button>
        </div>
      </header>

      {/* Master Time Sync Bar */}
      <section class="master-bar card">
        <div class="master-time-display">
          <span class="live-dot"></span>
          <span class="master-label">Master Sync Clock (UTC):</span>
          <span class="master-val">{masterUtcTime()}</span>
        </div>

        <div class="master-time-display">
          <span class="master-label">Local System Time:</span>
          <span class="master-val">{masterLocalTime()}</span>
        </div>

        <div class="master-controls">
          <button type="button" onclick={handleResetDefaults} class="btn btn-secondary">
            🔄 Reset Presets
          </button>
        </div>
      </section>

      {/* Timers & Stopwatch Widget */}
      <Show when={isTimersVisible()}>
        <TimersWidget />
      </Show>

      {/* Timezone Clocks Grid */}
      <section class="clocks-grid">
        <For each={sortedClocks()}>
          {(clock) => (
            <ClockCard
              clock={clock}
              currentTime={now()}
              skin={activeSkin()}
              onTogglePin={handleTogglePin}
              onToggleFormat={handleToggleFormat}
              onDelete={handleDeleteClock}
            />
          )}
        </For>
      </section>

      {/* Add Timezone Modal */}
      <AddClockModal
        isOpen={isAddModalOpen()}
        onClose={() => setIsAddModalOpen(false)}
        onAddClock={handleAddClock}
      />

      {/* Multi-Timezone Meeting Scheduler Modal */}
      <MeetingSchedulerModal
        isOpen={isSchedulerOpen()}
        onClose={() => setIsSchedulerOpen(false)}
        timezones={activeTimezones()}
      />

      {/* Timezone Converter & Date Math Modal */}
      <TimezoneConverterModal
        isOpen={isConverterOpen()}
        onClose={() => setIsConverterOpen(false)}
      />

      {/* Watch Face Skin Selector Modal */}
      <SkinSelectorModal
        isOpen={isSkinModalOpen()}
        onClose={() => setIsSkinModalOpen(false)}
        activeSkin={activeSkin()}
        onSelectSkin={setActiveSkin}
      />
    </main>
  );
};

export default App;
