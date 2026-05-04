import React, { useState } from 'react'
import {
  View, Text,
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../lib/AppContext'
import { Colors } from '../lib/colors'
import { Field } from '../components/Field'
import { PrimaryButton } from '../components/PrimaryButton'

export default function SetupScreen() {
  const { setNonnegotiable } = useApp()
  const [projectName, setProjectName] = useState('')
  const [action, setAction]           = useState('')
  const [bareMinimum, setBareMinimum] = useState('')
  const [why, setWhy]                 = useState('')

  const canSubmit = !!(projectName.trim() && action.trim() && why.trim())

  const onSubmit = async () => {
    if (!canSubmit) return
    await setNonnegotiable({
      projectName: projectName.trim(),
      action: action.trim(),
      bareMinimum: bareMinimum.trim() || undefined,
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
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.heading}>Define your{'\n'}nonnegotiable.</Text>
          <Text style={s.sub}>One project. One daily action. One reason.</Text>

          <Field label="Project name"          placeholder="e.g. Writing my book"                 value={projectName} onChangeText={setProjectName} />
          <Field label="Non-negotiable action" placeholder="e.g. Write 500 words"                 value={action}      onChangeText={setAction}      multiline />
          <Field label="Bare minimum"          placeholder="e.g. Open the doc and write one sentence" value={bareMinimum} onChangeText={setBareMinimum} multiline />
          <Field label="Why — one sentence"    placeholder="e.g. Because I owe it to my future self" value={why}         onChangeText={setWhy}         multiline />

          <PrimaryButton
            label="Commit"
            variant="accent"
            onPress={onSubmit}
            disabled={!canSubmit}
            style={{ marginTop: 12 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  scroll:  { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  heading: { fontSize: 26, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5, lineHeight: 32, marginBottom: 8 },
  sub:     { fontSize: 14, color: Colors.secondary, lineHeight: 22, marginBottom: 36 },
})
