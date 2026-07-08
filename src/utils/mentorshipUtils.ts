import { MentorshipConfig } from "@/types/mentorship";

/**
 * Firestore Timestamps serialize over the wire as { _seconds, _nanoseconds }
 * rather than an ISO string, so normalize whatever shape comes back into a Date.
 */
function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") return new Date(value);
  if (typeof value === "object") {
    if ("_seconds" in value) return new Date((value as { _seconds: number })._seconds * 1000);
    if ("seconds" in value) return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
}

/**
 * Mentorship booking is open when the current time falls within
 * [startDate, endDate]. isMentorshipOpen only acts as a force-close override
 * (e.g. an organizer pausing bookings mid-window); it never opens booking
 * outside of the scheduled window.
 */
export function isMentorshipOpenNow(config?: MentorshipConfig | null): boolean {
  if (!config) return false;

  const start = toDate(config.startDate);
  const end = toDate(config.endDate);
  const now = new Date();

  const withinWindow = (!start || now >= start) && (!end || now <= end);
  return withinWindow && config.isMentorshipOpen !== false;
}
