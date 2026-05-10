import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
  const scale = useSharedValue(0.4);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(24);
  const dotOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Pop in the logo badge
    scale.value = withSpring(1, { damping: 10, stiffness: 80 });

    // 2. Fade in the animated dot indicator
    dotOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

    // 3. Slide up the text
    textOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(500, withTiming(0, { duration: 600 }));

    // 4. Fade out entire screen
    opacity.value = withDelay(
      2600,
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

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return (
    <Animated.View style={animatedContainerStyle}>
      <LinearGradient
        colors={[Colors.bg.primary, '#0d0d1a']}
        style={styles.container}
      >
        {/* Animated letter badge instead of image */}
        <Animated.View style={[styles.badgeContainer, animatedBadgeStyle]}>
          <LinearGradient
            colors={['#FF4500', '#FF6B35']}
            style={styles.badge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.badgeLetter}>EB</Text>
          </LinearGradient>
          {/* Glow ring */}
          <View style={styles.glowRing} />
        </Animated.View>

        {/* Animated dot row */}
        <Animated.View style={[styles.dotRow, animatedDotStyle]}>
          <View style={[styles.dot, { opacity: 0.4 }]} />
          <View style={[styles.dot, { opacity: 0.7 }]} />
          <View style={styles.dot} />
        </Animated.View>

        {/* Text block */}
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
    gap: 20,
  },
  badgeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badge: {
    width: 110,
    height: 110,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  badgeLetter: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4500',
  },
  textContainer: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    letterSpacing: 0.2,
  },
});
