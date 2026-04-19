import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { AppProvider, useApp } from '../lib/AppContext';

function RootNavigator() {
  const { ready, nonnegotiable } = useApp();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!ready) return;

    const inSetup = segments[0] === 'setup';
    const hasNonnegotiable = nonnegotiable !== null;

    if (!hasNonnegotiable && !inSetup) {
      router.replace('/setup');
    } else if (hasNonnegotiable && inSetup) {
      router.replace('/');
    }
  }, [ready, nonnegotiable, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="setup" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
