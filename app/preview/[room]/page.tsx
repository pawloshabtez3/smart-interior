'use client';

import { useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { RoomType } from '@/lib/store';
import { ROOM_TYPES } from '@/lib/constants';
import Header from '@/components/Header';
import ControlPanel from '@/components/ControlPanel';
import SaveButton from '@/components/SaveButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { initBrowserCompatibility } from '@/lib/browser-compat';

// Lazy load the heavy 3D canvas component for better initial load performance
const RoomCanvas = lazy(() => import('@/components/RoomCanvas'));

// Loading fallback component for RoomCanvas
function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading 3D Environment...</p>
      </div>
    </div>
  );
}

export default function DesignInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null!);
  
  // Get store state and actions
  const {
    roomType,
    stylePreset,
    colorTheme,
    lightingMood,
    setRoomType,
    loadFromLocalStorage,
  } = useStore();

  // Extract and validate room parameter from URL
  useEffect(() => {
    const roomParam = params.room as string;
    
    // Validate room parameter against allowed types
    const validRoomTypes = ROOM_TYPES.map(rt => rt.value);
    const isValidRoom = validRoomTypes.includes(roomParam as RoomType);
    
    if (!isValidRoom) {
      // Redirect to default room if invalid
      console.warn(`Invalid room type: ${roomParam}, redirecting to living-room`);
      router.replace('/preview/living-room');
      return;
    }
    
    // Update store with URL room type
    if (roomParam !== roomType) {
      setRoomType(roomParam as RoomType);
    }
  }, [params.room, roomType, setRoomType, router]);

  // Initialize browser compatibility and store from localStorage on mount
  useEffect(() => {
    // Initialize browser compatibility fixes
    initBrowserCompatibility();
    
    // Load saved configuration
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <Header />

        {/* Main content area */}
        <main className="pt-20 h-screen">
          {/* Responsive layout container */}
          <div className="relative h-full w-full">
            {/* 3D Canvas - fills available space */}
            <div 
              ref={canvasRef}
              className="
                absolute inset-0
                /* Desktop: Account for sidebar */
                lg:pr-96
                /* Mobile: Full height with bottom padding for toggle button */
                max-lg:pb-16
                transition-all duration-300 ease-out
              "
            >
              <Suspense fallback={<CanvasLoader />}>
                <RoomCanvas
                  roomType={roomType}
                  stylePreset={stylePreset}
                  colorTheme={colorTheme}
                  lightingMood={lightingMood}
                />
              </Suspense>
            </div>

            {/* Control Panel - responsive positioning */}
            <ControlPanel />

            {/* Save Button - positioned in top right */}
            <div className="
              fixed 
              top-24 
              right-6 
              z-40
              /* Adjust position on mobile */
              max-lg:top-24 max-lg:right-4
            ">
              <SaveButton canvasRef={canvasRef} />
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
