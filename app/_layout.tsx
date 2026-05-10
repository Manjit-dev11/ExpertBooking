// app/_layout.tsx
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import * as SplashScreen from 'expo-splash-screen'
import { Colors } from '../constants/theme'
import AnimatedSplashScreen from '../components/common/AnimatedSplashScreen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.bg.primary} />
        
        {!isSplashAnimationComplete && (
          <AnimatedSplashScreen 
            onAnimationComplete={() => setSplashAnimationComplete(true)} 
          />
        )}

        {isSplashAnimationComplete && (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.bg.primary },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="expert/[id]"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="booking/[expertId]"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        )}
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
