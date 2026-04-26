import React from 'react'
import { Pressable, Text, Alert, StyleSheet } from 'react-native'

type Props = {
  label?: string
  title?: string
  message?: string
  onConfirm: () => void
}

export function ResetLink({
  label = 'Reset project',
  title = 'Reset project?',
  message = 'This clears your nonnegotiable and all check-ins.',
  onConfirm,
}: Props) {
  const confirm = () =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset',  style: 'destructive', onPress: onConfirm },
    ])

  return (
    <Pressable style={s.link} onPress={confirm}>
      <Text style={s.text}>{label}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  link: { alignItems: 'center', paddingTop: 16 },
  text: { fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: 0.5 },
})
