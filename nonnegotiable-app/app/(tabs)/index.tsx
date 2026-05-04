import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useApp } from '../../lib/AppContext'
import { computeStreak } from '../../lib/date'
import { Colors } from '../../lib/colors'
import { Borders } from '../../lib/theme'
import { EyebrowLabel } from '../../components/EyebrowLabel'
import { WeekStrip } from '../../components/WeekStrip'
import { RuleCard } from '../../components/RuleCard'
import { DoneCard } from '../../components/DoneCard'
import { ResetLink } from '../../components/ResetLink'

export default function HomeScreen() {
  const { nonnegotiable, checkIns, todayValue, markToday, resetAll } = useApp()
  const router = useRouter()

  if (!nonnegotiable) return null

  const streak = computeStreak(checkIns)

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        {/* Project + streak */}
        <View style={s.topRow}>
          <View>
            <EyebrowLabel>Project</EyebrowLabel>
            <Text style={s.projectName}>{nonnegotiable.projectName}</Text>
          </View>
          {streak > 0 && (
            <View style={{ alignItems: 'flex-end' }}>
              <EyebrowLabel>Streak</EyebrowLabel>
              <Text style={s.streakBadge}>{streak}d</Text>
            </View>
          )}
        </View>

        <WeekStrip checkIns={checkIns} size={28} />

        {/* Action + rule + why */}
        <View style={s.center}>
          <EyebrowLabel accent style={{ marginBottom: 16 }}>
            Today's nonnegotiable
          </EyebrowLabel>
          <Text style={s.action}>{nonnegotiable.action}</Text>

          {nonnegotiable.executionRule && (
            <RuleCard rule={nonnegotiable.executionRule} compact style={{ marginBottom: 16 }} />
          )}

          <View style={s.whyBorder}>
            <Text style={s.why}>"{nonnegotiable.why}"</Text>
          </View>
        </View>

        {/* Bottom: yes/no or done card */}
        <View>
          {todayValue ? (
            <DoneCard value={todayValue} />
          ) : (
            <>
              <View style={s.yesNoRow}>
                <Pressable
                  style={[s.actionBtn, { backgroundColor: Colors.success }]}
                  onPress={() => markToday('yes')}
                >
                  <Text style={s.actionBtnText}>YES</Text>
                </Pressable>
                <Pressable
                  style={[s.actionBtn, { backgroundColor: Colors.failure }]}
                  onPress={() => markToday('no')}
                >
                  <Text style={s.actionBtnText}>NO</Text>
                </Pressable>
              </View>
              <Pressable style={s.frictionLink} onPress={() => router.push('/friction')}>
                <Text style={s.frictionText}>Make it easier →</Text>
              </Pressable>
            </>
          )}

          {todayValue ? (
            <ResetLink
              label="Undo check-in"
              title="Undo today's check-in?"
              message="This will clear your answer for today."
              onConfirm={() => markToday(todayValue)}
            />
          ) : (
            <ResetLink onConfirm={resetAll} />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg },
  container:    { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  topRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  projectName:  { fontSize: 16, fontWeight: '600', color: Colors.primary, marginTop: 3 },
  streakBadge:  { fontSize: 16, fontWeight: '700', color: Colors.primary, marginTop: 3 },

  center:       { flex: 1, justifyContent: 'center', marginTop: 36 },
  action:       { fontSize: 32, fontWeight: '800', color: Colors.primary, lineHeight: 40, letterSpacing: -0.5, marginBottom: 16 },
  whyBorder:    { borderLeftWidth: 2, borderLeftColor: Colors.accent + '45', paddingLeft: 14 },
  why:          { fontSize: 14, color: Colors.secondary, fontStyle: 'italic', lineHeight: 23 },

  yesNoRow:     { flexDirection: 'row', gap: 12, marginBottom: 4 },
  actionBtn:    { flex: 1, paddingVertical: 22, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionBtnText:{ fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },

  frictionLink: { alignItems: 'center', paddingVertical: 14 },
  frictionText: { fontSize: 13, color: Colors.secondary },
})
