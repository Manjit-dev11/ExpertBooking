import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  onAnimationComplete: () => void;
}

export default function AnimatedSplashScreen({ onAnimationComplete }: Props) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    // 1. Pop in the logo/icon
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    // 2. Fade in and slide up the text
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));

    // 3. Fade out the whole screen
    opacity.value = withDelay(
      2500,
      withTiming(0, { duration: 500 }, (isFinished) => {
        if (isFinished) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Animated.View style={animatedContainerStyle}>
      <LinearGradient
        colors={[Colors.bg.primary, '#1a1a2e']}
        style={styles.container}
      >
        <Animated.View style={[styles.imageContainer, animatedLogoStyle]}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </Animated.View>
        <Animated.View style={[styles.textContainer, animatedTextStyle]}>
          <Text style={styles.title}>ExpertBooking</Text>
          <Text style={styles.subtitle}>Find your perfect expert</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
