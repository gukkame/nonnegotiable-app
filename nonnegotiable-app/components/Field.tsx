import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Colors } from '../lib/colors'
import { Borders, eyebrowText, cardSurface } from '../lib/theme'

type Props = {
  label: string
  placeholder: string
  value: string
  onChangeText: (v: string) => void
  multiline?: boolean
}

export function Field({ label, placeholder, value, onChangeText, multiline }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={s.field}>
      <Text style={[eyebrowText, { marginBottom: 8 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.secondary + '80'}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          s.input,
          multiline && s.inputMulti,
          focused && { borderColor: Colors.accent + '60' },
        ]}
      />
    </View>
  )
}

const s = StyleSheet.create({
  field:      { marginBottom: 22 },
  input:      { ...cardSurface, paddingHorizontal: 16, paddingVertical: 16, color: Colors.primary, fontSize: 16, lineHeight: 24 },
  inputMulti: { minHeight: 78, textAlignVertical: 'top' },
})
