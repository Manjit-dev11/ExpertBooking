// components/common/SearchBar.tsx
import React, { useRef } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { Colors, Radius, Spacing } from '../../constants/theme'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search experts...' }: SearchBarProps) {
  const borderOpacity = useSharedValue(0)
  const clearOpacity = useSharedValue(0)
  const inputRef = useRef<TextInput>(null)

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(255,69,0,${borderOpacity.value})`,
    borderWidth: 1.5,
  }))

  const clearStyle = useAnimatedStyle(() => ({
    opacity: clearOpacity.value,
  }))

  const handleFocus = () => {
    borderOpacity.value = withTiming(0.7, { duration: 200 })
  }

  const handleBlur = () => {
    borderOpacity.value = withTiming(0, { duration: 200 })
  }

  const handleChange = (text: string) => {
    onChangeText(text)
    clearOpacity.value = withTiming(text.length > 0 ? 1 : 0, { duration: 150 })
  }

  const handleClear = () => {
    onChangeText('')
    clearOpacity.value = withTiming(0, { duration: 150 })
    inputRef.current?.focus()
  }

  return (
    <Animated.View style={[styles.container, borderStyle]}>
      <Feather name="search" size={18} color={Colors.accent.primary} style={styles.icon} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.muted}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never"
      />
      <Animated.View style={clearStyle}>
        <Pressable onPress={handleClear} style={styles.clearBtn} hitSlop={8}>
          <Feather name="x-circle" size={16} color={Colors.text.muted} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.input,
    borderRadius: Radius.full,
    height: 52,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: 15,
    height: '100%',
  },
  clearBtn: {
    padding: 2,
  },
})
