// src/services/meetingSchedulerService.spec.ts
// Unit tests for meetingSchedulerService.
// Connects to: src/services/meetingSchedulerService.ts
// Created: 2026-07-26

import { describe, it, expect } from 'vitest';
import { calculateTimezoneOverlaps, formatMeetingInviteText } from './meetingSchedulerService';

describe('meetingSchedulerService', () => {
  it('calculates 24 UTC hourly slots for meeting overlap', () => {
    const timezones = ['UTC', 'America/New_York', 'Europe/London'];
    const slots = calculateTimezoneOverlaps(timezones);

    expect(slots.length).toBe(24);
    expect(slots[0].utcHour).toBe(0);
    expect(slots[12].formattedUtcTime).toBe('12:00 UTC');
  });

  it('correctly categorizes working vs sleeping hours for participant timezones', () => {
    const timezones = ['UTC', 'Asia/Tokyo'];
    const slots = calculateTimezoneOverlaps(timezones, new Date('2026-07-26T12:00:00Z'));

    // At 14:00 UTC -> Tokyo is 23:00 (sleeping)
    const slot14 = slots[14];
    const tokyoStatus = slot14.participantStatuses.find(p => p.timezone === 'Asia/Tokyo');

    expect(tokyoStatus).toBeDefined();
    expect(tokyoStatus?.status).toBe('sleeping');
  });

  it('formats clean meeting invite text string', () => {
    const timezones = ['UTC', 'America/New_York'];
    const slots = calculateTimezoneOverlaps(timezones);
    const text = formatMeetingInviteText(slots[14]);

    expect(text).toContain('Global Team Meeting Invite');
    expect(text).toContain('UTC');
    expect(text).toContain('America/New_York');
  });
});
