import { InstitutionalPolicy } from '../types';

export const DEFAULT_POLICY: InstitutionalPolicy = {
  collegeName: "CT Group of Institutions (CTGI)",
  campusName: "Shahpur & Maqsudan Campuses, Jalandhar",
  timeZone: "Asia/Kolkata",
  workingHoursStart: "09:00",
  workingHoursEnd: "16:30",
  dayScholarPassDeadline: "14:00", // 2:00 PM mandatory cutoff
  hostellerCurfewTime: "19:30", // 7:30 PM
  requireDualApprovalForHosteller: true,
  allowLatePassSubmission: true
};

/**
 * Formats a Date or ISO string into Asia/Kolkata local time safely
 */
export function formatKolkataTime(dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  try {
    if (options) {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...options
      }).format(date);
    }
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (e) {
    return date.toLocaleString();
  }
}

/**
 * Checks if current time is before 2:00 PM IST
 */
export function isBeforeDayScholarDeadline(dateInput: Date = new Date()): boolean {
  try {
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const parts = istFormatter.formatToParts(dateInput);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
    
    return hour < 14 || (hour === 14 && minute === 0);
  } catch (e) {
    const hours = dateInput.getHours();
    return hours < 14;
  }
}

/**
 * Checks if a given date is a working day (Mon-Fri)
 */
export function isWorkingDay(dateInput: Date = new Date()): boolean {
  const day = dateInput.getDay();
  return day >= 1 && day <= 5; // Monday to Friday
}
