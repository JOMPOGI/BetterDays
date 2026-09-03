import { format, parseISO } from 'date-fns';

/**
 * Format a local Date object into a 'YYYY-MM-DD' string without UTC timezone offset shift.
 * Replaces `date.toISOString().split('T')[0]` which converts to UTC midnight and causes
 * a 1-day backward shift in UTC+ timezones (e.g. Asia/Manila, UTC+8).
 */
export function formatDateOnly(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return '';
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse a 'YYYY-MM-DD' date string into a local Date object without UTC timezone skew.
 * Replaces `new Date("YYYY-MM-DD")` which parses as UTC midnight and shifts backward
 * in UTC- timezones.
 */
export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Safely format a date (string or Date) for display (e.g. 'MMM d, yyyy' or 'MMMM d, yyyy').
 */
export function formatDisplayDate(
  value: string | Date | null | undefined,
  pattern: string = 'MMM d, yyyy'
): string {
  if (!value) return '—';
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '—' : format(value, pattern);
  }
  const parsed = parseDateOnly(value);
  return parsed ? format(parsed, pattern) : '—';
}
