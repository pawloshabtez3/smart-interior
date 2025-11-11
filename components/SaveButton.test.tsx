import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SaveButton from './SaveButton';
import { useStore } from '@/lib/store';
import { createRef } from 'react';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // Mock toBlob method
    canvas.toBlob = vi.fn((callback) => {
      const blob = new Blob(['fake image data'], { type: 'image/png' });
      callback(blob);
    });
    
    return Promise.resolve(canvas);
  }),
}));

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('SaveButton', () => {
  beforeEach(() => {
    // Reset store to defaults
    useStore.setState({
      roomType: 'living-room',
      stylePreset: 'modern',
      colorTheme: 'warm',
      lightingMood: 'morning',
    });
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the save button', () => {
      const canvasRef = createRef<HTMLDivElement>();
      render(<SaveButton canvasRef={canvasRef} />);
      
      const button = screen.getByRole('button', { name: /save snapshot/i });
      expect(button).toBeInTheDocument();
    });

    it('should display button text', () => {
      const canvasRef = createRef<HTMLDivElement>();
      render(<SaveButton canvasRef={canvasRef} />);
      
      expect(screen.getByText('Save Snapshot')).toBeInTheDocument();
    });

    it('should render save icon', () => {
      const canvasRef = createRef<HTMLDivElement>();
      render(<SaveButton canvasRef={canvasRef} />);
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Snapshot Capture', () => {
    it('should show capturing state when clicked', async () => {
      const canvasRef = createRef<HTMLDivElement>();
      const div = document.createElement('div');
      const canvas = document.createElement('canvas');
      div.appendChild(canvas);
      (canvasRef as any).current = div;
      
      render(<SaveButton canvasRef={canvasRef} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Should show capturing state
      expect(screen.getByText('Capturing...')).toBeInTheDocument();
    });

    it('should show success message after capture', async () => {
      const canvasRef = createRef<HTMLDivElement>();
      const div = document.createElement('div');
      const canvas = document.createElement('canvas');
      div.appendChild(canvas);
      (canvasRef as any).current = div;
      
      render(<SaveButton canvasRef={canvasRef} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Snapshot saved successfully!')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should disable button during capture', async () => {
      const canvasRef = createRef<HTMLDivElement>();
      const div = document.createElement('div');
      const canvas = document.createElement('canvas');
      div.appendChild(canvas);
      (canvasRef as any).current = div;
      
      render(<SaveButton canvasRef={canvasRef} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(button).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when canvas ref is not available', async () => {
      const canvasRef = createRef<HTMLDivElement>();
      render(<SaveButton canvasRef={canvasRef} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/canvas not found/i)).toBeInTheDocument();
      });
    });
  });
});
