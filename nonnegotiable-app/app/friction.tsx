import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../lib/AppContext';
import { C } from '../lib/colors';
import React from 'react';

/**
 * Friction Mode — surfaces the smallest possible action to lower
 * the barrier to starting. Navigated to from the Home screen via
 * router.push('/friction'). Presented as a modal (see _layout.tsx).
 */
export default function FrictionScreen() {
  const { nonnegotiable, markToday } = useApp();
  const router = useRouter();

  if (!nonnegotiable) return null;

  const microAction = `Open your laptop and open the ${nonnegotiable.projectName} project.`;

  const handleDone = async () => {
    await markToday('yes');
    router.back();
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        {/* Back */}
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.back, pressed && { opacity: 0.6 }]}>
          <Text style={s.backText}>← Back</Text>
        </Pressable>

        {/* Content */}
        <View style={s.body}>
          <Text style={s.eyebrow}>Smallest possible step</Text>
          <Text style={s.action}>{microAction}</Text>
          <View style={s.note}>
            <Text style={s.noteText}>
              Don't think about the full task.{'\n'}
              Just do this one thing. That's enough to start.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [s.btn, pressed && { opacity: 0.72 }]}
          onPress={handleDone}
        >
          <Text style={s.btnText}>Done — I started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  back:      { marginBottom: 40 },
  backText:  { fontSize: 14, color: C.secondary },
  body:      { flex: 1, justifyContent: 'center' },
  eyebrow:   { fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: C.accent, marginBottom: 20 },
  action:    { fontSize: 28, fontWeight: '700', color: C.primary, lineHeight: 36, letterSpacing: -0.3, marginBottom: 36 },
  note:      { borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.07)', paddingVertical: 18 },
  noteText:  { fontSize: 14, color: C.secondary, lineHeight: 24 },
  btn:       { backgroundColor: '#1f1f23', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  btnText:   { fontSize: 16, fontWeight: '600', color: C.primary },
});
