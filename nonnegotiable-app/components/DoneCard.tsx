import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { Colors } from '../lib/colors'

type Props = { value: 'yes' | 'no' }

export function DoneCard({ value }: Props) {
  const isYes  = value === 'yes'
  const tint   = isYes ? Colors.success : Colors.failure
  const title  = isYes ? 'You showed up.'   : 'You missed today.'
  const sub    = isYes ? 'Come back tomorrow.' : 'Tomorrow is still there.'

  return (
    <View style={[s.card, { borderColor: tint + '35', backgroundColor: tint + '12' }]}>
      <View style={[s.icon, { backgroundColor: tint + '22' }]}>
        {isYes ? <CheckIcon /> : <CrossIcon />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{sub}</Text>
      </View>
    </View>
  )
}

function CheckIcon() {
  return (
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
  )
}

function CrossIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Path
        d="M1 1l10 10M11 1L1 11"
        stroke={Colors.failure}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  )
}

const s = StyleSheet.create({
  card:  { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderRadius: 14, padding: 18 },
  icon:  { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '600', color: Colors.primary, marginBottom: 2 },
  sub:   { fontSize: 12, color: Colors.secondary },
})
