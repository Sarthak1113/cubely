import type { CubeColor } from './cubeState';

export type PaletteId = 'candy' | 'neon' | 'sunset' | 'monochrome';
export type ThemeId = 'warm-light' | 'clean-studio' | 'midnight-velvet' | 'blush-sand' | 'live-gradient';

export interface CubePalette {
  id: PaletteId;
  name: string;
  description: string;
  colors: Record<CubeColor, string>;
}

export interface BackgroundTheme {
  id: ThemeId;
  name: string;
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  pillBg: string;
  canvasClear: string;
  isDark: boolean;
  isGradient?: boolean;
}

export const CUBE_PALETTES: Record<PaletteId, CubePalette> = {
  candy: {
    id: 'candy',
    name: 'Candy Playground',
    description: 'Playful confectionery pinks, apricots, and lilacs',
    colors: {
      red: '#FF70A6',
      orange: '#FF9770',
      yellow: '#FFD670',
      green: '#C5F870',
      blue: '#9D79FF',
      white: '#FFFFFF',
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Pop',
    description: 'Electrifying, saturated tones with high contrast',
    colors: {
      red: '#FF2A6D',
      orange: '#FF8C00',
      yellow: '#FFEE00',
      green: '#05FFA1',
      blue: '#007BFF',
      white: '#FFFFFF',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Mirage',
    description: 'Warm golden hour gradients and dusk horizon shades',
    colors: {
      red: '#E63946',
      orange: '#F4A261',
      yellow: '#E9C46A',
      green: '#2A9D8F',
      blue: '#264653',
      white: '#F8F9FA',
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Studio Slate',
    description: 'Sophisticated grayscale tones for minimalist sculpture aesthetics',
    colors: {
      red: '#262626',
      orange: '#4B5563',
      yellow: '#71717A',
      green: '#A1A1AA',
      blue: '#D4D4D8',
      white: '#FFFFFF',
    },
  },
};

export const BACKGROUND_THEMES: Record<ThemeId, BackgroundTheme> = {
  'warm-light': {
    id: 'warm-light',
    name: 'Warm Paper',
    bg: '#FAFAF8',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    text: '#171717',
    textSecondary: '#666666',
    border: '#E8E8E4',
    pillBg: 'rgba(242, 242, 238, 0.9)',
    canvasClear: '#FAFAF8',
    isDark: false,
    isGradient: false,
  },
  'live-gradient': {
    id: 'live-gradient',
    name: 'Live Aurora',
    bg: 'linear-gradient(135deg, #FFE8E0, #F3E6FF, #E2F0FE, #E4F9F2)',
    cardBg: 'rgba(255, 255, 255, 0.82)',
    text: '#1C1917',
    textSecondary: '#57534E',
    border: 'rgba(0, 0, 0, 0.08)',
    pillBg: 'rgba(255, 255, 255, 0.88)',
    canvasClear: 'transparent',
    isDark: false,
    isGradient: true,
  },
  'clean-studio': {
    id: 'clean-studio',
    name: 'Studio Gray',
    bg: '#F3F4F6',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    text: '#111827',
    textSecondary: '#4B5563',
    border: '#E5E7EB',
    pillBg: 'rgba(235, 238, 242, 0.9)',
    canvasClear: '#F3F4F6',
    isDark: false,
    isGradient: false,
  },
  'blush-sand': {
    id: 'blush-sand',
    name: 'Blush Sand',
    bg: '#F7F3EE',
    cardBg: 'rgba(255, 253, 250, 0.9)',
    text: '#292524',
    textSecondary: '#57534E',
    border: '#E7E1D8',
    pillBg: 'rgba(240, 234, 226, 0.9)',
    canvasClear: '#F7F3EE',
    isDark: false,
    isGradient: false,
  },
  'midnight-velvet': {
    id: 'midnight-velvet',
    name: 'Midnight',
    bg: '#101116',
    cardBg: 'rgba(22, 24, 31, 0.88)',
    text: '#F4F4F5',
    textSecondary: '#A1A1AA',
    border: 'rgba(255, 255, 255, 0.12)',
    pillBg: 'rgba(30, 32, 42, 0.85)',
    canvasClear: '#101116',
    isDark: true,
    isGradient: false,
  },
};
