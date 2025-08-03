'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  
  const { viewport } = useThree();
  const [mouse, setMouse] = useState(new THREE.Vector2());
  
  // Original positions for the meshes
  const originalPositions = useRef({
    main: new THREE.Vector3(0, 0, 0),
    secondary: new THREE.Vector3(2.5, 1, -1),
    tertiary: new THREE.Vector3(-2, -1.5, 0.5)
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      setMouse(new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current && mesh2Ref.current && mesh3Ref.current) {
      // Basic rotation animation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

      // Convert mouse position to world coordinates
      const worldMouse = new THREE.Vector3(
        mouse.x * viewport.width / 2,
        mouse.y * viewport.height / 2,
        0
      );

      // Mouse repulsion effect
      const repulsionForce = 2.5; // How strong the repulsion is
      const repulsionDistance = 3; // How far the mouse affects objects

      // Main mesh repulsion
      const distance1 = meshRef.current.position.distanceTo(worldMouse);
      if (distance1 < repulsionDistance) {
        const direction = new THREE.Vector3()
          .subVectors(meshRef.current.position, worldMouse)
          .normalize();
        const force = (repulsionDistance - distance1) / repulsionDistance * repulsionForce;
        
        meshRef.current.position.copy(
          originalPositions.current.main.clone().add(direction.multiplyScalar(force))
        );
      } else {
        // Smoothly return to original position
        meshRef.current.position.lerp(originalPositions.current.main, 0.05);
      }

      // Secondary mesh repulsion
      const distance2 = mesh2Ref.current.position.distanceTo(worldMouse);
      if (distance2 < repulsionDistance) {
        const direction = new THREE.Vector3()
          .subVectors(mesh2Ref.current.position, worldMouse)
          .normalize();
        const force = (repulsionDistance - distance2) / repulsionDistance * repulsionForce;
        
        mesh2Ref.current.position.copy(
          originalPositions.current.secondary.clone().add(direction.multiplyScalar(force))
        );
      } else {
        mesh2Ref.current.position.lerp(originalPositions.current.secondary, 0.05);
      }

      // Tertiary mesh repulsion
      const distance3 = mesh3Ref.current.position.distanceTo(worldMouse);
      if (distance3 < repulsionDistance) {
        const direction = new THREE.Vector3()
          .subVectors(mesh3Ref.current.position, worldMouse)
          .normalize();
        const force = (repulsionDistance - distance3) / repulsionDistance * repulsionForce;
        
        mesh3Ref.current.position.copy(
          originalPositions.current.tertiary.clone().add(direction.multiplyScalar(force))
        );
      } else {
        mesh3Ref.current.position.lerp(originalPositions.current.tertiary, 0.05);
      }
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.3} // Reduced so it doesn't interfere with mouse repulsion
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <dodecahedronGeometry ref={geometryRef} args={[1.2, 0]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Secondary floating elements */}
      <mesh ref={mesh2Ref} position={[2.5, 1, -1]} scale={0.4}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh ref={mesh3Ref} position={[-2, -1.5, 0.5]} scale={0.3}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="w-full h-full"
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5}
          color="#3b82f6"
        />
        
        <FloatingGeometry />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
