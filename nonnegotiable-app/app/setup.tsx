import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../lib/AppContext'
import { C } from '../lib/colors'
import React from 'react'

export default function SetupScreen() {
  const { setNonnegotiable } = useApp()
  const [projectName, setProjectName] = useState('')
  const [action, setAction] = useState('')
  const [why, setWhy] = useState('')

  const canSubmit = projectName.trim() && action.trim() && why.trim()

  const onSubmit = async () => {
    if (!canSubmit) return
    await setNonnegotiable({
      projectName: projectName.trim(),
      action: action.trim(),
      why: why.trim(),
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.heading}>Define your{'\n'}nonnegotiable.</Text>
          <Text style={s.sub}>One project. One daily action. One reason.</Text>

          <Field
            label="Project name"
            placeholder="e.g. Writing my book"
            value={projectName}
            onChangeText={setProjectName}
          />
          <Field
            label="Non-negotiable action"
            placeholder="e.g. Write 500 words"
            value={action}
            onChangeText={setAction}
            multiline
          />
          <Field
            label="Why — one sentence"
            placeholder="e.g. Because I owe it to my future self."
            value={why}
            onChangeText={setWhy}
            multiline
          />

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              s.btn,
              !canSubmit && s.btnDisabled,
              pressed && { opacity: 0.72 },
            ]}
          >
            <Text style={s.btnText}>Commit</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
}: {
  label: string
  placeholder: string
  value: string
  onChangeText: (v: string) => void
  multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.secondary + '80'}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[s.input, multiline && s.inputMulti, focused && s.inputFocused]}
      />
    </View>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  sub: { fontSize: 14, color: C.secondary, lineHeight: 22, marginBottom: 36 },
  field: { marginBottom: 22 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: C.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  inputMulti: { minHeight: 78, textAlignVertical: 'top' },
  inputFocused: { borderColor: C.accent + '60' },
  btn: {
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  btnDisabled: { backgroundColor: C.card, opacity: 0.4 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
})
