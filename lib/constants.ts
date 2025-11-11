// Type definitions
export type RoomType = 'living-room' | 'bedroom' | 'office';
export type StylePreset = 'modern' | 'boho' | 'minimalist';
export type ColorTheme = 'warm' | 'cool' | 'neutral';
export type LightingMood = 'morning' | 'evening' | 'night';

// Room type options
export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'living-room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'office', label: 'Office' },
];

// Style preset options
export const STYLE_PRESETS: { value: StylePreset; label: string }[] = [
  { value: 'modern', label: 'Modern' },
  { value: 'boho', label: 'Boho' },
  { value: 'minimalist', label: 'Minimalist' },
];

// Color theme options
export const COLOR_THEMES: { value: ColorTheme; label: string }[] = [
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'neutral', label: 'Neutral' },
];

// Lighting mood options
export const LIGHTING_MOODS: { value: LightingMood; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

// Theme colors configuration
export const ThemeColors = {
  warm: {
    primary: '#D4A574',
    secondary: '#8B4513',
    accent: '#CD853F',
  },
  cool: {
    primary: '#4A90A4',
    secondary: '#2C5F75',
    accent: '#7FB3D5',
  },
  neutral: {
    primary: '#A8A8A8',
    secondary: '#5A5A5A',
    accent: '#D3D3D3',
  },
};

// Lighting configuration
export const LightingConfig = {
  morning: {
    ambientIntensity: 0.8,
    directionalIntensity: 1.0,
    directionalPosition: [5, 8, 3] as [number, number, number],
    color: '#FFF5E1',
  },
  evening: {
    ambientIntensity: 0.5,
    directionalIntensity: 0.7,
    directionalPosition: [3, 5, 5] as [number, number, number],
    color: '#FFB366',
  },
  night: {
    ambientIntensity: 0.3,
    directionalIntensity: 0.4,
    directionalPosition: [2, 6, 4] as [number, number, number],
    color: '#B0C4DE',
  },
};

// Material configuration
export const MaterialConfig = {
  modern: {
    roughness: 0.2,
    metalness: 0.5,
  },
  boho: {
    roughness: 0.8,
    metalness: 0.1,
  },
  minimalist: {
    roughness: 0.4,
    metalness: 0.2,
  },
};
