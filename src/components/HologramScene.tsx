import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAgentStore } from '../store/useAgentStore';
import { useState } from 'react';

function RotatingStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.05; // Slower rotation for more ethereal feel
    }
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={200}
        depth={150}
        count={10000}
        factor={8}
        saturation={0}
        fade={true}
        speed={0} // Set to 0 as we're handling rotation manually
      />
    </group>
  );
}

function InitialCameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.rotation.x = Math.PI; // Rotate 180 degrees up
  }, [camera]);
  
  return null;
}

export default function HologramScene() {
  const selectedAgent = useAgentStore((state) => state.selectedAgent);

  if (!selectedAgent) return null;

  return (
    <div className="w-full h-full bg-[var(--terminal-dark)]/90 rounded-lg overflow-hidden relative z-[4] terminal-border crt">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent" />
      <Canvas 
        camera={{ position: [0, 12, 0], fov: 75 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <RotatingStars />
          <InitialCameraSetup />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0}  // Allow full vertical rotation
          maxPolarAngle={Math.PI} // Allow full vertical rotation
          rotateSpeed={0.3}
          target={[0, 12, 0]} // Set target point to match camera height
        />
        <fog attach="fog" args={['#000', 10, 30]} />
        
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color="#00ffff"
            transparent
            opacity={0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Canvas>
      
      <div className="absolute top-2 left-2 text-[var(--terminal-green)]/80 font-mono text-xs uppercase">
        <div>PROJECT X OS v0.0.1</div>
        <div>QUANTUM LINK: STABLE</div>
        <div>NEURAL SYNC: ACTIVE</div>
      </div>
      
      <div className="absolute top-2 right-2 text-[var(--terminal-green)]/80 font-mono text-xs text-right uppercase">
        <div>SECTOR: [CLASSIFIED]</div>
        <div>ACCESS LEVEL: ALPHA</div>
        <div>QUANTUM STATE: COHERENT</div>
      </div>
    </div>
  );
}