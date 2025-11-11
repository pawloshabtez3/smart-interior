'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { STYLE_PRESETS, COLOR_THEMES, ThemeColors } from '@/lib/constants';
import type { StylePreset, ColorTheme } from '@/lib/store';
import { memo } from 'react';

const scaleIn = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

const ThemeSelector = memo(function ThemeSelector() {
  const { stylePreset, colorTheme, setStylePreset, setColorTheme } = useStore();

  return (
    <div className="space-y-6">
      {/* Style Preset Selector */}
      <div>
        <h3 className="text-sm font-medium text-white/90 mb-3">
          Style Preset
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {STYLE_PRESETS.map((style) => (
            <motion.button
              key={style.value}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              variants={scaleIn}
              onClick={() => setStylePreset(style.value)}
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
                  stylePreset === style.value
                    ? 'bg-white/20 border-white/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 active:bg-white/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">
                  {style.label}
                </span>
                {stylePreset === style.value && (
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

      {/* Color Theme Selector */}
      <div>
        <h3 className="text-sm font-medium text-white/90 mb-3">
          Color Theme
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {COLOR_THEMES.map((theme) => (
            <motion.button
              key={theme.value}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              variants={scaleIn}
              onClick={() => setColorTheme(theme.value)}
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
                  colorTheme === theme.value
                    ? 'bg-white/20 border-white/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 active:bg-white/10'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Color preview swatches */}
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: ThemeColors[theme.value].primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: ThemeColors[theme.value].secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: ThemeColors[theme.value].accent }}
                    />
                  </div>
                  <span className="text-white font-medium">
                    {theme.label}
                  </span>
                </div>
                {colorTheme === theme.value && (
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
  );
});

export default ThemeSelector;
