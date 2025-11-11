'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { LightingConfig, MaterialConfig, ThemeColors, StylePreset, ColorTheme } from '@/lib/constants';

interface RoomCanvasProps {
  roomType: 'living-room' | 'bedroom' | 'office';
  stylePreset: 'modern' | 'boho' | 'minimalist';
  colorTheme: 'warm' | 'cool' | 'neutral';
  lightingMood: 'morning' | 'evening' | 'night';
}

interface MaterialState {
  color: THREE.Color;
  roughness: number;
  metalness: number;
}

function RoomModel({ 
  roomType, 
  stylePreset, 
  colorTheme 
}: { 
  roomType: string;
  stylePreset: StylePreset;
  colorTheme: ColorTheme;
}) {
  const { scene } = useGLTF(`/models/${roomType}.glb`);
  const modelRef = useRef<THREE.Group>(null);
  
  // Store current material states for each mesh
  const materialStatesRef = useRef<Map<string, MaterialState>>(new Map());
  
  // Target material configuration
  const [targetConfig, setTargetConfig] = useState({
    roughness: MaterialConfig[stylePreset].roughness,
    metalness: MaterialConfig[stylePreset].metalness,
    color: new THREE.Color(ThemeColors[colorTheme].primary),
  });

  // Update target configuration when stylePreset or colorTheme changes
  useEffect(() => {
    setTargetConfig({
      roughness: MaterialConfig[stylePreset].roughness,
      metalness: MaterialConfig[stylePreset].metalness,
      color: new THREE.Color(ThemeColors[colorTheme].primary),
    });
  }, [stylePreset, colorTheme]);

  // Initialize material states on mount
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const meshId = child.uuid;
          if (!materialStatesRef.current.has(meshId)) {
            materialStatesRef.current.set(meshId, {
              color: child.material.color.clone(),
              roughness: child.material.roughness,
              metalness: child.material.metalness,
            });
          }
        }
      });
    }
  }, [scene]);

  // Smooth transition for material properties using lerp
  useFrame((state, delta) => {
    if (!scene) return;
    
    const transitionSpeed = delta / 0.5; // 500ms transition duration
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const meshId = child.uuid;
        const currentState = materialStatesRef.current.get(meshId);
        
        if (currentState) {
          // Lerp color
          currentState.color.lerp(targetConfig.color, transitionSpeed);
          child.material.color.copy(currentState.color);
          
          // Lerp roughness
          currentState.roughness = THREE.MathUtils.lerp(
            currentState.roughness,
            targetConfig.roughness,
            transitionSpeed
          );
          child.material.roughness = currentState.roughness;
          
          // Lerp metalness
          currentState.metalness = THREE.MathUtils.lerp(
            currentState.metalness,
            targetConfig.metalness,
            transitionSpeed
          );
          child.material.metalness = currentState.metalness;
          
          // Mark material as needing update
          child.material.needsUpdate = true;
        }
      }
    });
  });

  return <primitive ref={modelRef} object={scene} />;
}

function SceneLights({ lightingMood }: { lightingMood: 'morning' | 'evening' | 'night' }) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  
  // Target values based on lighting mood
  const [targetConfig, setTargetConfig] = useState(LightingConfig[lightingMood]);
  
  // Current interpolated values
  const [currentAmbientIntensity, setCurrentAmbientIntensity] = useState(
    LightingConfig[lightingMood].ambientIntensity
  );
  const [currentDirectionalIntensity, setCurrentDirectionalIntensity] = useState(
    LightingConfig[lightingMood].directionalIntensity
  );
  const [currentPosition] = useState(
    new THREE.Vector3(...LightingConfig[lightingMood].directionalPosition)
  );
  const [currentColor] = useState(
    new THREE.Color(LightingConfig[lightingMood].color)
  );

  // Update target configuration when lightingMood changes
  useEffect(() => {
    setTargetConfig(LightingConfig[lightingMood]);
  }, [lightingMood]);

  // Smooth transition using lerp in animation frame
  useFrame((state, delta) => {
    const transitionSpeed = delta / 0.8; // 800ms transition duration
    
    // Lerp ambient intensity
    const targetAmbient = targetConfig.ambientIntensity;
    const newAmbient = THREE.MathUtils.lerp(currentAmbientIntensity, targetAmbient, transitionSpeed);
    setCurrentAmbientIntensity(newAmbient);
    
    if (ambientRef.current) {
      ambientRef.current.intensity = newAmbient;
    }

    // Lerp directional intensity
    const targetDirectional = targetConfig.directionalIntensity;
    const newDirectional = THREE.MathUtils.lerp(
      currentDirectionalIntensity,
      targetDirectional,
      transitionSpeed
    );
    setCurrentDirectionalIntensity(newDirectional);
    
    if (directionalRef.current) {
      directionalRef.current.intensity = newDirectional;
      
      // Lerp directional position
      const targetPos = new THREE.Vector3(...targetConfig.directionalPosition);
      currentPosition.lerp(targetPos, transitionSpeed);
      directionalRef.current.position.copy(currentPosition);
      
      // Lerp directional color
      const targetColor = new THREE.Color(targetConfig.color);
      currentColor.lerp(targetColor, transitionSpeed);
      directionalRef.current.color.copy(currentColor);
    }
  });

  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight ref={ambientRef} intensity={currentAmbientIntensity} />
      
      {/* Directional light for shadows and depth */}
      <directionalLight
        ref={directionalRef}
        position={currentPosition.toArray()}
        intensity={currentDirectionalIntensity}
        color={currentColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
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
        <SceneLights lightingMood={lightingMood} />

        {/* 3D Room Model */}
        <Suspense fallback={null}>
          <RoomModel 
            roomType={roomType} 
            stylePreset={stylePreset}
            colorTheme={colorTheme}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload models for better performance
useGLTF.preload('/models/living-room.glb');
useGLTF.preload('/models/bedroom.glb');
useGLTF.preload('/models/office.glb');
