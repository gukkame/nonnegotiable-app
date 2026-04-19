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
 * Computes the current streak: number of consecutive days ending today
 * (or yesterday, if today isn't checked yet) that are marked complete.
 *
 * Rule: streak only breaks once a day has been missed AND that day is in
 * the past. Today being uncompleted doesn't break the streak yet — we
 * count backwards from yesterday in that case.
 */
export function computeStreak(
  checkIns: Record<string, boolean>,
  today: Date = new Date()
): number {
  let streak = 0;
  const todayK = todayKey(today);
  const startOffset = checkIns[todayK] ? 0 : 1;

  for (let i = startOffset; i < 10000; i++) {
    const key = daysAgoKey(i, today);
    if (checkIns[key]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Longest streak ever recorded in the check-in history.
 */
export function computeLongestStreak(checkIns: Record<string, boolean>): number {
  const dates = Object.keys(checkIns)
    .filter((k) => checkIns[k])
    .sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

/**
 * Total check-ins (lifetime count).
 */
export function totalCheckIns(checkIns: Record<string, boolean>): number {
  return Object.values(checkIns).filter(Boolean).length;
}
