import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useApp } from '../lib/AppContext'
import { Colors } from '../lib/colors'
import React, { useRef } from 'react'

const NUDGES = [
  "Don't think about the full task.\nJust do this one thing. That's enough to start.",
  "Motivation follows action, not the other way around.\nStart before you feel ready.",
  "You don't have to do it well.\nYou just have to do it.",
  "The hardest part is sitting down.\nYou've already done the harder thing — you're here.",
  "One small move breaks the inertia.\nEverything else gets easier after this.",
  "You're not behind. You're just starting.\nThat's all this moment asks.",
  "Resistance is loudest right before you begin.\nPush through the first sixty seconds.",
  "No conditions. No 'when I feel like it'.\nJust this. Just now.",
  "Done imperfectly beats not started perfectly.\nGo.",
  "Your future self is watching.\nGive them something to be grateful for.",
]

export default function FrictionScreen() {
  const { nonnegotiable, markToday } = useApp()
  const router = useRouter()
  const nudge = useRef(NUDGES[Math.floor(Math.random() * NUDGES.length)]).current

  if (!nonnegotiable) return null

  const microAction = nonnegotiable.bareMinimum ||
    `Open your laptop and open the ${nonnegotiable.projectName} project.`

  const handleDone = async () => {
    await markToday('yes')
    router.back()
  }

  return (
    <SafeAreaView style={styleSheet.safe}>
      <View style={styleSheet.container}>
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={styleSheet.back}
        >
          <Text style={styleSheet.backText}>← Back</Text>
        </Pressable>

        {/* Content */}
        <View style={styleSheet.body}>
          <Text style={styleSheet.eyebrow}>Smallest possible step</Text>
          <Text style={styleSheet.action}>{microAction}</Text>
          <View style={styleSheet.note}>
            <Text style={styleSheet.noteText}>{nudge}</Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable style={styleSheet.btn} onPress={handleDone}>
          <Text style={styleSheet.btnText}>Done — I started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styleSheet = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  back: { marginBottom: 40 },
  backText: { fontSize: 14, color: Colors.secondary },
  body: { flex: 1, justifyContent: 'center' },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accent,
    marginBottom: 20,
  },
  action: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 36,
  },
  note: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 18,
  },
  noteText: { fontSize: 14, color: Colors.secondary, lineHeight: 24 },
  btn: {
    backgroundColor: '#1f1f23',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
})
