'use client';

import { useState, RefObject } from 'react';
import html2canvas from 'html2canvas';
import { useStore } from '@/lib/store';

interface SaveButtonProps {
  canvasRef: RefObject<HTMLDivElement>;
}

export default function SaveButton({ canvasRef }: SaveButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const roomType = useStore((state) => state.roomType);

  const handleSaveSnapshot = async () => {
    if (!canvasRef.current) {
      setFeedback({
        type: 'error',
        message: 'Canvas not found',
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsCapturing(true);
    setFeedback(null);

    try {
      // Capture the canvas element using html2canvas
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `interior-design-${roomType}-${timestamp}.png`;

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        URL.revokeObjectURL(url);

        // Show success feedback
        setFeedback({
          type: 'success',
          message: 'Snapshot saved successfully!',
        });
        setTimeout(() => setFeedback(null), 3000);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to capture snapshot:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to save snapshot. Please try again.',
      });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSaveSnapshot}
        disabled={isCapturing}
        className={`
          px-6 py-3 rounded-lg font-medium text-white
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          active:scale-95
          transition-all duration-300
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
        `}
      >
        {isCapturing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Capturing...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Save Snapshot</span>
          </>
        )}
      </button>

      {/* Feedback message */}
      {feedback && (
        <div
          className={`
            absolute top-full mt-2 left-1/2 transform -translate-x-1/2
            px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
            animate-fade-in shadow-lg
            ${
              feedback.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }
          `}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
