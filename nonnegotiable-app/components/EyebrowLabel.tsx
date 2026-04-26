import React from 'react'
import { Text, TextStyle, StyleProp } from 'react-native'
import { Colors } from '../lib/colors'
import { eyebrowText } from '../lib/theme'

type Props = {
  children: React.ReactNode
  accent?: boolean
  style?: StyleProp<TextStyle>
}

export function EyebrowLabel({ children, accent, style }: Props) {
  return (
    <Text style={[eyebrowText, accent && { color: Colors.accent }, style]}>
      {children}
    </Text>
  )
}
