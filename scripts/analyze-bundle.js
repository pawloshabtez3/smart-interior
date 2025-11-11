/**
 * Bundle analysis script
 * Run with: node scripts/analyze-bundle.js
 * 
 * This script provides insights into the production bundle size
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the production bundle
  console.log('Building production bundle...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build complete!\n');
  console.log('📊 Bundle Analysis:\n');
  
  // Read the build output
  const buildDir = path.join(process.cwd(), '.next');
  
  if (fs.existsSync(buildDir)) {
    console.log('Build directory found at:', buildDir);
    console.log('\nTo analyze the bundle in detail, you can:');
    console.log('1. Install @next/bundle-analyzer: npm install --save-dev @next/bundle-analyzer');
    console.log('2. Update next.config.js to use the analyzer');
    console.log('3. Run: ANALYZE=true npm run build\n');
    
    // Check for large chunks
    const staticDir = path.join(buildDir, 'static', 'chunks');
    if (fs.existsSync(staticDir)) {
      const chunks = fs.readdirSync(staticDir);
      console.log(`Found ${chunks.length} chunks in static/chunks/\n`);
      
      // Get file sizes
      const chunkSizes = chunks
        .map(chunk => {
          const filePath = path.join(staticDir, chunk);
          const stats = fs.statSync(filePath);
          return {
            name: chunk,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
          };
        })
        .sort((a, b) => b.size - a.size)
        .slice(0, 10); // Top 10 largest chunks
      
      console.log('Top 10 largest chunks:');
      chunkSizes.forEach((chunk, index) => {
        console.log(`${index + 1}. ${chunk.name}: ${chunk.sizeKB} KB`);
      });
      
      // Check for chunks over 500KB
      const largeChunks = chunkSizes.filter(chunk => chunk.size > 500 * 1024);
      if (largeChunks.length > 0) {
        console.log('\n⚠️  Warning: Found chunks larger than 500KB:');
        largeChunks.forEach(chunk => {
          console.log(`   - ${chunk.name}: ${chunk.sizeKB} KB`);
        });
        console.log('   Consider code-splitting or lazy loading these modules.\n');
      } else {
        console.log('\n✅ All chunks are under 500KB\n');
      }
    }
  }
  
  console.log('Performance Optimization Tips:');
  console.log('- Use dynamic imports for large components');
  console.log('- Lazy load 3D models and heavy dependencies');
  console.log('- Memoize expensive computations with useMemo');
  console.log('- Use React.memo for pure components');
  console.log('- Compress 3D models with gltf-pipeline');
  console.log('- Enable tree-shaking for unused code\n');
  
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}
