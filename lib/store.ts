import { create } from 'zustand';
import { isLocalStorageAvailable } from './browser-compat';

// Type definitions
export type RoomType = 'living-room' | 'bedroom' | 'office';
export type StylePreset = 'modern' | 'boho' | 'minimalist';
export type ColorTheme = 'warm' | 'cool' | 'neutral';
export type LightingMood = 'morning' | 'evening' | 'night';

// Storage configuration
const STORAGE_KEY = 'smart-interior-config';
const STORAGE_VERSION = '1.0';
const DEBOUNCE_DELAY = 500;

// Interface for stored configuration
interface StoredConfig {
  version: string;
  roomType: RoomType;
  stylePreset: StylePreset;
  colorTheme: ColorTheme;
  lightingMood: LightingMood;
  lastUpdated: number;
}

// Default configuration
const defaultConfig = {
  roomType: 'living-room' as RoomType,
  stylePreset: 'modern' as StylePreset,
  colorTheme: 'warm' as ColorTheme,
  lightingMood: 'morning' as LightingMood,
};

// Debounce timer
let saveTimer: NodeJS.Timeout | null = null;

// DesignStore interface
export interface DesignStore {
  // State properties
  roomType: RoomType;
  stylePreset: StylePreset;
  colorTheme: ColorTheme;
  lightingMood: LightingMood;

  // Action methods
  setRoomType: (type: RoomType) => void;
  setStylePreset: (preset: StylePreset) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setLightingMood: (mood: LightingMood) => void;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

// Helper function to save to localStorage with debouncing
const debouncedSave = (state: DesignStore) => {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    state.saveToLocalStorage();
  }, DEBOUNCE_DELAY);
};

// Create Zustand store
export const useStore = create<DesignStore>((set, get) => ({
  // Initial state
  ...defaultConfig,

  // Action: Set room type
  setRoomType: (type: RoomType) => {
    set({ roomType: type });
    debouncedSave(get());
  },

  // Action: Set style preset
  setStylePreset: (preset: StylePreset) => {
    set({ stylePreset: preset });
    debouncedSave(get());
  },

  // Action: Set color theme
  setColorTheme: (theme: ColorTheme) => {
    set({ colorTheme: theme });
    debouncedSave(get());
  },

  // Action: Set lighting mood
  setLightingMood: (mood: LightingMood) => {
    set({ lightingMood: mood });
    debouncedSave(get());
  },

  // Action: Load configuration from localStorage
  loadFromLocalStorage: () => {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - skip localStorage
        console.log('Server-side rendering detected, skipping localStorage load');
        return;
      }

      // Check if localStorage is available (handles private mode, quota issues)
      if (!isLocalStorageAvailable()) {
        console.warn('localStorage is not available (may be in private/incognito mode), using default configuration');
        return;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      
      if (!saved) {
        console.log('No saved configuration found, using defaults');
        return;
      }

      // Parse and validate the saved configuration
      let config: StoredConfig;
      try {
        config = JSON.parse(saved);
      } catch (parseError) {
        console.error('Failed to parse saved configuration:', parseError);
        console.log('Clearing corrupted data and using defaults');
        // Clear corrupted data
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (removeError) {
          console.error('Failed to clear corrupted data:', removeError);
        }
        return;
      }

      // Validate version (for future migrations)
      if (config.version !== STORAGE_VERSION) {
        console.warn(`Configuration version mismatch (saved: ${config.version}, current: ${STORAGE_VERSION}), using defaults`);
        return;
      }

      // Validate configuration values
      const validRoomTypes: RoomType[] = ['living-room', 'bedroom', 'office'];
      const validStylePresets: StylePreset[] = ['modern', 'boho', 'minimalist'];
      const validColorThemes: ColorTheme[] = ['warm', 'cool', 'neutral'];
      const validLightingMoods: LightingMood[] = ['morning', 'evening', 'night'];

      if (!validRoomTypes.includes(config.roomType) ||
          !validStylePresets.includes(config.stylePreset) ||
          !validColorThemes.includes(config.colorTheme) ||
          !validLightingMoods.includes(config.lightingMood)) {
        console.warn('Invalid configuration values detected, using defaults');
        return;
      }

      // Apply loaded configuration
      set({
        roomType: config.roomType,
        stylePreset: config.stylePreset,
        colorTheme: config.colorTheme,
        lightingMood: config.lightingMood,
      });

      console.log('Configuration loaded from localStorage successfully');
    } catch (error) {
      console.error('Failed to load configuration from localStorage:', error);
      // Fallback to defaults - no action needed as defaults are already set
      
      // Try to clear potentially corrupted data
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(STORAGE_KEY);
          console.log('Cleared potentially corrupted localStorage data');
        }
      } catch (clearError) {
        console.error('Failed to clear localStorage:', clearError);
      }
    }
  },

  // Action: Save configuration to localStorage
  saveToLocalStorage: () => {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - skip localStorage
        console.log('Server-side rendering detected, skipping localStorage save');
        return;
      }

      // Check if localStorage is available (handles private mode, quota issues)
      if (!isLocalStorageAvailable()) {
        console.warn('localStorage is not available (may be in private/incognito mode), cannot save configuration');
        return;
      }

      const state = get();
      const config: StoredConfig = {
        version: STORAGE_VERSION,
        roomType: state.roomType,
        stylePreset: state.stylePreset,
        colorTheme: state.colorTheme,
        lightingMood: state.lightingMood,
        lastUpdated: Date.now(),
      };

      const serialized = JSON.stringify(config);
      localStorage.setItem(STORAGE_KEY, serialized);
      console.log('Configuration saved to localStorage successfully');
    } catch (error) {
      console.error('Failed to save configuration to localStorage:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded. Consider clearing browser data.');
        } else if (error.name === 'SecurityError') {
          console.error('localStorage access denied. Check browser privacy settings.');
        }
      }
    }
  },
}));
