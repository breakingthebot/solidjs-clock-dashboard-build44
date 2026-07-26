# Changelog - Build 44 (Solid.js Real-Time Clock Dashboard)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-07-26

### Added
- Integrated **Live Timezone Weather Overlay & Local Conditions Engine** in `src/services/weatherService.ts`, `src/components/ClockCard.tsx`, and `src/App.tsx`.
- Added weather telemetry evaluator (`getWeatherForTimezone`) providing temperature, condition icons (☀️, ⛅, 🌧️, 🌙, 🌩️, 🔥), condition description, and humidity %.
- Added weather pill badge on all timezone clock cards.
- Added `🌡️ °C / °F` temperature unit toggle button in header navigation bar.
- Added unit test suite in `src/services/weatherService.spec.ts`.

## [1.2.0] - 2026-07-26

### Added
- Integrated **Keyboard Hotkeys & Fast Navigation Engine** in `src/services/hotkeyService.ts`, `src/components/HotkeysGuideModal.tsx`, and `src/App.tsx`.
- Added global keyboard listener (`handleGlobalKeyDown`) supporting `?` (Guide), `Shift+A` (Add Clock), `Shift+S` (Skins), `Shift+P` (Planner), `Shift+C` (Converter), `Shift+B` (Vault Backup), `Shift+H` (Heatmap), `Shift+L` (Celestial), `Shift+T` (Timers Toggle), and `Esc` (Close Modal).
- Added `⌨️ Hotkeys (?)` top header action button.
- Added unit test suite in `src/services/hotkeyService.spec.ts`.

## [1.1.0] - 2026-07-26

### Added
- Integrated **Global Timezone Heatmap & Activity Tracker** in `src/services/heatmapService.ts`, `src/components/HeatmapTrackerModal.tsx`, and `src/App.tsx`.
- Added 24-hour UTC activity matrix calculator (`calculateTimezoneHeatmap`) evaluating team working availability (Prime `9-17`, Extended `7-21`, Quiet Off-Hours).
- Added Peak Overlap Summary Banner identifying optimal global team sync window.
- Added `📊 Activity Heatmap` top header action button.
- Added unit test suite in `src/services/heatmapService.spec.ts`.

## [1.0.0] - 2026-07-26

### Added
- Integrated **Solar & Lunar Phase Celestial Event Calculator** in `src/services/celestialService.ts`, `src/components/CelestialEventsModal.tsx`, and `src/App.tsx`.
- Added solar event calculator (`calculateCelestialEvents`) evaluating sunrise, sunset, solar noon, dawn, dusk, and golden hour.
- Added lunar phase calculator (`getMoonPhase`) returning synodic phase name, moon icon, and illumination percentage.
- Added `☀️ Celestial` top header action button.
- Added city location presets (New York, London, Tokyo, Sydney, Paris, Dubai).
- Added unit test suite in `src/services/celestialService.spec.ts`.

## [0.9.0] - 2026-07-26

### Added
- Integrated **CSV/JSON Timezone Configuration Vault Backup Engine** in `src/services/vaultBackupService.ts`, `src/components/VaultBackupModal.tsx`, and `src/App.tsx`.
- Added JSON vault exporter (`exportToJson`) saving full dashboard configuration (clocks, skin, audio settings, volume).
- Added CSV clock exporter (`exportToCsv`) formatting clock list to spreadsheet format.
- Added JSON vault import validator (`parseImportJson`) supporting file upload and text paste.
- Added `💾 Backup Vault` top header action button.
- Added unit test suite in `src/services/vaultBackupService.spec.ts`.

## [0.8.0] - 2026-07-26

### Added
- Integrated **Audio Chime & Hourly Bell Notification Engine** in `src/services/chimeService.ts`, `src/components/ChimeSettingsModal.tsx`, and `src/App.tsx`.
- Added Web Audio API synthesizer (`playWebAudioChime`) for crystal glass hourly chimes and tri-tone alarm rings.
- Added top-of-the-hour minute transition detection (`checkHourlyChimeTrigger`).
- Added `🔔 Sound On / Muted` top header action button.
- Added `ChimeSettingsModal` with volume slider control and audio preview test buttons.
- Added unit test suite in `src/services/chimeService.spec.ts`.

## [0.7.0] - 2026-07-26

### Added
- Integrated **PWA Offline Support & Desktop Widget Mode** in `public/manifest.json`, `public/sw.js`, `src/services/pwaService.ts`, `index.html`, and `src/App.tsx`.
- Added Web App Manifest for standalone desktop and mobile installation.
- Added Service Worker script (`sw.js`) with Cache-First offline asset strategy.
- Added `beforeinstallprompt` event listener and `📱 Install App` top header action button.
- Added unit test suite in `src/services/pwaService.spec.ts`.

## [0.6.0] - 2026-07-26

### Added
- Integrated **Custom Themes & Watch Face Skin Selector** in `src/services/themeStore.ts`, `src/components/SkinSelectorModal.tsx`, `src/components/AnalogClock.tsx`, `src/components/ClockCard.tsx`, and `src/App.tsx`.
- Added 5 watch face theme skins: Cyberpunk Neon, Classic Quartz, Minimalist Clean, Digital Matrix, and Royal Amber.
- Added dynamic skin styling to analog hands, face background, tick marks, and glowing accents.
- Added `🎨 Skins` top header action button.
- Added unit test suite in `src/services/themeStore.spec.ts`.

## [0.5.0] - 2026-07-26

### Added
- Integrated **Timezone Converter & Date Math Calculator** in `src/services/timezoneConverterService.ts`, `src/components/TimezoneConverterModal.tsx`, and `src/App.tsx`.
- Added timestamp conversion engine (`convertTimestamp`) with timezone offset calculation.
- Added date arithmetic helper (`addDateOffset`) for +/- days and hours adjustments.
- Added interactive modal dialog with source/target timezone dropdowns, swap button, and 1-click clipboard copy button.
- Added `🔄 Converter` top header action button.
- Added unit test suite in `src/services/timezoneConverterService.spec.ts`.

## [0.4.0] - 2026-07-26

### Added
- Integrated **Countdown Timers & Multi-Lap Stopwatch Engine** in `src/services/timerStore.ts`, `src/components/TimersWidget.tsx`, and `src/App.tsx`.
- Added precision stopwatch millisecond formatter (`formatElapsedMs`) and multi-lap split time recorder.
- Added countdown timer duration formatter (`formatCountdownSeconds`), completion alarm state, and preset selectors (Pomodoro 25m, Short Break 5m, Long Break 15m, Standup 10m).
- Added `⏱️ Hide Timers / Show Timers` top header toggle button.
- Added unit test suite in `src/services/timerStore.spec.ts`.

## [0.3.0] - 2026-07-26

### Added
- Integrated **Alarm & Timezone Meeting Scheduler Calculator** in `src/services/meetingSchedulerService.ts`, `src/components/MeetingSchedulerModal.tsx`, and `src/App.tsx`.
- Added 24-hour UTC overlap timeline matrix calculation (`calculateTimezoneOverlaps`).
- Added participant status indicators (working, extended, sleeping) per timezone slot.
- Added 1-click meeting invite text generator (`formatMeetingInviteText`) and clipboard copy button.
- Added `📅 Meeting Planner` top navigation action button.
- Added unit test suite in `src/services/meetingSchedulerService.spec.ts`.

## [0.2.0] - 2026-07-26

### Added
- Integrated **World Map Timezone Visualizer & Day/Night Solar Terminator** in `src/services/sunCalcService.ts`, `src/components/WorldMapVisualizer.tsx`, and `src/App.tsx`.
- Added subsolar point calculator (`calculateSubsolarPoint`) and dynamic SVG night shadow polygon path generator.
- Added interactive SVG world map visualizer with continental landmass outlines, subsolar sun marker, timezone pin markers, and live hover tooltips.
- Added map toggle control (`🗺️ Hide Map / Show Map`) in dashboard header.
- Added unit test suite in `src/services/sunCalcService.spec.ts`.

## [0.1.0] - 2026-07-26

### Added
- Initialized **Solid.js Real-time Clock Dashboard** in `src/services/clockStore.ts`, `src/components/ClockCard.tsx`, and `src/App.tsx`.
- Built fine-grained reactive time signal engine with `Intl.DateTimeFormat` calculations.
- Built SVG analog clock component in `src/components/AnalogClock.tsx`.
- Added timezone preset picker modal dialog in `src/components/AddClockModal.tsx`.
- Added 12h/24h toggle, clock pinning, and custom color themes.
- Added Vitest unit test suite in `src/services/clockStore.spec.ts`.
