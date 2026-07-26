# Changelog - Build 44 (Solid.js Real-Time Clock Dashboard)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-26

### Added
- Initialized **Solid.js Real-time Clock Dashboard** in `src/services/clockStore.ts`, `src/components/ClockCard.tsx`, and `src/App.tsx`.
- Built fine-grained reactive time signal engine with `Intl.DateTimeFormat` calculations.
- Built SVG analog clock component in `src/components/AnalogClock.tsx`.
- Added timezone preset picker modal dialog in `src/components/AddClockModal.tsx`.
- Added 12h/24h toggle, clock pinning, and custom color themes.
- Added Vitest unit test suite in `src/services/clockStore.spec.ts`.
