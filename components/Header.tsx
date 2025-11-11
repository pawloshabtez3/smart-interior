'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

export default function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-8 lg:px-12"
      initial="initial"
      animate="animate"
      variants={slideDown}
    >
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-lg">
          {/* Logo/Branding */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-gray-900 font-semibold text-lg hidden sm:inline">
                Smart Interior
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href="/preview/living-room">
              <motion.span
                className="text-gray-700 hover:text-gray-900 font-medium text-sm md:text-base cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Preview
              </motion.span>
            </Link>
            <Link href="/">
              <motion.span
                className="text-gray-700 hover:text-gray-900 font-medium text-sm md:text-base cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Home
              </motion.span>
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
