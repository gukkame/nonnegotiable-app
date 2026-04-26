import React, { useRef } from 'react'
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors } from '../lib/colors'
import { NoticeType } from '../types/notices'

const DAILY_QUOTES = [
  "You said this matters. Prove it.",
  "Waiting for motivation is the oldest excuse in the book.",
  "The version of you who did it is on the other side of this moment.",
  "Every day you skip, you're voting against yourself.",
  "You don't need to feel ready. You need to start.",
  "Discipline is doing it when you don't want to. Especially then.",
  "Your future self is watching. Don't disappoint them.",
  "The resistance you feel right now is the exact reason you need to go.",
  "Stop negotiating with yourself. You already know what to do.",
  "One rep. One paragraph. One minute. Start there.",
  "You made a commitment. Honor it.",
  "Nobody built anything by waiting to feel like it.",
  "This is the moment you either grow or shrink. Choose.",
  "The hardest part ends the second you begin.",
  "You can rest when it's done. Not before.",
  "Excuses are comfortable. Results are not.",
  "The gap between who you are and who you want to be closes right here.",
  "It's not about motivation. It's about identity. Who are you?",
  "You've done harder things. Do this.",
  "Go.",
]

const SKIP_QUOTES = [
  "Nothing changes if nothing changes.",
  "Yesterday is gone. Today is still yours — if you take it.",
  "A missed day is a data point, not a death sentence. Now move.",
  "You broke the streak. You can't unbreak it. You can start a new one.",
  "The only way to lose for good is to stop getting back up.",
  "One miss doesn't define you. Two in a row might. Don't let it be two.",
  "You skipped. Fine. Now what? That answer matters more.",
  "Regret compounds faster than progress. Get back now.",
  "Skipping is easy. Living with who you become after skipping is not.",
  "The longer you wait to restart, the harder it gets. Do it now.",
  "You already know what doing nothing feels like. Try the other thing.",
  "Today you get to decide if yesterday was a pause or a pattern.",
  "Stop mourning the miss. Start building the comeback.",
  "The gap between who you are and who you want to be just got wider. Close it.",
  "Nobody remembers the days you skipped. They remember what you built.",
  "Inertia works both ways. Start moving and it gets easier.",
  "You didn't fail. You paused. Now unpause.",
  "Every champion has a comeback story. This is yours — if you want it.",
  "The version of you who shows up today fixes what yesterday broke.",
  "This is where most people quit. Don't be most people.",
]

const SUNDAY_TITLES = [
  "Is this enough?",
  "The week is done. Was it worth it?",
  "Time to be honest with yourself.",
  "Results don't lie. Do you?",
  "What does this week say about you?",
  "You set a standard. Did you meet it?",
  "Seven days. What did you build?",
  "The scoreboard doesn't care about your excuses.",
  "Look at the number. Does it reflect your commitment?",
  "This is your weekly reckoning.",
  "Seven chances. How many did you take?",
  "Comfort or growth — which one won this week?",
  "Your actions this week spoke. What did they say?",
  "Did you show up for the person you're trying to become?",
  "Progress or comfort? The numbers tell the story.",
  "Another week closes. Did you close it with integrity?",
  "The week you had vs. the week you planned. Honest?",
  "You got seven shots. Did you take them?",
  "This week happened. You can't change it. You can change next week.",
  "Accountability time. No judgment — just truth.",
]

type Props = {
  type: NoticeType | null
  why: string
  projectName: string
  completedDays: number
  onDismiss: () => void
}

export function NoticeModal({ type, why, projectName, completedDays, onDismiss }: Props) {
  const router = useRouter()
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const dailyQuote  = useRef(pick(DAILY_QUOTES)).current
  const skipQuote   = useRef(pick(SKIP_QUOTES)).current
  const sundayTitle = useRef(pick(SUNDAY_TITLES)).current

  if (!type) return null

  if (type === NoticeType.Daily) {
    return (
      <Modal transparent animationType="fade" visible onRequestClose={onDismiss}>
        <View style={s.overlay}>
          <View style={s.card}>
            <Text style={s.eyebrow}>Today's nonnegotiable</Text>
            <Text style={s.title}>{dailyQuote}</Text>
            <Text style={s.sub}>"{why}"</Text>
            <Pressable style={s.btn} onPress={onDismiss}>
              <Text style={s.btnText}>I'll show up today</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  if (type === NoticeType.Skip) {
    return (
      <Modal transparent animationType="fade" visible onRequestClose={onDismiss}>
        <View style={s.overlay}>
          <View style={s.card}>
            <Text style={s.eyebrow}>Yesterday</Text>
            <Text style={s.title}>{skipQuote}</Text>
            <Text style={s.sub}>Today is a fresh start.</Text>
            <Pressable style={s.btn} onPress={onDismiss}>
              <Text style={s.btnText}>I'll show up today</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  if (type === NoticeType.Sunday) {
    return (
      <Modal transparent animationType="fade" visible onRequestClose={onDismiss}>
        <View style={s.overlay}>
          <View style={s.card}>
            <Text style={s.eyebrow}>Weekly Check-in</Text>
            <Text style={s.title}>{sundayTitle}</Text>
            <Text style={s.sub}>You showed up {completedDays}/7 days.{'\n'}Is this enough for "{projectName}"?</Text>
            <Pressable
              style={s.btn}
              onPress={() => {
                onDismiss()
                router.push('/(tabs)/week')
              }}
            >
              <Text style={s.btnText}>Do weekly reset →</Text>
            </Pressable>
            <Pressable style={s.ghost} onPress={onDismiss}>
              <Text style={s.ghostText}>Later</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  return null
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    padding: 28,
    width: '100%',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 34,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  sub:     { fontSize: 15, color: Colors.secondary, lineHeight: 24, marginBottom: 28, fontStyle: 'italic' },
  btn:     { backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  ghost:   { alignItems: 'center', paddingTop: 16 },
  ghostText: { fontSize: 13, color: 'rgba(255,255,255,0.25)' },
})
