'use client';

import { useState, RefObject, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useStore } from '@/lib/store';
import { detectBrowser, ensureCanvasToBlobSupport } from '@/lib/browser-compat';

interface SaveButtonProps {
  canvasRef: RefObject<HTMLDivElement>;
}

const scaleIn = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

export default function SaveButton({ canvasRef }: SaveButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const roomType = useStore((state) => state.roomType);

  // Ensure canvas.toBlob support (Safari polyfill)
  useEffect(() => {
    ensureCanvasToBlobSupport();
  }, []);

  const handleSaveSnapshot = async () => {
    if (!canvasRef.current) {
      console.error('Canvas reference is not available');
      setFeedback({
        type: 'error',
        message: 'Canvas not found. Please try again.',
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsCapturing(true);
    setFeedback(null);

    try {
      // Validate canvas element
      const canvasElement = canvasRef.current.querySelector('canvas');
      if (!canvasElement) {
        throw new Error('Canvas element not found in container');
      }

      console.log('Starting snapshot capture...');

      // Detect browser for specific handling
      const browser = detectBrowser();
      
      // Browser-specific canvas capture settings
      const captureOptions: any = {
        backgroundColor: '#000000',
        scale: browser.isMobile ? 1 : 2, // Lower scale on mobile for performance
        logging: false,
        useCORS: true,
        allowTaint: false,
        removeContainer: true,
      };

      // Safari-specific: Add timeout to ensure canvas is ready
      if (browser.isSafari) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Capture the canvas element using html2canvas
      const canvas = await html2canvas(canvasRef.current, captureOptions);

      console.log('Snapshot captured, creating blob...');

      // Convert canvas to blob with error handling and browser compatibility
      await new Promise<void>((resolve, reject) => {
        try {
          // Check if toBlob is available (should be after polyfill)
          if (!canvas.toBlob) {
            // Fallback to dataURL method for very old browsers
            try {
              const dataURL = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
              const filename = `interior-design-${roomType}-${timestamp}.png`;
              
              link.href = dataURL;
              link.download = filename;
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              
              setTimeout(() => {
                document.body.removeChild(link);
              }, 100);

              setFeedback({
                type: 'success',
                message: 'Snapshot saved successfully!',
              });
              setTimeout(() => setFeedback(null), 3000);
              resolve();
              return;
            } catch (fallbackError) {
              reject(new Error('Canvas export not supported in this browser'));
              return;
            }
          }

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob'));
              return;
            }

            try {
              // Generate filename with timestamp
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
              const filename = `interior-design-${roomType}-${timestamp}.png`;

              console.log(`Creating download for ${filename}...`);

              // Create download link
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.style.display = 'none';
              document.body.appendChild(link);
              
              // Trigger download
              link.click();
              
              // Clean up - longer timeout for Safari
              const browser = detectBrowser();
              const cleanupDelay = browser.isSafari ? 500 : 100;
              
              setTimeout(() => {
                if (document.body.contains(link)) {
                  document.body.removeChild(link);
                }
                URL.revokeObjectURL(url);
              }, cleanupDelay);

              console.log('Snapshot downloaded successfully');

              // Show success feedback
              setFeedback({
                type: 'success',
                message: 'Snapshot saved successfully!',
              });
              setTimeout(() => setFeedback(null), 3000);

              resolve();
            } catch (downloadError) {
              console.error('Error during download:', downloadError);
              reject(downloadError);
            }
          }, 'image/png');
        } catch (blobError) {
          console.error('Error creating blob:', blobError);
          reject(blobError);
        }
      });
    } catch (error) {
      console.error('Failed to capture snapshot:', error);
      
      // Provide user-friendly error messages based on error type
      let errorMessage = 'Failed to save snapshot. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Canvas')) {
          errorMessage = 'Unable to access canvas. Please refresh the page.';
        } else if (error.message.includes('blob')) {
          errorMessage = 'Failed to create image. Your browser may not support this feature.';
        } else if (error.message.includes('quota') || error.message.includes('storage')) {
          errorMessage = 'Insufficient storage space. Please free up some space.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check browser settings.';
        }
        
        console.error('Error details:', error.message);
      }
      
      setFeedback({
        type: 'error',
        message: errorMessage,
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleSaveSnapshot}
        disabled={isCapturing}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={scaleIn}
        className={`
          px-6 py-3 rounded-lg font-medium text-white
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          transition-all duration-300
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
          touch-manipulation
          min-h-[44px]
        `}
      >
        {isCapturing ? (
          <>
            <motion.svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
            </motion.svg>
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
      </motion.button>

      {/* Feedback message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute top-full mt-2 left-1/2 transform -translate-x-1/2
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              shadow-lg
              ${
                feedback.type === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }
            `}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
