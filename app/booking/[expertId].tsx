// app/booking/[expertId].tsx — Booking Form
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated'
import { format } from 'date-fns'

import GlassCard from '../../components/ui/GlassCard'
import GradientButton from '../../components/ui/GradientButton'
import { useBookings } from '../../hooks/useBookings'
import { Expert } from '../../constants/mockData'
import { Colors, Radius, Spacing } from '../../constants/theme'
import { api } from '../../services/api'
import { ActivityIndicator } from 'react-native'
// Need expo-router imported correctly
import { useRouter as useExpoRouter } from 'expo-router'

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-zA-Z\s]*$/, 'Only letters are allowed'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Enter a 10-digit phone number'),
  notes: z.string().max(300).optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

function FormField({
  control,
  name,
  label,
  icon,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  maxLength,
}: {
  control: any
  name: keyof BookingFormData
  label: string
  icon: keyof typeof Feather.glyphMap
  placeholder: string
  keyboardType?: any
  multiline?: boolean
  maxLength?: number
}) {
  const focusProgress = useSharedValue(0)

  const borderStyle = useAnimatedStyle(() => ({
    height: 2,
    backgroundColor: Colors.accent.primary,
    width: `${focusProgress.value * 100}%`,
    position: 'absolute',
    bottom: 0,
    left: 0,
  }))

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error, isDirty, isTouched } }) => {
        const isSuccess = !error && isDirty
        const hasError = !!error
        return (
          <View style={styles.fieldWrapper}>
            <GlassCard style={[styles.fieldCard, hasError && styles.fieldCardError]} disableAnimation>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{label}</Text>
                {isSuccess && <Feather name="check-circle" size={14} color={Colors.status.success} />}
              </View>
              <View style={styles.inputRow}>
                <Feather
                  name={icon}
                  size={18}
                  color={hasError ? Colors.status.error : Colors.text.muted}
                  style={styles.fieldIcon}
                />
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => {
                    focusProgress.value = withTiming(1, { duration: 300 })
                  }}
                  onBlur={() => {
                    focusProgress.value = withTiming(0, { duration: 300 })
                    onBlur()
                  }}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.text.muted}
                  keyboardType={keyboardType}
                  multiline={multiline}
                  maxLength={maxLength}
                  style={[styles.input, multiline && styles.inputMultiline]}
                  numberOfLines={multiline ? 4 : 1}
                  textAlignVertical={multiline ? 'top' : 'center'}
                />
              </View>
              <Animated.View style={borderStyle} />
            </GlassCard>
            {hasError && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )
      }}
    />
  )
}

export default function BookingForm() {
  const router = useExpoRouter()
  const insets = useSafeAreaInsets()
  const { expertId, date, slot } = useLocalSearchParams<{ expertId: string; date: string; slot: string }>()
  const { addBooking } = useBookings()

  const [expert, setExpert] = useState<Expert | null>(null)
  const [loadingExpert, setLoadingExpert] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    async function fetchExpert() {
      try {
        const response = await api.get(`/experts/${expertId}`)
        if (response.data.success) {
          setExpert(response.data.data.expert)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingExpert(false)
      }
    }
    fetchExpert()
  }, [expertId])

  // Success animation
  const checkStroke = useSharedValue(0)

  const { control, handleSubmit } = useForm<BookingFormData>({
    mode: 'onChange',
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: '', email: '', phone: '', notes: '' },
  })

  const formattedDate = (() => {
    try {
      return format(new Date(date), 'EEEE, MMMM d')
    } catch {
      return date
    }
  })()

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      await addBooking({
        expertId: expert?._id,
        userName: data.name,
        userEmail: data.email,
        userPhone: data.phone,
        date,
        timeSlot: slot,
        notes: data.notes ?? '',
      })

      setIsSubmitting(false)
      setIsSuccess(true)
      checkStroke.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 800 })
      )
    } catch (error: any) {
      setIsSubmitting(false)
      alert(error?.message || 'Failed to book the slot. It might be taken.')
    }
  }

  if (loadingExpert) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
      </View>
    )
  }

  if (!expert) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.text.primary }}>Expert not found</Text>
      </View>
    )
  }

  if (isSuccess) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <View style={styles.successIconWrapper}>
          <Feather name="check-circle" size={80} color={Colors.status.success} />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed! 🎉</Text>
        <Text style={styles.successSubtitle}>
          You're all set. {expert.name.split(' ')[0]} will see you on {format(new Date(date), 'EEE, MMM d')} at {slot}
        </Text>

        <GlassCard style={styles.summaryCard} disableAnimation>
          <View style={styles.summaryAccent} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Session Details</Text>
            <View style={styles.summaryItem}>
              <Feather name="calendar" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>{formattedDate}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="clock" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>{slot}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="credit-card" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>${expert.hourlyRate} for 60 min</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.successActions}>
          <GradientButton
            label="View My Bookings"
            onPress={() => {
              router.dismissAll()
              router.replace('/(tabs)/bookings')
            }}
            size="lg"
          />
          <GradientButton
            label="Book Another Session"
            onPress={() => {
              router.dismissAll()
              router.replace('/(tabs)')
            }}
            size="lg"
            ghost
          />
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} disabled={isSubmitting}>
            <Feather name="chevron-left" size={24} color={Colors.accent.primary} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Book Session</Text>
            <Text style={styles.headerSubtitle}>with {expert.name}</Text>
          </View>
        </View>

        {/* Booking Summary Card */}
        <GlassCard style={styles.summaryCard} disableAnimation>
          <View style={styles.summaryAccent} />
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Feather name="calendar" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>{formattedDate}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="clock" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>{slot}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="dollar-sign" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>${expert.hourlyRate} for 60 min</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="user" size={16} color={Colors.text.muted} />
              <Text style={styles.summaryText}>{expert.name}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Form Fields */}
        <View style={styles.form}>
          <FormField
            control={control}
            name="name"
            label="Full Name"
            icon="user"
            placeholder="John Doe"
          />
          <FormField
            control={control}
            name="email"
            label="Email Address"
            icon="mail"
            placeholder="john@example.com"
            keyboardType="email-address"
          />
          <FormField
            control={control}
            name="phone"
            label="Phone Number"
            icon="phone"
            placeholder="1234567890"
            keyboardType="phone-pad"
            maxLength={10}
          />
          <FormField
            control={control}
            name="notes"
            label="Session Notes (Optional)"
            icon="edit-2"
            placeholder="What would you like to discuss?"
            multiline
          />
        </View>

        {/* Submit */}
        <View style={styles.submitSection}>
          <GradientButton
            label="Confirm Booking"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            size="lg"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  summaryCard: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  summaryAccent: {
    width: 4,
    backgroundColor: Colors.accent.primary,
  },
  summaryContent: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  summaryText: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  summaryLabel: {
    color: Colors.text.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  form: {
    gap: Spacing.lg,
  },
  fieldWrapper: {
    gap: 6,
  },
  fieldCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 8,
    overflow: 'hidden',
  },
  fieldCardError: {
    borderColor: Colors.status.error,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    color: Colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fieldIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: 16,
    padding: 0,
  },
  inputMultiline: {
    height: 80,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: 12,
    marginLeft: 4,
  },
  submitSection: {
    marginTop: Spacing.xxl,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  successIconWrapper: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
  },
  successActions: {
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
})
