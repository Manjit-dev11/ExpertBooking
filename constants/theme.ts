// constants/theme.ts

export const Colors = {
  bg: {
    primary: '#080808',
    secondary: '#111111',
    card: 'rgba(255,255,255,0.04)',
    cardHover: 'rgba(255,255,255,0.07)',
    input: 'rgba(255,255,255,0.06)',
  },
  accent: {
    primary: '#FF4500',
    secondary: '#FF6B35',
    glow: 'rgba(255,69,0,0.3)',
    glowStrong: 'rgba(255,69,0,0.5)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#888888',
    muted: '#444444',
    inverse: '#000000',
  },
  status: {
    success: '#00D4AA',
    successBg: 'rgba(0,212,170,0.12)',
    warning: '#FFB800',
    warningBg: 'rgba(255,184,0,0.12)',
    error: '#FF3B3B',
    errorBg: 'rgba(255,59,59,0.12)',
    pending: '#FF9500',
    pendingBg: 'rgba(255,149,0,0.12)',
  },
  border: {
    default: 'rgba(255,255,255,0.07)',
    active: 'rgba(255,69,0,0.6)',
    subtle: 'rgba(255,255,255,0.04)',
  },
}

export const Gradients = {
  accent: ['#FF4500', '#FF6B35'] as [string, string],
  accentReverse: ['#FF6B35', '#FF4500'] as [string, string],
  card: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'] as [string, string],
  dark: ['#111111', '#080808'] as [string, string],
  overlay: ['transparent', 'rgba(8,8,8,0.95)'] as [string, string],
  glow: ['rgba(255,69,0,0)', 'rgba(255,69,0,0.15)'] as [string, string],
}

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
}

export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 999,
}

export const Shadow = {
  glow: {
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
}

export const Typography = {
  display: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.2 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodySmall: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.8 },
}
