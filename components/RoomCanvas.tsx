'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

interface RoomCanvasProps {
  roomType: 'living-room' | 'bedroom' | 'office';
  stylePreset: 'modern' | 'boho' | 'minimalist';
  colorTheme: 'warm' | 'cool' | 'neutral';
  lightingMood: 'morning' | 'evening' | 'night';
}

function RoomModel({ roomType }: { roomType: string }) {
  const { scene } = useGLTF(`/models/${roomType}.glb`);
  return <primitive object={scene} />;
}

function SceneLights() {
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Directional light for shadows and depth */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}

export default function RoomCanvas({
  roomType,
  stylePreset,
  colorTheme,
  lightingMood,
}: RoomCanvasProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        {/* Camera setup with initial position and FOV */}
        <PerspectiveCamera
          makeDefault
          position={[5, 3, 5]}
          fov={75}
          near={0.1}
          far={1000}
        />

        {/* Orbit controls for camera interaction */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          enablePan
          panSpeed={0.5}
        />

        {/* Scene lighting */}
        <SceneLights />

        {/* 3D Room Model */}
        <Suspense fallback={null}>
          <RoomModel roomType={roomType} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload models for better performance
useGLTF.preload('/models/living-room.glb');
useGLTF.preload('/models/bedroom.glb');
useGLTF.preload('/models/office.glb');
