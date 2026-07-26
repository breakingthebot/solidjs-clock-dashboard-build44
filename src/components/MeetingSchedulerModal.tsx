// src/components/MeetingSchedulerModal.tsx
// Interactive Multi-Timezone Meeting Scheduler Modal Component for Solid.js.
// Connects to: src/App.tsx, src/services/meetingSchedulerService.ts
// Created: 2026-07-26

import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { 
  calculateTimezoneOverlaps, 
  formatMeetingInviteText, 
  OverlapSlotResult 
} from '../services/meetingSchedulerService';

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timezones: string[];
}

export const MeetingSchedulerModal: Component<MeetingSchedulerModalProps> = (props) => {
  const [selectedSlot, setSelectedSlot] = createSignal<OverlapSlotResult | null>(null);
  const [copySuccess, setCopySuccess] = createSignal(false);

  const slots = createMemo(() => calculateTimezoneOverlaps(props.timezones));

  const goldenSlotsCount = createMemo(() => slots().filter(s => s.isGoldenSlot).length);

  const handleCopyInvite = (slot: OverlapSlotResult) => {
    const text = formatMeetingInviteText(slot);
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card scheduler-modal-card">
          <div class="modal-header">
            <div>
              <h2>📅 Multi-Timezone Meeting Scheduler</h2>
              <p class="subtitle">Finding golden overlapping work hours across {props.timezones.length} active timezones</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="scheduler-body">
            <div class="scheduler-summary">
              <span class="golden-badge">
                ⭐ {goldenSlotsCount()} Golden Overlap Hours Found
              </span>
              <span class="legend-info">
                🟢 Working (9-17) • 🟡 Extended (7-21) • 🌙 Off/Sleeping
              </span>
            </div>

            {/* 24-Hour Timeline Overlap Matrix */}
            <div class="timeline-matrix card">
              <For each={slots()}>
                {(slot) => (
                  <div 
                    class="timeline-slot-row"
                    classList={{
                      golden: slot.isGoldenSlot,
                      possible: slot.isPossibleSlot && !slot.isGoldenSlot,
                      selected: selectedSlot()?.utcHour === slot.utcHour
                    }}
                    onclick={() => setSelectedSlot(slot)}
                  >
                    <div class="utc-time-col">
                      <strong>{slot.formattedUtcTime}</strong>
                      {slot.isGoldenSlot && <span class="star-icon">⭐</span>}
                    </div>

                    <div class="participants-col">
                      <For each={slot.participantStatuses}>
                        {(p) => (
                          <div 
                            class="participant-pill"
                            classList={{
                              working: p.status === 'working',
                              extended: p.status === 'extended',
                              sleeping: p.status === 'sleeping'
                            }}
                            title={`${p.timezone}: ${p.formattedLocalTime} (${p.status})`}
                          >
                            <span class="tz-code">{p.timezone.split('/')[1] || p.timezone}</span>
                            <span class="tz-time">{p.formattedLocalTime}</span>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            </div>

            {/* Selected Slot Details & Copy Invite */}
            <Show when={selectedSlot()}>
              <div class="selected-slot-card card fade-in">
                <div class="slot-details-head">
                  <h3>📌 Selected Meeting Time: {selectedSlot()!.formattedUtcTime}</h3>
                  <button 
                    type="button" 
                    onclick={() => handleCopyInvite(selectedSlot()!)} 
                    class="btn btn-primary"
                  >
                    {copySuccess() ? '✅ Copied Invite!' : '📋 Copy Meeting Invite'}
                  </button>
                </div>

                <div class="slot-participants-list">
                  <For each={selectedSlot()!.participantStatuses}>
                    {(p) => (
                      <div class="slot-participant-row">
                        <span>{p.status === 'working' ? '✅' : p.status === 'extended' ? '⚠️' : '🌙'} <strong>{p.timezone}</strong></span>
                        <span class="local-val">{p.formattedLocalTime}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <div class="modal-actions">
              <button type="button" onclick={props.onClose} class="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
