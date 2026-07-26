# Solid.js Real-time Clock Dashboard (Build 44)

A high-performance real-time clock dashboard built with **Solid.js**, **Vite**, and **TypeScript**, featuring fine-grained reactive updates, multiple timezones, analog/digital displays, and zero unnecessary DOM re-renders.

## Features
- ⚡ **Fine-Grained Reactivity**: Built using Solid.js signals so only ticking time strings update in DOM without re-rendering parent containers.
- 🌐 **Multiple Timezones**: Track local, UTC, New York, London, Tokyo, Paris, Sydney, Dubai, and custom IANA timezones.
- 🕒 **Dual Analog & Digital Display**: Smooth SVG analog clock face + digital LED readout.
- ☀️ **Day/Night & Offset Calculation**: Instant visual badges for day/night cycles and hour offsets relative to local system time.
- 📌 **Pin & Customize**: Pin favorite clocks to top, toggle 12h/24h formats, and assign custom color accents.

## Tech Stack
- **Framework**: Solid.js (`solid-js`)
- **Build Tool**: Vite (`vite`)
- **Language**: TypeScript (`typescript`)
- **Testing**: Vitest (`vitest`)
- **Styling**: Vanilla CSS Glassmorphism Design System

## Getting Started
```bash
npm install
npm run dev
```

## Running Tests
```bash
npm test
```
