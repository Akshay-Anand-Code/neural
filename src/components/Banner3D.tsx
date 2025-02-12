import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { Points } from 'three';

function StarField() {
  const starsRef = useRef<Points>(null);
  
  useFrame((state) => {
    if (starsRef.current) {
      // Create a forward motion effect
      starsRef.current.rotation.z += 0.0005;
      
      // Add slight wobble for more dynamic movement
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      starsRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={100}
      count={2000}
      factor={6}
      saturation={0}
      fade={true}
      speed={2}
    />
  );
}

export default function Banner3D() {
  return (
    <div className="absolute inset-0 terminal-border overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <StarField />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}