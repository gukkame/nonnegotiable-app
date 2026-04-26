import React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { Colors } from '../lib/colors'
import { Borders, cardSurface } from '../lib/theme'

type Props = {
  label: string
  active: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export function OptionButton({ label, active, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.option, active && s.optionActive, style]}
    >
      <Text style={[s.text, active && s.textActive]}>{label}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  option:       { ...cardSurface, padding: 14, marginBottom: 8 },
  optionActive: { borderColor: Borders.active, backgroundColor: Colors.accent + '14' },
  text:         { fontSize: 15, color: Colors.secondary },
  textActive:   { color: Colors.primary, fontWeight: '500' },
})
