// Generated from TOKENS_EXTRACT.md (Tasks 6 & 7)
// Do not edit directly; adjust source tokens and regenerate.

export const colors = {
  brandPrimary: '#40E0D0',
  brandPrimaryPressed: '#27B5A8',
  brandPrimarySubtle: '#E0FBF8',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F7F8',
  borderDefault: '#E2E5E7',
  borderStrong: '#C7CBCE',
  divider: '#E9ECEE',
  focusRing: '#40E0D0',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textDisabled: '#A0A6AA',
  textInverted: '#FFFFFF',
  success: '#4CAF50',
  successBg: '#E6F7E7',
  warning: '#FFB300',
  warningBg: '#FFF4D6',
  error: '#F44336',
  errorBg: '#FDECEA',
  overlayScrim: 'rgba(0,0,0,0.40)',
  skeletonBase: '#E0E0E0',
  skeletonHighlight: '#F5F5F5'
} as const;

export type StateVariantRecord<T extends Record<string, string>> = { [K in keyof T]: string };
export interface ThemedStateColors {
  buttonPrimaryBg: { default: string; pressed: string; disabled: string };
  buttonSecondaryBorder: { default: string; pressed: string; disabled: string };
  inputBorder: { default: string; focus: string; error: string };
  inputBg: { default: string; disabled: string };
  slider: { track: string; active: string; thumb: string };
}

export const lightStateColors: ThemedStateColors = {
  buttonPrimaryBg: { default: '#40E0D0', pressed: '#27B5A8', disabled: '#A0EDE4' },
  buttonSecondaryBorder: { default: '#40E0D0', pressed: '#27B5A8', disabled: '#A0EDE4' },
  inputBorder: { default: '#C7CBCE', focus: '#40E0D0', error: '#F44336' },
  inputBg: { default: '#FFFFFF', disabled: '#F0F2F3' },
  slider: { track: '#E2E5E7', active: '#40E0D0', thumb: '#40E0D0' },
};

export const darkStateColors: ThemedStateColors = {
  buttonPrimaryBg: { default: '#40E0D0', pressed: '#27B5A8', disabled: '#225E59' },
  buttonSecondaryBorder: { default: '#40E0D0', pressed: '#27B5A8', disabled: '#225E59' },
  inputBorder: { default: '#394044', focus: '#40E0D0', error: '#F44336' },
  inputBg: { default: '#181B1C', disabled: '#24282A' },
  slider: { track: '#2A2F32', active: '#40E0D0', thumb: '#40E0D0' },
};

export interface TypographyScaleItem {
  family: string; weight: number; size: number; lineHeight: number; letterSpacing: number;
}
export const typography: Record<string, TypographyScaleItem> = {
  H1: { family: 'Roboto', weight: 700, size: 24, lineHeight: 32, letterSpacing: 0 },
  H2: { family: 'Roboto', weight: 700, size: 22, lineHeight: 30, letterSpacing: 0 },
  H3: { family: 'Roboto', weight: 600, size: 20, lineHeight: 28, letterSpacing: 0 },
  H4: { family: 'Roboto', weight: 600, size: 18, lineHeight: 24, letterSpacing: 0 },
  Body: { family: 'Roboto', weight: 400, size: 16, lineHeight: 24, letterSpacing: 0 },
  BodyBold: { family: 'Roboto', weight: 600, size: 16, lineHeight: 24, letterSpacing: 0 },
  Small: { family: 'Roboto', weight: 400, size: 14, lineHeight: 20, letterSpacing: 0 },
  SmallBold: { family: 'Roboto', weight: 600, size: 14, lineHeight: 20, letterSpacing: 0 },
  Caption: { family: 'Roboto', weight: 400, size: 12, lineHeight: 16, letterSpacing: 0 },
  Button: { family: 'Roboto', weight: 600, size: 16, lineHeight: 20, letterSpacing: 0 }
};

export const spacing = [0,4,8,12,16,20,24,32] as const;
export const radii = { sm:4, md:8, lg:16, pill:999 } as const;
export const elevation = {
  1: { ios: { x:0, y:1, blur:2, spread:0, color:'rgba(0,0,0,0.08)' }, android:1 },
  2: { ios: { x:0, y:2, blur:4, spread:0, color:'rgba(0,0,0,0.10)' }, android:2 },
  3: { ios: { x:0, y:4, blur:8, spread:0, color:'rgba(0,0,0,0.12)' }, android:4 }
} as const;
export const icons = { default:24, large:48, stroke:2 } as const;
export const motion = { fast:150, standard:250, easingStandard:'cubic-bezier(0.4,0,0.2,1)' } as const;

export type ThemeColors = {
  [K in keyof typeof colors]: string;
};

// redefine base colors as ThemeColors for flexibility
export const lightColors: ThemeColors = { ...colors };

export const darkColors: ThemeColors = {
  brandPrimary: '#40E0D0',
  brandPrimaryPressed: '#27B5A8',
  brandPrimarySubtle: '#123F3B',
  background: '#0E1112',
  surface: '#181B1C',
  surfaceAlt: '#1F2325',
  borderDefault: '#2A2F32',
  borderStrong: '#394044',
  divider: '#25292B',
  focusRing: '#40E0D0',
  textPrimary: '#F3F5F6',
  textSecondary: '#B5BDC1',
  textDisabled: '#6A7378',
  textInverted: '#0E1112',
  success: '#4CAF50',
  successBg: '#1D3A1E',
  warning: '#FFB300',
  warningBg: '#3A2E12',
  error: '#F44336',
  errorBg: '#3C1E1B',
  overlayScrim: 'rgba(0,0,0,0.60)',
  skeletonBase: '#2A2F32',
  skeletonHighlight: '#343A3E'
};

export interface Theme {
  colors: ThemeColors;
  state: ThemedStateColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  elevation: typeof elevation;
  icons: typeof icons;
  motion: typeof motion;
}

export const baseTheme: Theme = {
  colors: lightColors,
  state: lightStateColors,
  typography,
  spacing,
  radii,
  elevation,
  icons,
  motion,
};

export const darkTheme: Theme = {
  colors: darkColors,
  state: darkStateColors,
  typography,
  spacing,
  radii,
  elevation,
  icons,
  motion,
};
