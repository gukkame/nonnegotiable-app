import { TextStyle, ViewStyle } from 'react-native'
import { Colors } from './colors'

export const Borders = {
  card:    'rgba(255,255,255,0.07)',
  subtle:  'rgba(255,255,255,0.06)',
  faint:   'rgba(255,255,255,0.10)',
  active:  Colors.accent + '55',
} as const

export const eyebrowText: TextStyle = {
  fontSize: 11,
  fontWeight: '600',
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: Colors.secondary,
}

export const cardSurface: ViewStyle = {
  backgroundColor: Colors.card,
  borderWidth: 1,
  borderColor: Borders.card,
  borderRadius: 12,
}
