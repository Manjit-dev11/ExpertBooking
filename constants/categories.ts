// constants/categories.ts
import { Colors } from './theme'

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Tech: {
    bg: 'rgba(99,102,241,0.15)',
    text: '#818CF8',
    border: 'rgba(99,102,241,0.3)',
  },
  Design: {
    bg: 'rgba(236,72,153,0.15)',
    text: '#F472B6',
    border: 'rgba(236,72,153,0.3)',
  },
  Business: {
    bg: 'rgba(245,158,11,0.15)',
    text: '#FCD34D',
    border: 'rgba(245,158,11,0.3)',
  },
  Marketing: {
    bg: 'rgba(16,185,129,0.15)',
    text: '#34D399',
    border: 'rgba(16,185,129,0.3)',
  },
  Finance: {
    bg: 'rgba(59,130,246,0.15)',
    text: '#60A5FA',
    border: 'rgba(59,130,246,0.3)',
  },
  Health: {
    bg: 'rgba(0,212,170,0.15)',
    text: Colors.status.success,
    border: 'rgba(0,212,170,0.3)',
  },
  All: {
    bg: Colors.bg.card,
    text: Colors.text.secondary,
    border: Colors.border.default,
  },
}

export const CATEGORY_EMOJI: Record<string, string> = {
  Tech: '💻',
  Design: '🎨',
  Business: '📊',
  Marketing: '📣',
  Finance: '💰',
  Health: '🧘',
  All: '🌐',
}
