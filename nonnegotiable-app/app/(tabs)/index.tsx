import { View, Text, Pressable, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Svg, { Path, Circle } from 'react-native-svg'
import { useApp } from '../../lib/AppContext'
import { computeStreak } from '../../lib/date'
import { Colors } from '../../lib/colors'
import React from 'react'

export default function HomeScreen() {
  const { nonnegotiable, checkIns, todayValue, markToday, resetAll } = useApp()
  const router = useRouter()
  const streak = computeStreak(checkIns)

  if (!nonnegotiable) return null

  const confirmReset = () =>
    Alert.alert(
      'Reset project?',
      'This clears your nonnegotiable and all check-ins.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAll },
      ],
    )

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        {/* Top row: project + streak */}
        <View style={s.topRow}>
          <View>
            <Text style={s.label}>Project</Text>
            <Text style={s.projectName}>{nonnegotiable.projectName}</Text>
          </View>
          {streak > 0 && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.label}>Streak</Text>
              <Text style={s.streakBadge}>{streak}d</Text>
            </View>
          )}
        </View>

        {/* Center: action + why */}
        <View style={s.center}>
          <Text style={s.sectionAccent}>Today's nonnegotiable</Text>
          <Text style={s.action}>{nonnegotiable.action}</Text>
          <View style={s.whyBorder}>
            <Text style={s.why}>"{nonnegotiable.why}"</Text>
          </View>
        </View>

        {/* Bottom: actions */}
        <View>
          {!todayValue ? (
            <>
              <View style={s.yesNoRow}>
                <Pressable
                  style={({ pressed }) => [
                    s.btn,
                    s.btnYes,
                    pressed && s.pressed,
                  ]}
                  onPress={() => markToday('yes')}
                >
                  <Text style={s.btnText}>YES</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    s.btn,
                    s.btnNo,
                    pressed && s.pressed,
                  ]}
                  onPress={() => markToday('no')}
                >
                  <Text style={s.btnText}>NO</Text>
                </Pressable>
              </View>
              <Pressable
                style={s.frictionLink}
                onPress={() => router.push('/friction')}
              >
                <Text style={s.frictionText}>Make it easier →</Text>
              </Pressable>
            </>
          ) : (
            <View
              style={[
                s.doneCard,
                {
                  borderColor:
                    todayValue === 'yes'
                      ? Colors.success + '35'
                      : Colors.failure + '35',
                  backgroundColor:
                    todayValue === 'yes'
                      ? Colors.success + '12'
                      : Colors.failure + '12',
                },
              ]}
            >
              <View
                style={[
                  s.doneIcon,
                  {
                    backgroundColor:
                      todayValue === 'yes'
                        ? Colors.success + '22'
                        : Colors.failure + '22',
                  },
                ]}
              >
                {todayValue === 'yes' ? (
                  <Svg width={14} height={11} viewBox="0 0 14 11">
                    <Path
                      d="M1 5.5L5.5 10 13 1"
                      stroke={Colors.success}
                      strokeWidth={2}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : (
                  <Svg width={12} height={12} viewBox="0 0 12 12">
                    <Path
                      d="M1 1l10 10M11 1L1 11"
                      stroke={Colors.failure}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </Svg>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.doneTitle}>
                  {todayValue === 'yes'
                    ? 'You showed up.'
                    : 'You missed today.'}
                </Text>
                <Text style={s.doneSubtitle}>
                  {todayValue === 'yes'
                    ? 'Come back tomorrow.'
                    : 'Tomorrow is still there.'}
                </Text>
              </View>
            </View>
          )}

          <Pressable style={s.resetLink} onPress={confirmReset}>
            <Text style={s.resetText}>Reset project</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 3,
  },
  projectName: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  streakBadge: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  center: { flex: 1, justifyContent: 'center' },
  sectionAccent: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accent,
    marginBottom: 16,
  },
  action: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  whyBorder: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.accent + '45',
    paddingLeft: 14,
  },
  why: {
    fontSize: 14,
    color: Colors.secondary,
    fontStyle: 'italic',
    lineHeight: 23,
  },
  yesNoRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  btn: { flex: 1, paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  btnYes: { backgroundColor: Colors.success },
  btnNo: { backgroundColor: Colors.failure },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  pressed: { opacity: 0.68 },
  frictionLink: { alignItems: 'center', paddingVertical: 14 },
  frictionText: { fontSize: 13, color: Colors.secondary },
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
  },
  doneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  doneTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  doneSubtitle: { fontSize: 12, color: Colors.secondary },
  resetLink: { alignItems: 'center', paddingTop: 14 },
  resetText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: 0.5,
  },
})
