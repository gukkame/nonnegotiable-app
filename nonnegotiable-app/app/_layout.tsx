import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { AppProvider, useApp } from '../lib/AppContext';

function RootNavigator() {
  const { ready, nonnegotiable } = useApp();
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!ready) return;
    const inSetup = segments[0] === 'setup';
    const has     = nonnegotiable !== null;
    if (!has && !inSetup)  router.replace('/setup');
    if (has  && inSetup)   router.replace('/');
  }, [ready, nonnegotiable, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0C' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="setup"    options={{ gestureEnabled: false }} />
      <Stack.Screen name="friction" options={{ presentation: 'modal', gestureEnabled: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
        {/* Always dark status bar to match #0B0B0C background */}
        <StatusBar style="light" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
