'use client';

import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGeometry() {
  const mainCubeRef = useRef<THREE.Mesh>(null);
  const wireframeCubeRef = useRef<THREE.Mesh>(null);
  const glassOrbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (mainCubeRef.current) {
      mainCubeRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      mainCubeRef.current.rotation.y = time * 0.15;
      mainCubeRef.current.position.y = Math.sin(time * 0.3) * 0.2;
    }
    
    if (wireframeCubeRef.current) {
      wireframeCubeRef.current.rotation.x = time * 0.1;
      wireframeCubeRef.current.rotation.z = Math.sin(time * 0.25) * 0.15;
    }
    
    if (glassOrbRef.current) {
      glassOrbRef.current.position.y = Math.cos(time * 0.4) * 0.3;
      glassOrbRef.current.rotation.y = -time * 0.1;
    }
  });

  return (
    <group>
      {/* Main minimalist cube */}
      <mesh ref={mainCubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#18181b"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Wireframe architectural cube */}
      <mesh ref={wireframeCubeRef} position={[3, 0.5, -1]} scale={0.8}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#71717a"
          wireframe={true}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Glass orb */}
      <mesh ref={glassOrbRef} position={[-2.5, -0.5, 0.5]} scale={0.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          opacity={0.1}
          roughness={0.05}
          thickness={0.5}
          transparent
        />
      </mesh>
      
      {/* Subtle accent lines */}
      <mesh position={[1.5, -2, -0.5]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.02, 3, 0.02]} />
        <meshBasicMaterial color="#404040" transparent opacity={0.4} />
      </mesh>
      
      <mesh position={[-1.8, 1.5, -0.8]} rotation={[0, Math.PI / 3, 0]}>
        <boxGeometry args={[0.02, 2, 0.02]} />
        <meshBasicMaterial color="#404040" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        className="w-full h-full"
        gl={{ alpha: true, antialias: true }}
      >
        {/* Sophisticated lighting setup */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.6}
          color="#ffffff"
          castShadow
        />
        <directionalLight 
          position={[-5, -5, -5]} 
          intensity={0.3}
          color="#f4f4f5"
        />
        <pointLight 
          position={[0, 0, 5]} 
          intensity={0.4}
          color="#fafafa"
        />
        
        <FloatingGeometry />
        
        {/* Subtle auto-rotation, no user controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>
    </div>
  );
}
