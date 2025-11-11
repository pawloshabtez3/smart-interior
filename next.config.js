/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Enable React strict mode for better performance warnings
  reactStrictMode: true,
  
  // Optimize production builds
  swcMinify: true,
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  webpack: (config, { isServer }) => {
    // Handle 3D model files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    
    // Optimize three.js bundle size
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use ES modules for better tree-shaking
        'three': 'three',
      };
    }
    
    return config;
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three', 'framer-motion'],
  },
};

module.exports = nextConfig;
