import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useApp } from '../../lib/AppContext'
import { getWeekKeys } from '../../lib/date'
import { Colors } from '../../lib/colors'
import { Borders } from '../../lib/theme'
import { RESISTANCE } from '../../lib/resistance'
import { EyebrowLabel } from '../../components/EyebrowLabel'
import { WeekStrip } from '../../components/WeekStrip'
import { OptionButton } from '../../components/OptionButton'
import { RuleCard } from '../../components/RuleCard'
import { PrimaryButton } from '../../components/PrimaryButton'
import type { ExecutionRule } from '../../types'

function timeToDate(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h ?? 9, m ?? 0, 0, 0)
  return d
}

function dateToTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatTime12(hhmm: string): { time: string; ampm: string } {
  const [hh, mm] = hhmm.split(':').map(Number)
  const isPm = (hh ?? 9) >= 12
  const display = (hh ?? 9) % 12 || 12
  return { time: `${display}:${String(mm ?? 0).padStart(2, '0')}`, ampm: isPm ? 'PM' : 'AM' }
}

export default function WeekScreen() {
  const { checkIns, weeklyResetDone, submitWeeklyReset, nonnegotiable } = useApp()
  const router = useRouter()
  const [resistanceId, setResistanceId] = useState<string | null>(null)
  const [fixId, setFixId] = useState<string | null>(null)
  const [triggerTime, setTriggerTime] = useState(nonnegotiable?.notificationTime ?? '09:00')
  const [showTimePicker, setShowTimePicker] = useState(false)

  const scrollRef = useRef<ScrollView>(null)
  const fixesY = useRef(0)
  const timeY = useRef(0)
  const pendingScroll = useRef<'fixes' | 'time' | null>(null)

  const scrollTo = (y: number) =>
    scrollRef.current?.scrollTo({ y: y - 24, animated: true })

  const weekKeys  = getWeekKeys()
  const completed = weekKeys.filter((k) => checkIns[k] === 'yes').length
  const pct       = completed / 7
  const isSunday  = new Date().getDay() === 0
  const isAvailable = isSunday || !weeklyResetDone

  const selectedResistance = RESISTANCE.find((r) => r.id === resistanceId) ?? null
  const selectedFix        = selectedResistance?.fixes.find((f) => f.id === fixId) ?? null

  const rule: ExecutionRule | undefined = selectedFix && nonnegotiable
    ? {
        trigger:          selectedFix.trigger,
        constraint:       selectedFix.constraint,
        action:           nonnegotiable.action,
        duration:         selectedFix.duration,
        notificationTime: triggerTime,
      }
    : undefined

  const handleSubmit = async () => {
    await submitWeeklyReset(selectedFix?.label ?? null, rule)
    setResistanceId(null)
    setFixId(null)
    router.push('/(tabs)/')
  }

  const pickResistance = (id: string) => {
    setResistanceId(id)
    setFixId(null)
    if (fixesY.current > 0) {
      setTimeout(() => scrollTo(fixesY.current), 50)
    } else {
      pendingScroll.current = 'fixes'
    }
  }

  const pickFix = (id: string) => {
    setFixId(id)
    setShowTimePicker(false)
    if (timeY.current > 0) {
      setTimeout(() => scrollTo(timeY.current), 50)
    } else {
      pendingScroll.current = 'time'
    }
  }

  const onTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false)
    if (date) setTriggerTime(dateToTime(date))
  }

  const { time: timeDisplay, ampm } = formatTime12(triggerTime)

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <EyebrowLabel style={{ marginBottom: 14 }}>Weekly Reset</EyebrowLabel>

        <View style={s.scoreRow}>
          <Text style={s.scoreNum}>{completed}</Text>
          <Text style={s.scoreTotal}>/ 7</Text>
        </View>

        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${pct * 100}%` as any }]} />
        </View>

        <WeekStrip checkIns={checkIns} />

        <View style={s.divider} />

        {isAvailable ? (
          <>
            <EyebrowLabel style={{ marginBottom: 10 }}>What got in the way?</EyebrowLabel>
            {RESISTANCE.map((r) => (
              <OptionButton
                key={r.id}
                label={r.label}
                active={resistanceId === r.id}
                onPress={() => pickResistance(r.id)}
              />
            ))}

            {selectedResistance && (
              <View onLayout={(e) => {
                fixesY.current = e.nativeEvent.layout.y
                if (pendingScroll.current === 'fixes') {
                  pendingScroll.current = null
                  scrollTo(fixesY.current)
                }
              }}>
                <EyebrowLabel style={{ marginTop: 24, marginBottom: 10 }}>Choose a fix</EyebrowLabel>
                {selectedResistance.fixes.map((f) => (
                  <OptionButton
                    key={f.id}
                    label={f.label}
                    active={fixId === f.id}
                    onPress={() => pickFix(f.id)}
                  />
                ))}
              </View>
            )}

            {selectedFix && (
              <View onLayout={(e) => {
                timeY.current = e.nativeEvent.layout.y
                if (pendingScroll.current === 'time') {
                  pendingScroll.current = null
                  scrollTo(timeY.current)
                }
              }}>
                <EyebrowLabel style={{ marginTop: 24, marginBottom: 10 }}>
                  When should we remind you?
                </EyebrowLabel>
                <Pressable
                  style={s.timeRow}
                  onPress={() => setShowTimePicker((v) => !v)}
                >
                  <View style={s.timeLeft}>
                    <Text style={s.timeLabel}>Trigger notification</Text>
                    <Text style={s.timeHint}>
                      We'll notify you at this time to do: {selectedFix.trigger.toLowerCase()}
                    </Text>
                  </View>
                  <View style={s.timeBadge}>
                    <Text style={s.timeBadgeText}>{timeDisplay}</Text>
                    <Text style={s.timeBadgeAmpm}>{ampm}</Text>
                  </View>
                </Pressable>

                {showTimePicker && (
                  <DateTimePicker
                    value={timeToDate(triggerTime)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                    themeVariant="dark"
                  />
                )}
                {Platform.OS === 'ios' && showTimePicker && (
                  <Pressable
                    style={s.timeConfirm}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={s.timeConfirmText}>Done</Text>
                  </Pressable>
                )}
              </View>
            )}

            {rule && (
              <>
                <EyebrowLabel style={{ marginTop: 24, marginBottom: 10 }}>Your new execution rule</EyebrowLabel>
                <RuleCard rule={rule} />
              </>
            )}

            <PrimaryButton
              label="Save rule & continue"
              onPress={handleSubmit}
              disabled={!rule}
              style={{ marginTop: 24 }}
            />
          </>
        ) : (
          <LockedCard rule={nonnegotiable?.executionRule} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function LockedCard({ rule }: { rule: ExecutionRule | undefined }) {
  return (
    <View style={s.lockedCard}>
      <Text style={s.lockedTitle}>Reset complete.</Text>
      <Text style={s.lockedSub}>Come back Sunday for your next weekly reset.</Text>
      {rule && (
        <>
          <EyebrowLabel style={{ marginTop: 18, marginBottom: 10 }}>Current execution rule</EyebrowLabel>
          <RuleCard rule={rule} />
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  scroll:        { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  scoreRow:      { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  scoreNum:      { fontSize: 64, fontWeight: '800', color: Colors.primary, lineHeight: 68 },
  scoreTotal:    { fontSize: 24, fontWeight: '300', color: Colors.secondary },
  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginVertical: 16 },
  progressFill:  { height: '100%', backgroundColor: Colors.accent, borderRadius: 2 },
  divider:       { height: 1, backgroundColor: Borders.card, marginTop: 28, marginBottom: 24 },
  lockedCard:    { padding: 5 },
  lockedTitle:   { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 6 },
  lockedSub:     { fontSize: 14, color: Colors.secondary, lineHeight: 22 },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  timeLeft:        { flex: 1 },
  timeLabel:       { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 3 },
  timeHint:        { fontSize: 11, color: Colors.secondary, lineHeight: 16 },
  timeBadge:       { alignItems: 'flex-end' },
  timeBadgeText:   { fontSize: 22, fontWeight: '700', color: Colors.primary },
  timeBadgeAmpm:   { fontSize: 11, fontWeight: '600', color: Colors.secondary, marginTop: 1 },
  timeConfirm:     { alignItems: 'flex-end', paddingTop: 8, paddingBottom: 4 },
  timeConfirmText: { fontSize: 15, fontWeight: '600', color: Colors.accent },
})
