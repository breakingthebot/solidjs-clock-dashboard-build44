// src/services/chimeService.ts
// Web Audio API Hourly Chime & Bell Sound Synthesizer Engine for Solid.js.
// Connects to: src/App.tsx, src/components/ChimeSettingsModal.tsx, src/services/chimeService.spec.ts
// Created: 2026-07-26

export interface ChimeSettings {
  isHourlyChimeEnabled: boolean;
  volume: number; // 0.0 to 1.0
}

export function checkHourlyChimeTrigger(prevMinute: number, currentMinute: number): boolean {
  // Triggers when minute transitions from 59 to 00
  return (prevMinute === 59 || prevMinute === -1) && currentMinute === 0;
}

export function playWebAudioChime(
  type: 'hourly' | 'alarm' = 'hourly',
  volume: number = 0.5,
  mockAudioContext?: any
): void {
  try {
    const AudioCtx = mockAudioContext || (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext));
    if (!AudioCtx) return;

    const ctx = typeof AudioCtx === 'function' ? new AudioCtx() : AudioCtx;
    if (!ctx.createOscillator || !ctx.createGain) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    if (type === 'hourly') {
      // Two-tone crystal glass chime (880Hz A5 + 1320Hz E6)
      const freqs = [880, 1320];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        noteGain.gain.setValueAtTime(0.01, now + idx * 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.4, now + idx * 0.15 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.2);
      });
    } else {
      // Tri-tone alarm bell
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        noteGain.gain.setValueAtTime(0.3, now + idx * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.8);
      });
    }
  } catch (e) {
    // Ignore AudioContext autoplay restriction block
  }
}
