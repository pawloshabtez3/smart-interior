import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from './ThemeSelector';
import { useStore } from '@/lib/store';

describe('ThemeSelector', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useStore.setState({
      roomType: 'living-room',
      stylePreset: 'modern',
      colorTheme: 'warm',
      lightingMood: 'morning',
    });
  });

  describe('Style Preset Selection', () => {
    it('should render all style preset options', () => {
      render(<ThemeSelector />);
      
      expect(screen.getByText('Modern')).toBeInTheDocument();
      expect(screen.getByText('Boho')).toBeInTheDocument();
      expect(screen.getByText('Minimalist')).toBeInTheDocument();
    });

    it('should highlight the currently selected style preset', () => {
      render(<ThemeSelector />);
      
      const modernButton = screen.getByText('Modern').closest('button');
      expect(modernButton).toHaveClass('bg-white/20', 'border-white/50');
    });

    it('should update style preset when clicked', () => {
      render(<ThemeSelector />);
      
      const bohoButton = screen.getByText('Boho');
      fireEvent.click(bohoButton);
      
      const state = useStore.getState();
      expect(state.stylePreset).toBe('boho');
    });

    it('should update style preset to minimalist', () => {
      render(<ThemeSelector />);
      
      const minimalistButton = screen.getByText('Minimalist');
      fireEvent.click(minimalistButton);
      
      const state = useStore.getState();
      expect(state.stylePreset).toBe('minimalist');
    });
  });

  describe('Color Theme Selection', () => {
    it('should render all color theme options', () => {
      render(<ThemeSelector />);
      
      expect(screen.getByText('Warm')).toBeInTheDocument();
      expect(screen.getByText('Cool')).toBeInTheDocument();
      expect(screen.getByText('Neutral')).toBeInTheDocument();
    });

    it('should highlight the currently selected color theme', () => {
      render(<ThemeSelector />);
      
      const warmButton = screen.getByText('Warm').closest('button');
      expect(warmButton).toHaveClass('bg-white/20', 'border-white/50');
    });

    it('should update color theme when clicked', () => {
      render(<ThemeSelector />);
      
      const coolButton = screen.getByText('Cool');
      fireEvent.click(coolButton);
      
      const state = useStore.getState();
      expect(state.colorTheme).toBe('cool');
    });

    it('should update color theme to neutral', () => {
      render(<ThemeSelector />);
      
      const neutralButton = screen.getByText('Neutral');
      fireEvent.click(neutralButton);
      
      const state = useStore.getState();
      expect(state.colorTheme).toBe('neutral');
    });
  });

  describe('Section Headers', () => {
    it('should render section headers', () => {
      render(<ThemeSelector />);
      
      expect(screen.getByText('Style Preset')).toBeInTheDocument();
      expect(screen.getByText('Color Theme')).toBeInTheDocument();
    });
  });
});
