// components/ui/GradientText.tsx
import React from 'react'
import { Text, TextStyle } from 'react-native'
import { Colors } from '../../constants/theme'

interface GradientTextProps {
  children: string
  style?: TextStyle
}

// React Native doesn't natively support gradient text.
// We use a solid accent color that matches the gradient's mid-tone.
export default function GradientText({ children, style }: GradientTextProps) {
  return (
    <Text style={[{ color: Colors.accent.primary }, style]}>
      {children}
    </Text>
  )
}
