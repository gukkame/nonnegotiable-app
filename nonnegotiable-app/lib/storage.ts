import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Nonnegotiable, CheckIns } from '../types';

const KEYS = {
  nonnegotiable:    '@nonnegotiable/definition',
  checkIns:         '@nonnegotiable/checkIns',
  weeklyResetWeek:  '@nonnegotiable/weeklyResetWeek',
} as const;

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
