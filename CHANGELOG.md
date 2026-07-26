# Changelog - Build 44 (Solid.js Real-Time Clock Dashboard)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
