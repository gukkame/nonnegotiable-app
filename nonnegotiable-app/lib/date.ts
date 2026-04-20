/**
 * Returns today's date as a YYYY-MM-DD string in local time.
 */
export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the YYYY-MM-DD key for N days before the given date.
 */
export function daysAgoKey(n: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return todayKey(d);
}

/**
 * Returns the 7 YYYY-MM-DD keys for the current Mon–Sun week.
 */
export function getWeekKeys(from: Date = new Date()): string[] {
  const day = from.getDay(); // 0 = Sun
  const mon = new Date(from);
  mon.setDate(from.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return todayKey(d);
  });
}

/**
 * Current streak: consecutive days ending today (or yesterday if today
 * is not yet checked). Today being unchecked doesn't break the streak.
 */
export function computeStreak(
  checkIns: Record<string, unknown>,
  today: Date = new Date()
): number {
  let streak = 0;
  const todayK = todayKey(today);
  const startOffset = checkIns[todayK] ? 0 : 1;
  for (let i = startOffset; i < 10000; i++) {
    const key = daysAgoKey(i, today);
    if (checkIns[key]) { streak++; } else { break; }
  }
  return streak;
}

/**
 * Longest consecutive streak ever.
 */
export function computeLongestStreak(checkIns: Record<string, unknown>): number {
  const dates = Object.keys(checkIns).filter(k => checkIns[k] === 'yes').sort();
  if (dates.length === 0) return 0;
  let longest = 1, current = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round(
      (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000
    );
    if (diff === 1) { current++; longest = Math.max(longest, current); }
    else { current = 1; }
  }
  return longest;
}

/**
 * Total YES check-ins (lifetime).
 */
export function totalCheckIns(checkIns: Record<string, unknown>): number {
  return Object.values(checkIns).filter(v => v === 'yes').length;
}
