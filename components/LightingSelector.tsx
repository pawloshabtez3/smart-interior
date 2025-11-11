'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { LIGHTING_MOODS } from '@/lib/constants';
import type { LightingMood } from '@/lib/store';

const scaleIn = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

// Icon components for each lighting mood
const MorningIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" strokeWidth="2" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
    />
  </svg>
);

const EveningIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const NightIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

// Map mood values to their icon components
const moodIcons: Record<LightingMood, React.ComponentType> = {
  morning: MorningIcon,
  evening: EveningIcon,
  night: NightIcon,
};

// Map mood values to their colors
const moodColors: Record<LightingMood, string> = {
  morning: 'text-yellow-300',
  evening: 'text-orange-400',
  night: 'text-blue-300',
};

export default function LightingSelector() {
  const { lightingMood, setLightingMood } = useStore();

  return (
    <div>
      <h3 className="text-sm font-medium text-white/90 mb-3">
        Lighting Mood
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {LIGHTING_MOODS.map((mood) => {
          const IconComponent = moodIcons[mood.value];
          const colorClass = moodColors[mood.value];

          return (
            <motion.button
              key={mood.value}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              variants={scaleIn}
              onClick={() => setLightingMood(mood.value)}
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
                  lightingMood === mood.value
                    ? 'bg-white/20 border-white/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 active:bg-white/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Icon preview */}
                  <div className={`${colorClass}`}>
                    <IconComponent />
                  </div>
                  <span className="text-white font-medium">
                    {mood.label}
                  </span>
                </div>
                {lightingMood === mood.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
