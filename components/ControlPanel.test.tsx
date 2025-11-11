import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';
import { useStore } from '@/lib/store';

// Mock window.innerWidth for responsive tests
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('ControlPanel', () => {
  beforeEach(() => {
    // Reset store to defaults
    useStore.setState({
      roomType: 'living-room',
      stylePreset: 'modern',
      colorTheme: 'warm',
      lightingMood: 'morning',
    });
    
    // Reset to desktop width
    mockInnerWidth(1280);
  });

  describe('Room Type Selection', () => {
    it('should render all room type options', () => {
      render(<ControlPanel />);
      
      expect(screen.getByText('Living Room')).toBeInTheDocument();
      expect(screen.getByText('Bedroom')).toBeInTheDocument();
      expect(screen.getByText('Office')).toBeInTheDocument();
    });

    it('should highlight the currently selected room type', () => {
      render(<ControlPanel />);
      
      const livingRoomButton = screen.getByText('Living Room').closest('button');
      expect(livingRoomButton).toHaveClass('bg-white/20', 'border-white/50');
    });

    it('should update room type when clicked', () => {
      render(<ControlPanel />);
      
      const bedroomButton = screen.getByText('Bedroom');
      fireEvent.click(bedroomButton);
      
      const state = useStore.getState();
      expect(state.roomType).toBe('bedroom');
    });

    it('should update room type to office', () => {
      render(<ControlPanel />);
      
      const officeButton = screen.getByText('Office');
      fireEvent.click(officeButton);
      
      const state = useStore.getState();
      expect(state.roomType).toBe('office');
    });
  });

  describe('Layout and Structure', () => {
    it('should render the panel title', () => {
      render(<ControlPanel />);
      
      expect(screen.getByText('Customize Your Space')).toBeInTheDocument();
    });

    it('should render section header for room type', () => {
      render(<ControlPanel />);
      
      expect(screen.getByText('Room Type')).toBeInTheDocument();
    });

    it('should integrate ThemeSelector component', () => {
      render(<ControlPanel />);
      
      // Check for style preset options from ThemeSelector
      expect(screen.getByText('Modern')).toBeInTheDocument();
      expect(screen.getByText('Boho')).toBeInTheDocument();
    });

    it('should integrate LightingSelector component', () => {
      render(<ControlPanel />);
      
      // Check for lighting mood options from LightingSelector
      expect(screen.getByText('Morning')).toBeInTheDocument();
      expect(screen.getByText('Evening')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render as sidebar on desktop', () => {
      mockInnerWidth(1280);
      const { container } = render(<ControlPanel />);
      
      // Desktop should have fixed positioning
      const panel = container.querySelector('.fixed.left-6');
      expect(panel).toBeInTheDocument();
    });

    it('should render as bottom sheet on mobile', () => {
      mockInnerWidth(768);
      const { container } = render(<ControlPanel />);
      
      // Mobile should have bottom positioning
      const mobilePanel = container.querySelector('.fixed.bottom-0');
      expect(mobilePanel).toBeInTheDocument();
    });

    it('should show toggle button on mobile', () => {
      mockInnerWidth(768);
      render(<ControlPanel />);
      
      // Look for the toggle button (has an SVG with specific path)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(button => 
        button.querySelector('svg path[d*="M18 15l-6-6-6 6"]')
      );
      
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className prop', () => {
      const { container } = render(<ControlPanel className="custom-class" />);
      
      const panel = container.querySelector('.custom-class');
      expect(panel).toBeInTheDocument();
    });
  });
});
