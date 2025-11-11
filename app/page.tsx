'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-12 lg:px-24">
      <motion.div
        className="flex flex-col items-center text-center max-w-4xl"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        {/* Hero Section */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          variants={fadeInUp}
        >
          Smart Interior Design Previewer
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12"
          variants={fadeInUp}
        >
          Visualize your dream space
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.div variants={fadeInUp}>
          <Link href="/preview/living-room">
            <motion.button
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Start Designing
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
