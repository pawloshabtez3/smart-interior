'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ROOM_TYPES } from '@/lib/constants';
import type { RoomType } from '@/lib/store';

interface ControlPanelProps {
  className?: string;
}

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

const scaleIn = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

export default function ControlPanel({ className = '' }: ControlPanelProps) {
  const { roomType, setRoomType } = useStore();
  return (
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
        
        /* Desktop: Sidebar layout */
        lg:fixed lg:left-6 lg:top-24 lg:w-80 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto
        
        /* Mobile: Bottom sheet layout */
        fixed bottom-0 left-0 right-0 
        lg:relative lg:bottom-auto lg:left-auto lg:right-auto
        
        /* Responsive adjustments */
        max-lg:rounded-t-2xl max-lg:rounded-b-none
        max-lg:max-h-[60vh] max-lg:overflow-y-auto
      `}
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
      </div>
    </motion.div>
  );
}
