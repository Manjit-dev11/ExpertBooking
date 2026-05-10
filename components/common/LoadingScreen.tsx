import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ message = 'Loading...', fullScreen = false }: Props) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={[
        styles.container, 
        fullScreen && StyleSheet.absoluteFillObject,
        fullScreen && { zIndex: 999, backgroundColor: 'rgba(10, 10, 15, 0.85)' }
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg.primary,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: Colors.bg.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
});
