/**
 * Script to generate simple placeholder 3D models for testing
 * Run with: node scripts/generate-models.js
 */

const fs = require('fs');
const path = require('path');

// Simple GLB generator using basic geometry
// This creates minimal valid GLB files with named materials

function createGLB(roomName, roomConfig) {
  // GLB is glTF 2.0 in binary format
  // We'll create a minimal valid glTF JSON structure
  
  const gltf = {
    asset: {
      version: "2.0",
      generator: "Smart Interior Previewer Model Generator"
    },
    scene: 0,
    scenes: [
      {
        name: roomName,
        nodes: [0, 1, 2, 3, 4] // floor, walls, ceiling, furniture pieces
      }
    ],
    nodes: [
      {
        name: "Floor",
        mesh: 0
      },
      {
        name: "Walls",
        mesh: 1
      },
      {
        name: "Ceiling",
        mesh: 2
      },
      {
        name: "Furniture1",
        mesh: 3,
        translation: roomConfig.furniture1Position
      },
      {
        name: "Furniture2",
        mesh: 4,
        translation: roomConfig.furniture2Position
      }
    ],
    meshes: [
      {
        name: "Floor",
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1
            },
            indices: 2,
            material: 0
          }
        ]
      },
      {
        name: "Walls",
        primitives: [
          {
            attributes: {
              POSITION: 3,
              NORMAL: 4
            },
            indices: 5,
            material: 1
          }
        ]
      },
      {
        name: "Ceiling",
        primitives: [
          {
            attributes: {
              POSITION: 6,
              NORMAL: 7
            },
            indices: 8,
            material: 2
          }
        ]
      },
      {
        name: "Furniture1",
        primitives: [
          {
            attributes: {
              POSITION: 9,
              NORMAL: 10
            },
            indices: 11,
            material: 3
          }
        ]
      },
      {
        name: "Furniture2",
        primitives: [
          {
            attributes: {
              POSITION: 12,
              NORMAL: 13
            },
            indices: 14,
            material: 4
          }
        ]
      }
    ],
    materials: [
      {
        name: "FloorMaterial",
        pbrMetallicRoughness: {
          baseColorFactor: [0.8, 0.7, 0.6, 1.0],
          metallicFactor: 0.0,
          roughnessFactor: 0.8
        }
      },
      {
        name: "WallMaterial",
        pbrMetallicRoughness: {
          baseColorFactor: [0.9, 0.9, 0.85, 1.0],
          metallicFactor: 0.0,
          roughnessFactor: 0.9
        }
      },
      {
        name: "CeilingMaterial",
        pbrMetallicRoughness: {
          baseColorFactor: [0.95, 0.95, 0.95, 1.0],
          metallicFactor: 0.0,
          roughnessFactor: 0.9
        }
      },
      {
        name: "FurnitureMaterial",
        pbrMetallicRoughness: {
          baseColorFactor: [0.6, 0.4, 0.3, 1.0],
          metallicFactor: 0.1,
          roughnessFactor: 0.6
        }
      },
      {
        name: "AccentMaterial",
        pbrMetallicRoughness: {
          baseColorFactor: [0.7, 0.5, 0.4, 1.0],
          metallicFactor: 0.2,
          roughnessFactor: 0.5
        }
      }
    ],
    accessors: [],
    bufferViews: [],
    buffers: []
  };

  // Create geometry data
  const geometryData = createRoomGeometry(roomConfig);
  
  // Add accessors and buffer views for each mesh
  let bufferOffset = 0;
  const bufferData = [];

  geometryData.forEach((geom, index) => {
    // Position accessor
    const positionData = new Float32Array(geom.positions);
    gltf.accessors.push({
      bufferView: bufferOffset,
      componentType: 5126, // FLOAT
      count: geom.positions.length / 3,
      type: "VEC3",
      max: geom.posMax,
      min: geom.posMin
    });
    gltf.bufferViews.push({
      buffer: 0,
      byteOffset: bufferData.reduce((sum, arr) => sum + arr.byteLength, 0),
      byteLength: positionData.byteLength,
      target: 34962 // ARRAY_BUFFER
    });
    bufferData.push(positionData);
    bufferOffset++;

    // Normal accessor
    const normalData = new Float32Array(geom.normals);
    gltf.accessors.push({
      bufferView: bufferOffset,
      componentType: 5126, // FLOAT
      count: geom.normals.length / 3,
      type: "VEC3"
    });
    gltf.bufferViews.push({
      buffer: 0,
      byteOffset: bufferData.reduce((sum, arr) => sum + arr.byteLength, 0),
      byteLength: normalData.byteLength,
      target: 34962 // ARRAY_BUFFER
    });
    bufferData.push(normalData);
    bufferOffset++;

    // Indices accessor
    const indexData = new Uint16Array(geom.indices);
    gltf.accessors.push({
      bufferView: bufferOffset,
      componentType: 5123, // UNSIGNED_SHORT
      count: geom.indices.length,
      type: "SCALAR"
    });
    gltf.bufferViews.push({
      buffer: 0,
      byteOffset: bufferData.reduce((sum, arr) => sum + arr.byteLength, 0),
      byteLength: indexData.byteLength,
      target: 34963 // ELEMENT_ARRAY_BUFFER
    });
    bufferData.push(indexData);
    bufferOffset++;
  });

  // Combine all buffer data
  const totalByteLength = bufferData.reduce((sum, arr) => sum + arr.byteLength, 0);
  const combinedBuffer = new Uint8Array(totalByteLength);
  let offset = 0;
  bufferData.forEach(data => {
    combinedBuffer.set(new Uint8Array(data.buffer), offset);
    offset += data.byteLength;
  });

  gltf.buffers.push({
    byteLength: totalByteLength
  });

  // Create GLB binary
  const jsonString = JSON.stringify(gltf);
  const jsonBuffer = Buffer.from(jsonString);
  const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
  const jsonChunkLength = jsonBuffer.length + jsonPadding;

  const binaryPadding = (4 - (combinedBuffer.length % 4)) % 4;
  const binaryChunkLength = combinedBuffer.length + binaryPadding;

  const totalLength = 12 + 8 + jsonChunkLength + 8 + binaryChunkLength;

  const glb = Buffer.alloc(totalLength);
  let writeOffset = 0;

  // GLB header
  glb.writeUInt32LE(0x46546C67, writeOffset); // magic: "glTF"
  writeOffset += 4;
  glb.writeUInt32LE(2, writeOffset); // version: 2
  writeOffset += 4;
  glb.writeUInt32LE(totalLength, writeOffset); // length
  writeOffset += 4;

  // JSON chunk
  glb.writeUInt32LE(jsonChunkLength, writeOffset); // chunk length
  writeOffset += 4;
  glb.writeUInt32LE(0x4E4F534A, writeOffset); // chunk type: "JSON"
  writeOffset += 4;
  jsonBuffer.copy(glb, writeOffset);
  writeOffset += jsonBuffer.length;
  // Add padding spaces
  for (let i = 0; i < jsonPadding; i++) {
    glb.writeUInt8(0x20, writeOffset++);
  }

  // Binary chunk
  glb.writeUInt32LE(binaryChunkLength, writeOffset); // chunk length
  writeOffset += 4;
  glb.writeUInt32LE(0x004E4942, writeOffset); // chunk type: "BIN\0"
  writeOffset += 4;
  Buffer.from(combinedBuffer.buffer).copy(glb, writeOffset);
  writeOffset += combinedBuffer.length;
  // Add padding zeros
  for (let i = 0; i < binaryPadding; i++) {
    glb.writeUInt8(0x00, writeOffset++);
  }

  return glb;
}

function createRoomGeometry(config) {
  const geometries = [];

  // Floor (simple plane)
  geometries.push({
    positions: [
      -5, 0, -5,
      5, 0, -5,
      5, 0, 5,
      -5, 0, 5
    ],
    normals: [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    ],
    indices: [0, 1, 2, 0, 2, 3],
    posMax: [5, 0, 5],
    posMin: [-5, 0, -5]
  });

  // Walls (4 walls as boxes)
  geometries.push({
    positions: [
      // Back wall
      -5, 0, -5, 5, 0, -5, 5, 3, -5, -5, 3, -5,
      // Right wall
      5, 0, -5, 5, 0, 5, 5, 3, 5, 5, 3, -5,
      // Front wall (partial for door)
      -5, 0, 5, 5, 0, 5, 5, 3, 5, -5, 3, 5,
      // Left wall
      -5, 0, 5, -5, 0, -5, -5, 3, -5, -5, 3, 5
    ],
    normals: [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0
    ],
    indices: [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15
    ],
    posMax: [5, 3, 5],
    posMin: [-5, 0, -5]
  });

  // Ceiling
  geometries.push({
    positions: [
      -5, 3, -5,
      5, 3, -5,
      5, 3, 5,
      -5, 3, 5
    ],
    normals: [
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0
    ],
    indices: [0, 2, 1, 0, 3, 2],
    posMax: [5, 3, 5],
    posMin: [-5, 3, -5]
  });

  // Furniture piece 1 (box)
  geometries.push(createBox(1.5, 0.8, 1.0));

  // Furniture piece 2 (box)
  geometries.push(createBox(1.0, 1.2, 0.8));

  return geometries;
}

function createBox(width, height, depth) {
  const w = width / 2;
  const h = height / 2;
  const d = depth / 2;

  return {
    positions: [
      // Front
      -w, -h, d, w, -h, d, w, h, d, -w, h, d,
      // Back
      w, -h, -d, -w, -h, -d, -w, h, -d, w, h, -d,
      // Top
      -w, h, d, w, h, d, w, h, -d, -w, h, -d,
      // Bottom
      -w, -h, -d, w, -h, -d, w, -h, d, -w, -h, d,
      // Right
      w, -h, d, w, -h, -d, w, h, -d, w, h, d,
      // Left
      -w, -h, -d, -w, -h, d, -w, h, d, -w, h, -d
    ],
    normals: [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ],
    indices: [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
    ],
    posMax: [w, h, d],
    posMin: [-w, -h, -d]
  };
}

// Room configurations
const rooms = {
  'living-room': {
    furniture1Position: [-2, 0.4, 0],
    furniture2Position: [2, 0.6, -1]
  },
  'bedroom': {
    furniture1Position: [0, 0.4, -2],
    furniture2Position: [-2, 0.6, 1]
  },
  'office': {
    furniture1Position: [1, 0.4, 0],
    furniture2Position: [-1.5, 0.6, -1.5]
  }
};

// Generate models
const modelsDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

console.log('Generating placeholder 3D models...\n');

Object.keys(rooms).forEach(roomName => {
  console.log(`Creating ${roomName}.glb...`);
  const glb = createGLB(roomName, rooms[roomName]);
  const filePath = path.join(modelsDir, `${roomName}.glb`);
  fs.writeFileSync(filePath, glb);
  console.log(`✓ Generated ${roomName}.glb (${(glb.length / 1024).toFixed(2)} KB)`);
});

console.log('\n✓ All models generated successfully!');
console.log('\nModels include:');
console.log('  - Named materials: FloorMaterial, WallMaterial, CeilingMaterial, FurnitureMaterial, AccentMaterial');
console.log('  - Basic room structure: floor, walls, ceiling');
console.log('  - Simple furniture pieces for testing');
