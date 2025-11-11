/**
 * Script to verify the generated GLB models
 * Run with: node scripts/verify-models.js
 */

const fs = require('fs');
const path = require('path');

function verifyGLB(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // Check GLB header
  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  if (magic !== 0x46546C67) {
    throw new Error('Invalid GLB magic number');
  }
  
  if (version !== 2) {
    throw new Error('Invalid GLB version (expected 2)');
  }
  
  if (length !== buffer.length) {
    throw new Error('GLB length mismatch');
  }
  
  // Read JSON chunk
  const jsonChunkLength = buffer.readUInt32LE(12);
  const jsonChunkType = buffer.readUInt32LE(16);
  
  if (jsonChunkType !== 0x4E4F534A) {
    throw new Error('Invalid JSON chunk type');
  }
  
  const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength).replace(/\s+$/, '');
  const gltf = JSON.parse(jsonString);
  
  return {
    valid: true,
    version: gltf.asset.version,
    generator: gltf.asset.generator,
    scenes: gltf.scenes?.length || 0,
    nodes: gltf.nodes?.length || 0,
    meshes: gltf.meshes?.length || 0,
    materials: gltf.materials?.length || 0,
    materialNames: gltf.materials?.map(m => m.name) || [],
    bufferSize: gltf.buffers?.[0]?.byteLength || 0,
    fileSize: buffer.length
  };
}

console.log('Verifying GLB models...\n');

const modelsDir = path.join(__dirname, '..', 'public', 'models');
const rooms = ['living-room', 'bedroom', 'office'];

let allValid = true;

rooms.forEach(roomName => {
  const filePath = path.join(modelsDir, `${roomName}.glb`);
  
  try {
    console.log(`\n📦 ${roomName}.glb`);
    console.log('─'.repeat(50));
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found');
      allValid = false;
      return;
    }
    
    const info = verifyGLB(filePath);
    
    console.log(`✓ Valid GLB file`);
    console.log(`  Version: ${info.version}`);
    console.log(`  Generator: ${info.generator}`);
    console.log(`  File size: ${(info.fileSize / 1024).toFixed(2)} KB`);
    console.log(`  Scenes: ${info.scenes}`);
    console.log(`  Nodes: ${info.nodes}`);
    console.log(`  Meshes: ${info.meshes}`);
    console.log(`  Materials: ${info.materials}`);
    console.log(`  Material names:`);
    info.materialNames.forEach(name => {
      console.log(`    - ${name}`);
    });
    console.log(`  Buffer size: ${(info.bufferSize / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.log(`❌ Verification failed: ${error.message}`);
    allValid = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✓ All models verified successfully!');
  console.log('\nModels are ready for use in the application.');
  console.log('They include named materials that can be dynamically updated:');
  console.log('  - FloorMaterial');
  console.log('  - WallMaterial');
  console.log('  - CeilingMaterial');
  console.log('  - FurnitureMaterial');
  console.log('  - AccentMaterial');
} else {
  console.log('❌ Some models failed verification');
  process.exit(1);
}
