// hooks/useHaptics.ts
import * as Haptics from 'expo-haptics'

export function useHaptics() {
  const impact = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    try {
      await Haptics.impactAsync(style)
    } catch {}
  }

  const notification = async (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    try {
      await Haptics.notificationAsync(type)
    } catch {}
  }

  const selection = async () => {
    try {
      await Haptics.selectionAsync()
    } catch {}
  }

  return { impact, notification, selection }
}
