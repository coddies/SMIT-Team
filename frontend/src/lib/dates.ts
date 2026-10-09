// ============================================================
// Date helpers — formatting and countdown utilities
// ============================================================

/**
 * Returns number of days from today until the given ISO date.
 * Negative means past due.
 */
export function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export const daysRemaining = daysUntil;

/**
 * Formats a date string to a readable form: "Oct 31, 2026"
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns "today", "yesterday", "tomorrow", or formatted date.
 */
export function humanDate(isoDate: string): string {
  const days = daysUntil(isoDate);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return formatDate(isoDate);
}

/**
 * Format hours as "1h 30m" or "45m"
 */
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Returns a human-readable deadline label.
 */
export function deadlineLabel(isoDate: string): string {
  const days = daysUntil(isoDate);
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days left`;
}
