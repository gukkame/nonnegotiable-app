import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Nonnegotiable } from '../types';

const KEYS = {
  nonnegotiable: '@nonnegotiable/definition',
  checkIns: '@nonnegotiable/checkIns',
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

export async function loadCheckIns(): Promise<Record<string, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.checkIns);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch (err) {
    console.warn('Failed to load check-ins', err);
    return {};
  }
}

export async function saveCheckIns(checkIns: Record<string, boolean>): Promise<void> {
  await AsyncStorage.setItem(KEYS.checkIns, JSON.stringify(checkIns));
}
