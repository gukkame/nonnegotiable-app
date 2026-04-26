import React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { Colors } from '../lib/colors'

type Variant = 'accent' | 'dark'

type Props = {
  label: string
  onPress: () => void
  disabled?: boolean
  variant?: Variant
  style?: StyleProp<ViewStyle>
}

export function PrimaryButton({ label, onPress, disabled, variant = 'dark', style }: Props) {
  const bg = variant === 'accent' ? Colors.accent : '#1f1f23'
  const fg = variant === 'accent' ? '#fff' : Colors.primary

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[s.btn, { backgroundColor: bg }, disabled && s.disabled, style]}
    >
      <Text style={[s.text, { color: fg }]}>{label}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  btn:      { borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  disabled: { opacity: 0.4 },
  text:     { fontSize: 16, fontWeight: '600' },
})
