/**
 * Design tokens — aligned 1:1 with Eduplexo web semantic design tokens.
 * Supports both Light and Dark mode seamlessly.
 */

export const lightColors = {
  // Background & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceDim: '#F1F5F9',
  surfaceMuted: '#F8FAFC',
  surfaceHover: '#F1F5F9',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F8FAFC',
  surfaceContainer: '#F1F5F9',
  surfaceContainerHigh: '#E2E8F0',

  // Text
  onSurface: '#0F172A',
  onSurfaceVariant: '#475569',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textPlaceholder: '#CBD5E1',

  // Brand
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  primaryNavy: '#002045',
  primaryContainer: '#EFF6FF',

  // Semantic
  success: '#10B981',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Borders / Outlines
  border: '#E2E8F0',
  borderMuted: '#F1F5F9',
  outline: '#94A3B8',
  outlineVariant: '#CBD5E1',
  cardBorder: '#E2E8F0',
  rowHover: '#F8FAFC',

  // Pure
  white: '#FFFFFF',
  black: '#000000',

  // Gray scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const darkColors = {
  // Background & Surfaces
  background: '#0B0F17',
  surface: '#111827',
  surfaceDim: '#1F2937',
  surfaceMuted: '#1E293B',
  surfaceHover: '#334155',
  surfaceContainerLowest: '#0B0F17',
  surfaceContainerLow: '#111827',
  surfaceContainer: '#1F2937',
  surfaceContainerHigh: '#374151',

  // Text
  onSurface: '#F8FAFC',
  onSurfaceVariant: '#CBD5E1',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  textPlaceholder: '#475569',

  // Brand
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#1E3A8A',
  primaryNavy: '#60A5FA',
  primaryContainer: '#1E293B',

  // Semantic
  success: '#10B981',
  successLight: '#064E3B',
  error: '#EF4444',
  errorLight: '#7F1D1D',
  warning: '#F59E0B',
  warningLight: '#78350F',
  info: '#38BDF8',
  infoLight: '#0C4A6E',

  // Borders / Outlines
  border: '#1F2937',
  borderMuted: '#1E293B',
  outline: '#475569',
  outlineVariant: '#334155',
  cardBorder: '#1F2937',
  rowHover: '#1E293B',

  // Pure
  white: '#FFFFFF',
  black: '#000000',

  // Gray scale
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',
};

export type ThemeColors = typeof lightColors;

/** Default alias for backward compatibility */
export const colors = lightColors;

export function getThemeColors(mode: 'light' | 'dark'): ThemeColors {
  return mode === 'dark' ? darkColors : lightColors;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xl2: 32,
  xl3: 40,
  xl4: 48,
  xl5: 64,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: undefined as string | undefined,
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38, letterSpacing: -0.6 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26, letterSpacing: -0.2 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.4 },
  labelXs: { fontSize: 10, fontWeight: '700' as const, lineHeight: 14, letterSpacing: 0.6 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 14 },
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  primaryButton: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;
