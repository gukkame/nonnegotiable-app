import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../../lib/AppContext'
import { getWeekKeys, todayKey } from '../../lib/date'
import { Colors } from '../../lib/colors'
import React from 'react'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const ADJUSTMENTS = [
  { id: 'time', label: 'Change the time I show up' },
  { id: 'action', label: 'Simplify the action further' },
  { id: 'why', label: 'Revisit my why' },
  { id: 'nothing', label: 'Nothing — stay the course' },
]

export default function WeekScreen() {
  const { checkIns } = useApp()
  const [reflection, setReflection] = useState('')
  const [adjustment, setAdjustment] = useState<string | null>(null)

  const weekKeys = getWeekKeys()
  const completed = weekKeys.filter((k) => checkIns[k] === 'yes').length
  const pct = completed / 7

  const today = new Date().getDay()
  const todayIdx = today === 0 ? 6 : today - 1

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Score */}
        <Text style={s.eyebrow}>Weekly Reset</Text>
        <View style={s.scoreRow}>
          <Text style={s.scoreNum}>{completed}</Text>
          <Text style={s.scoreTotal}>/ 7</Text>
        </View>

        {/* Progress bar */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${pct * 100}%` as any }]} />
        </View>

        {/* Week strip */}
        <View style={s.weekStrip}>
          {DAY_LABELS.map((d, i) => {
            const val = checkIns[weekKeys[i]]
            const isToday = i === todayIdx
            return (
              <View key={i} style={s.dayCol}>
                <Text
                  style={[s.dayLabel, isToday && { color: Colors.primary }]}
                >
                  {d}
                </Text>
                <View
                  style={[
                    s.dayDot,
                    val === 'yes' && {
                      backgroundColor: Colors.success,
                      borderColor: 'transparent',
                    },
                    val === 'no' && { borderColor: Colors.failure + '55' },
                    isToday && !val && { borderColor: Colors.accent + '80' },
                  ]}
                >
                  {val === 'yes' && (
                    <Text
                      style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}
                    >
                      ✓
                    </Text>
                  )}
                  {val === 'no' && (
                    <Text style={{ color: Colors.failure, fontSize: 11 }}>
                      ✕
                    </Text>
                  )}
                </View>
              </View>
            )
          })}
        </View>

        {/* Divider */}
        <View style={s.divider} />

        {/* Reflection */}
        <Text style={s.fieldLabel}>When did you resist most?</Text>
        <TextInput
          value={reflection}
          onChangeText={setReflection}
          placeholder="Write honestly. No one is watching."
          placeholderTextColor={Colors.secondary + '80'}
          multiline
          style={[s.textarea, reflection.length > 0 && s.textareaFocused]}
        />

        {/* Adjustment */}
        <Text style={[s.fieldLabel, { marginTop: 24 }]}>
          Choose one adjustment
        </Text>
        {ADJUSTMENTS.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => setAdjustment(a.id)}
            style={({ pressed }) => [
              s.option,
              adjustment === a.id && s.optionActive,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text
              style={[
                s.optionText,
                adjustment === a.id && {
                  color: Colors.primary,
                  fontWeight: '500',
                },
              ]}
            >
              {a.label}
            </Text>
          </Pressable>
        ))}

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.75 }]}
          onPress={() => {
            setReflection('')
            setAdjustment(null)
          }}
        >
          <Text style={s.ctaText}>Reset &amp; continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  scoreNum: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 68,
  },
  scoreTotal: { fontSize: 24, fontWeight: '300', color: Colors.secondary },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  weekStrip: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  dayCol: { flex: 1, alignItems: 'center', gap: 5 },
  dayLabel: { fontSize: 11, color: Colors.secondary },
  dayDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 10,
  },
  textarea: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 14,
    color: Colors.primary,
    fontSize: 15,
    lineHeight: 24,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  textareaFocused: { borderColor: Colors.accent + '55' },
  option: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  optionActive: {
    borderColor: Colors.accent + '55',
    backgroundColor: Colors.accent + '14',
  },
  optionText: { fontSize: 15, color: Colors.secondary },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 14,
  },
  cta: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#fff' },
})
