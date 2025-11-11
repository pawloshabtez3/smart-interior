import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LightingSelector from './LightingSelector';
import { useStore } from '@/lib/store';

describe('LightingSelector', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useStore.setState({
      roomType: 'living-room',
      stylePreset: 'modern',
      colorTheme: 'warm',
      lightingMood: 'morning',
    });
  });

  describe('Lighting Mood Options', () => {
    it('should render all lighting mood options', () => {
      render(<LightingSelector />);
      
      expect(screen.getByText('Morning')).toBeInTheDocument();
      expect(screen.getByText('Evening')).toBeInTheDocument();
      expect(screen.getByText('Night')).toBeInTheDocument();
    });

    it('should render section header', () => {
      render(<LightingSelector />);
      
      expect(screen.getByText('Lighting Mood')).toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('should highlight the currently selected lighting mood', () => {
      render(<LightingSelector />);
      
      const morningButton = screen.getByText('Morning').closest('button');
      expect(morningButton).toHaveClass('bg-white/20', 'border-white/50');
    });

    it('should update lighting mood when morning is clicked', () => {
      useStore.setState({ lightingMood: 'evening' });
      render(<LightingSelector />);
      
      const morningButton = screen.getByText('Morning');
      fireEvent.click(morningButton);
      
      const state = useStore.getState();
      expect(state.lightingMood).toBe('morning');
    });

    it('should update lighting mood when evening is clicked', () => {
      render(<LightingSelector />);
      
      const eveningButton = screen.getByText('Evening');
      fireEvent.click(eveningButton);
      
      const state = useStore.getState();
      expect(state.lightingMood).toBe('evening');
    });

    it('should update lighting mood when night is clicked', () => {
      render(<LightingSelector />);
      
      const nightButton = screen.getByText('Night');
      fireEvent.click(nightButton);
      
      const state = useStore.getState();
      expect(state.lightingMood).toBe('night');
    });
  });

  describe('Visual Indicators', () => {
    it('should render icons for each mood', () => {
      render(<LightingSelector />);
      
      // Check that SVG icons are rendered (3 moods = 3 SVGs)
      const svgs = screen.getAllByRole('button').map(button => 
        button.querySelector('svg')
      ).filter(Boolean);
      
      expect(svgs.length).toBe(3);
    });
  });
});
