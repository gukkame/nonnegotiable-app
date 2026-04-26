import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Nonnegotiable, CheckIns } from '../types';

const KEYS = {
  nonnegotiable:    '@nonnegotiable/definition',
  checkIns:         '@nonnegotiable/checkIns',
  weeklyResetWeek:  '@nonnegotiable/weeklyResetWeek',
  noticeDates:      '@nonnegotiable/noticeDates',
} as const;

type NoticeDates = { daily?: string; skip?: string; sunday?: string };

export async function loadNonnegotiable(): Promise<Nonnegotiable | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.nonnegotiable);
    return raw ? (JSON.parse(raw) as Nonnegotiable) : null;
  } catch (err) {
    console.warn('Failed to load nonnegotiable', err);
    return null;
  }
}

export async function saveNonnegotiable(n: Nonnegotiable): Promise<void> {
  await AsyncStorage.setItem(KEYS.nonnegotiable, JSON.stringify(n));
}

export async function clearNonnegotiable(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.nonnegotiable, KEYS.checkIns]);
}

export async function loadCheckIns(): Promise<CheckIns> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.checkIns);
    return raw ? (JSON.parse(raw) as CheckIns) : {};
  } catch (err) {
    console.warn('Failed to load check-ins', err);
    return {};
  }
}

export async function saveCheckIns(checkIns: CheckIns): Promise<void> {
  await AsyncStorage.setItem(KEYS.checkIns, JSON.stringify(checkIns));
}

export async function loadWeeklyResetWeek(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.weeklyResetWeek);
  } catch {
    return null;
  }
}

export async function saveWeeklyResetWeek(weekKey: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.weeklyResetWeek, weekKey);
}

export async function clearWeeklyResetWeek(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.weeklyResetWeek);
}

export async function loadNoticeDates(): Promise<NoticeDates> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.noticeDates);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export async function saveNoticeDates(dates: NoticeDates): Promise<void> {
  await AsyncStorage.setItem(KEYS.noticeDates, JSON.stringify(dates));
}

export async function clearNoticeDates(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.noticeDates);
}
