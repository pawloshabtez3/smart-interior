import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './store';
import type { RoomType, StylePreset, ColorTheme, LightingMood } from './store';

describe('DesignStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store to defaults
    useStore.setState({
      roomType: 'living-room',
      stylePreset: 'modern',
      colorTheme: 'warm',
      lightingMood: 'morning',
    });
  });

  describe('State initialization', () => {
    it('should initialize with default values', () => {
      const state = useStore.getState();
      expect(state.roomType).toBe('living-room');
      expect(state.stylePreset).toBe('modern');
      expect(state.colorTheme).toBe('warm');
      expect(state.lightingMood).toBe('morning');
    });
  });

  describe('setRoomType', () => {
    it('should update room type', () => {
      const { setRoomType } = useStore.getState();
      setRoomType('bedroom');
      expect(useStore.getState().roomType).toBe('bedroom');
    });

    it('should update room type to office', () => {
      const { setRoomType } = useStore.getState();
      setRoomType('office');
      expect(useStore.getState().roomType).toBe('office');
    });
  });

  describe('setStylePreset', () => {
    it('should update style preset', () => {
      const { setStylePreset } = useStore.getState();
      setStylePreset('boho');
      expect(useStore.getState().stylePreset).toBe('boho');
    });

    it('should update style preset to minimalist', () => {
      const { setStylePreset } = useStore.getState();
      setStylePreset('minimalist');
      expect(useStore.getState().stylePreset).toBe('minimalist');
    });
  });

  describe('setColorTheme', () => {
    it('should update color theme', () => {
      const { setColorTheme } = useStore.getState();
      setColorTheme('cool');
      expect(useStore.getState().colorTheme).toBe('cool');
    });

    it('should update color theme to neutral', () => {
      const { setColorTheme } = useStore.getState();
      setColorTheme('neutral');
      expect(useStore.getState().colorTheme).toBe('neutral');
    });
  });

  describe('setLightingMood', () => {
    it('should update lighting mood', () => {
      const { setLightingMood } = useStore.getState();
      setLightingMood('evening');
      expect(useStore.getState().lightingMood).toBe('evening');
    });

    it('should update lighting mood to night', () => {
      const { setLightingMood } = useStore.getState();
      setLightingMood('night');
      expect(useStore.getState().lightingMood).toBe('night');
    });
  });

  describe('localStorage persistence', () => {
    it('should save configuration to localStorage', async () => {
      const { setRoomType, saveToLocalStorage } = useStore.getState();
      setRoomType('bedroom');
      
      // Wait for debounced save or call directly
      saveToLocalStorage();
      
      const saved = localStorage.getItem('smart-interior-config');
      expect(saved).toBeTruthy();
      
      const config = JSON.parse(saved!);
      expect(config.roomType).toBe('bedroom');
      expect(config.version).toBe('1.0');
    });

    it('should load configuration from localStorage', () => {
      // Set up saved config
      const savedConfig = {
        version: '1.0',
        roomType: 'office' as RoomType,
        stylePreset: 'minimalist' as StylePreset,
        colorTheme: 'neutral' as ColorTheme,
        lightingMood: 'night' as LightingMood,
        lastUpdated: Date.now(),
      };
      localStorage.setItem('smart-interior-config', JSON.stringify(savedConfig));
      
      // Load from localStorage
      const { loadFromLocalStorage } = useStore.getState();
      loadFromLocalStorage();
      
      const state = useStore.getState();
      expect(state.roomType).toBe('office');
      expect(state.stylePreset).toBe('minimalist');
      expect(state.colorTheme).toBe('neutral');
      expect(state.lightingMood).toBe('night');
    });

    it('should use defaults when no saved config exists', () => {
      const { loadFromLocalStorage } = useStore.getState();
      loadFromLocalStorage();
      
      const state = useStore.getState();
      expect(state.roomType).toBe('living-room');
      expect(state.stylePreset).toBe('modern');
      expect(state.colorTheme).toBe('warm');
      expect(state.lightingMood).toBe('morning');
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('smart-interior-config', 'invalid json');
      
      const { loadFromLocalStorage } = useStore.getState();
      loadFromLocalStorage();
      
      // Should fall back to defaults
      const state = useStore.getState();
      expect(state.roomType).toBe('living-room');
    });
  });
});
