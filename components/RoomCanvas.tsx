'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { LightingConfig, MaterialConfig, ThemeColors, StylePreset, ColorTheme } from '@/lib/constants';
import { detectWebGLSupport } from '@/lib/webgl-support';

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

// Error fallback component for model loading failures
function ModelLoadError({ 
  roomType, 
  onRetry 
}: { 
  roomType: string; 
  onRetry: () => void;
}) {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#666666" />
      <group>
        {/* Simple fallback visualization */}
      </group>
    </mesh>
  );
}

function RoomModel({ 
  roomType, 
  stylePreset, 
  colorTheme,
  onError
}: { 
  roomType: string;
  stylePreset: StylePreset;
  colorTheme: ColorTheme;
  onError: (error: Error) => void;
}) {
  // Load model with error handling using try-catch
  let scene: THREE.Group;
  
  try {
    const gltf = useGLTF(`/models/${roomType}.glb`);
    scene = gltf.scene;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to load 3D model');
    console.error(`Failed to load model for ${roomType}:`, err);
    onError(err);
    return null;
  }
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

function SceneLights({ 
  lightingMood, 
  isMobile 
}: { 
  lightingMood: 'morning' | 'evening' | 'night';
  isMobile: boolean;
}) {
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

  // Reduce shadow quality on mobile for better performance
  const shadowMapSize = isMobile ? 512 : 1024;

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
        castShadow={!isMobile}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
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
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [modelError, setModelError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Detect WebGL support
  useEffect(() => {
    const supported = detectWebGLSupport();
    setWebglSupported(supported);
    
    if (!supported) {
      console.error('WebGL is not supported in this browser');
    }
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle model loading errors
  const handleModelError = (error: Error) => {
    console.error('Model loading error:', error);
    setModelError(error);
  };

  // Retry mechanism with exponential backoff
  const handleRetry = () => {
    if (retryCount >= 3) {
      console.error('Maximum retry attempts reached');
      return;
    }

    setIsRetrying(true);
    setModelError(null);

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;
    
    console.log(`Retrying model load (attempt ${retryCount + 1}) after ${delay}ms...`);

    setTimeout(() => {
      setRetryCount(prev => prev + 1);
      setIsRetrying(false);
    }, delay);
  };

  // Reset retry count when room type changes
  useEffect(() => {
    setRetryCount(0);
    setModelError(null);
  }, [roomType]);

  // WebGL not supported fallback
  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">WebGL Not Supported</h2>
          <p className="text-gray-400 mb-4">
            Your browser doesn't support WebGL, which is required for 3D visualization.
          </p>
          <p className="text-sm text-gray-500">
            Please try using a modern browser like Chrome, Firefox, Safari, or Edge.
          </p>
        </div>
      </div>
    );
  }

  // Model loading error fallback
  if (modelError && !isRetrying) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Failed to Load 3D Model</h2>
          <p className="text-gray-400 mb-6">
            {modelError.message || 'Unable to load the room model. Please try again.'}
          </p>
          {retryCount < 3 ? (
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Retry {retryCount > 0 && `(${retryCount}/3)`}
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              <p className="mb-2">Maximum retry attempts reached.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Reload Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state during retry
  if (isRetrying) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Retrying...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full touch-none"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        shadows={!isMobile}
        gl={{ 
          antialias: !isMobile,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          alpha: false
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        onCreated={({ gl }) => {
          // Log WebGL context creation for debugging
          console.log('WebGL context created successfully');
        }}
      >
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
          panSpeed={isMobile ? 0.8 : 0.5}
          rotateSpeed={isMobile ? 0.8 : 1}
          zoomSpeed={isMobile ? 0.8 : 1}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />

        {/* Scene lighting */}
        <SceneLights lightingMood={lightingMood} isMobile={isMobile} />

        {/* 3D Room Model */}
        <Suspense fallback={null}>
          <RoomModel 
            roomType={roomType} 
            stylePreset={stylePreset}
            colorTheme={colorTheme}
            onError={handleModelError}
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
