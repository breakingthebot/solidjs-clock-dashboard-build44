// src/services/meetingSchedulerService.ts
// Multi-Timezone Meeting Overlap Calculator & Scheduler for Solid.js.
// Connects to: src/components/MeetingSchedulerModal.tsx, src/services/meetingSchedulerService.spec.ts
// Created: 2026-07-26

export interface ParticipantStatus {
  timezone: string;
  localHour: number;
  formattedLocalTime: string;
  status: 'working' | 'extended' | 'sleeping';
}

export interface OverlapSlotResult {
  utcHour: number;
  formattedUtcTime: string;
  isGoldenSlot: boolean; // Everyone in 9-17 working hours
  isPossibleSlot: boolean; // Everyone in 8-20 extended hours
  participantStatuses: ParticipantStatus[];
}

export function calculateTimezoneOverlaps(
  timezones: string[],
  targetDate: Date = new Date(),
  workStart: number = 9,
  workEnd: number = 17
): OverlapSlotResult[] {
  const slots: OverlapSlotResult[] = [];

  for (let utcHour = 0; utcHour < 24; utcHour++) {
    // Create UTC date object for this hour
    const slotDate = new Date(Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      utcHour,
      0,
      0
    ));

    const participantStatuses: ParticipantStatus[] = [];
    let allInWorking = true;
    let allInExtended = true;

    for (const tz of timezones) {
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }).formatToParts(slotDate);

        let localHour = 0;
        let formattedLocalTime = '';

        for (const p of parts) {
          if (p.type === 'hour') localHour = parseInt(p.value, 10);
        }

        formattedLocalTime = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(slotDate);

        let status: 'working' | 'extended' | 'sleeping' = 'sleeping';
        if (localHour >= workStart && localHour < workEnd) {
          status = 'working';
        } else if (localHour >= 7 && localHour < 21) {
          status = 'extended';
        }

        if (status !== 'working') allInWorking = false;
        if (status === 'sleeping') allInExtended = false;

        participantStatuses.push({
          timezone: tz,
          localHour,
          formattedLocalTime,
          status
        });
      } catch (e) {
        // Fallback for invalid timezone
        participantStatuses.push({
          timezone: tz,
          localHour: utcHour,
          formattedLocalTime: `${utcHour}:00`,
          status: 'working'
        });
      }
    }

    slots.push({
      utcHour,
      formattedUtcTime: `${utcHour < 10 ? '0' : ''}${utcHour}:00 UTC`,
      isGoldenSlot: allInWorking,
      isPossibleSlot: allInExtended,
      participantStatuses
    });
  }

  return slots;
}

export function formatMeetingInviteText(slot: OverlapSlotResult): string {
  let text = `📅 Global Team Meeting Invite (${slot.formattedUtcTime})\n`;
  text += `--------------------------------------------------\n`;
  for (const p of slot.participantStatuses) {
    const icon = p.status === 'working' ? '✅' : p.status === 'extended' ? '⚠️' : '🌙';
    text += `${icon} ${p.timezone}: ${p.formattedLocalTime} (${p.status})\n`;
  }
  text += `--------------------------------------------------\n`;
  text += `Generated via Solid.js Timezone Clock Dashboard`;
  return text;
}
