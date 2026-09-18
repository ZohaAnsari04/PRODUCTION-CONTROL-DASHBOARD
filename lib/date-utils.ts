// Current operations reference date: September 18, 2026
export const BASE_DATE = new Date("2026-09-18T00:00:00");

/**
 * Formats YYYY-MM-DD to "18 Sep 2026"
 */
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const dayStr = day.toString().padStart(2, "0");
    const monthName = MONTH_NAMES[month - 1] || "Jan";
    return `${dayStr} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Calculates calendar day difference between target date and the reference date.
 * negative = in past (overdue)
 * 0 = today
 * positive = future days
 */
export function getDaysDifference(dateStr: string, referenceDate = BASE_DATE): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const ref = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  
  const diffTime = target.getTime() - ref.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a job date is today (day 0)
 */
export function isDueToday(dateStr: string): boolean {
  return getDaysDifference(dateStr) === 0;
}

/**
 * Checks if a job date is overdue (past days)
 */
export function isOverdue(dateStr: string): boolean {
  return getDaysDifference(dateStr) < 0;
}

/**
 * Checks if a job is due today or within the next 2 calendar days (0, 1, or 2 days from now)
 */
export function isDueSoon(dateStr: string): boolean {
  const diff = getDaysDifference(dateStr);
  return diff >= 0 && diff <= 2;
}
