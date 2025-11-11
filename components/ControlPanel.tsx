'use client';

import { motion } from 'framer-motion';

interface ControlPanelProps {
  className?: string;
}

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

export default function ControlPanel({ className = '' }: ControlPanelProps) {
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
        
        {/* Placeholder for future controls */}
        <div className="text-white/70 text-sm">
          Controls will be added here
        </div>
      </div>
    </motion.div>
  );
}
