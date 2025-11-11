import { create } from 'zustand';

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
        return;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      
      if (!saved) {
        console.log('No saved configuration found, using defaults');
        return;
      }

      const config: StoredConfig = JSON.parse(saved);

      // Validate version (for future migrations)
      if (config.version !== STORAGE_VERSION) {
        console.warn('Configuration version mismatch, using defaults');
        return;
      }

      // Apply loaded configuration
      set({
        roomType: config.roomType,
        stylePreset: config.stylePreset,
        colorTheme: config.colorTheme,
        lightingMood: config.lightingMood,
      });

      console.log('Configuration loaded from localStorage');
    } catch (error) {
      console.error('Failed to load configuration from localStorage:', error);
      // Fallback to defaults - no action needed as defaults are already set
    }
  },

  // Action: Save configuration to localStorage
  saveToLocalStorage: () => {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - skip localStorage
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

      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      console.log('Configuration saved to localStorage');
    } catch (error) {
      console.error('Failed to save configuration to localStorage:', error);
    }
  },
}));
