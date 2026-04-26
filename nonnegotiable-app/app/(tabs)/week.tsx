import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
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

export default function WeekScreen() {
  const { checkIns, weeklyResetDone, submitWeeklyReset, nonnegotiable } = useApp()
  const router = useRouter()
  const [resistanceId, setResistanceId] = useState<string | null>(null)
  const [fixId, setFixId] = useState<string | null>(null)

  const weekKeys  = getWeekKeys()
  const completed = weekKeys.filter((k) => checkIns[k] === 'yes').length
  const pct       = completed / 7
  const isSunday  = new Date().getDay() === 0
  const isAvailable = isSunday || !weeklyResetDone

  const selectedResistance = RESISTANCE.find((r) => r.id === resistanceId) ?? null
  const selectedFix        = selectedResistance?.fixes.find((f) => f.id === fixId) ?? null

  const rule: ExecutionRule | undefined = selectedFix && nonnegotiable
    ? {
        trigger:    selectedFix.trigger,
        constraint: selectedFix.constraint,
        action:     nonnegotiable.action,
        duration:   selectedFix.duration,
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
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
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
          <ResetForm
            resistanceId={resistanceId}
            fixId={fixId}
            onPickResistance={pickResistance}
            onPickFix={setFixId}
            rule={rule}
            onSubmit={handleSubmit}
            selectedResistance={selectedResistance}
          />
        ) : (
          <LockedCard rule={nonnegotiable?.executionRule} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

type FormProps = {
  resistanceId: string | null
  fixId: string | null
  onPickResistance: (id: string) => void
  onPickFix: (id: string) => void
  rule: ExecutionRule | undefined
  onSubmit: () => void
  selectedResistance: typeof RESISTANCE[number] | null
}

function ResetForm({
  resistanceId, fixId, onPickResistance, onPickFix, rule, onSubmit, selectedResistance,
}: FormProps) {
  return (
    <>
      <EyebrowLabel style={{ marginBottom: 10 }}>What got in the way?</EyebrowLabel>
      {RESISTANCE.map((r) => (
        <OptionButton
          key={r.id}
          label={r.label}
          active={resistanceId === r.id}
          onPress={() => onPickResistance(r.id)}
        />
      ))}

      {selectedResistance && (
        <>
          <EyebrowLabel style={{ marginTop: 24, marginBottom: 10 }}>Choose a fix</EyebrowLabel>
          {selectedResistance.fixes.map((f) => (
            <OptionButton
              key={f.id}
              label={f.label}
              active={fixId === f.id}
              onPress={() => onPickFix(f.id)}
            />
          ))}
        </>
      )}

      {rule && (
        <>
          <EyebrowLabel style={{ marginTop: 24, marginBottom: 10 }}>Your new execution rule</EyebrowLabel>
          <RuleCard rule={rule} />
        </>
      )}

      <PrimaryButton
        label="Save rule & continue"
        onPress={onSubmit}
        disabled={!rule}
        style={{ marginTop: 24 }}
      />
    </>
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
  lockedCard:    { borderWidth: 1, borderColor: Borders.card, borderRadius: 14, padding: 20 },
  lockedTitle:   { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 6 },
  lockedSub:     { fontSize: 14, color: Colors.secondary, lineHeight: 22 },
})
