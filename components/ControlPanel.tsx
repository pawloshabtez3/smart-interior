'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ROOM_TYPES } from '@/lib/constants';
import type { RoomType } from '@/lib/store';
import ThemeSelector from './ThemeSelector';
import LightingSelector from './LightingSelector';
import { useState, useEffect } from 'react';

interface ControlPanelProps {
  className?: string;
}

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

const slideUp = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

const scaleIn = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

export default function ControlPanel({ className = '' }: ControlPanelProps) {
  const { roomType, setRoomType } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle bottom sheet on mobile
  const togglePanel = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <>
      {/* Mobile: Collapsible bottom sheet */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Drag handle / Toggle button */}
          <motion.button
            onClick={togglePanel}
            className="
              w-full 
              bg-white/10 
              backdrop-blur-md 
              border-t border-white/20
              py-3
              flex items-center justify-center
              touch-manipulation
              min-h-[44px]
            "
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </motion.div>
          </motion.button>

          {/* Collapsible content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideUp}
                className="
                  bg-white/10 
                  backdrop-blur-md 
                  border-t border-white/20 
                  rounded-t-2xl
                  p-6
                  shadow-xl
                  max-h-[70vh]
                  overflow-y-auto
                  overscroll-contain
                "
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Customize Your Space
                  </h2>
                  
                  {/* Room Type Selector */}
                  <div>
                    <h3 className="text-sm font-medium text-white/90 mb-3">
                      Room Type
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {ROOM_TYPES.map((room) => (
                        <motion.button
                          key={room.value}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setRoomType(room.value)}
                          className={`
                            relative
                            p-4
                            rounded-lg
                            text-left
                            transition-all
                            duration-300
                            border-2
                            touch-manipulation
                            min-h-[44px]
                            ${
                              roomType === room.value
                                ? 'bg-white/20 border-white/50 shadow-lg'
                                : 'bg-white/5 border-white/10 active:bg-white/10'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">
                              {room.label}
                            </span>
                            {roomType === room.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/20" />

                  {/* Theme Selector (Style & Color) */}
                  <ThemeSelector />

                  {/* Divider */}
                  <div className="border-t border-white/20" />

                  {/* Lighting Selector */}
                  <LightingSelector />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Desktop: Sidebar layout */}
      {!isMobile && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={slideIn}
          className={`
            ${className}
            bg-white/10 
            backdrop-blur-md 
            border border-white/20 
            rounded-lg 
            p-6
            shadow-xl
            fixed left-6 top-24 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto
          `}
        >
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Customize Your Space
            </h2>
            
            {/* Room Type Selector */}
            <div>
              <h3 className="text-sm font-medium text-white/90 mb-3">
                Room Type
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {ROOM_TYPES.map((room) => (
                  <motion.button
                    key={room.value}
                    initial="rest"
                    whileHover="hover"
                    variants={scaleIn}
                    onClick={() => setRoomType(room.value)}
                    className={`
                      relative
                      p-4
                      rounded-lg
                      text-left
                      transition-all
                      duration-300
                      border-2
                      min-h-[44px]
                      ${
                        roomType === room.value
                          ? 'bg-white/20 border-white/50 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {room.label}
                      </span>
                      {roomType === room.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20" />

            {/* Theme Selector (Style & Color) */}
            <ThemeSelector />

            {/* Divider */}
            <div className="border-t border-white/20" />

            {/* Lighting Selector */}
            <LightingSelector />
          </div>
        </motion.div>
      )}
    </>
  );
}
