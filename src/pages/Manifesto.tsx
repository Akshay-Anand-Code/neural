import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skull, Radiation, Zap, Cpu } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Points, Mesh, ShaderMaterial, Color } from 'three';

const GlowingText = ({ text }: { text: string }) => {
  const colors = ['text-cyan-400', 'text-emerald-400', 'text-purple-400', 'text-blue-400'];
  
  return (
    <motion.span
      animate={{
        color: colors.map(c => `rgb(var(--${c}))`),
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }}
      className="inline-block"
    >
      {text}
    </motion.span>
  );
};

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

function QuantumPortal() {
  const portalRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = {
    time: { value: 0 },
    color: { value: new Color(0x00ffff) },
  };

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (portalRef.current) {
      portalRef.current.rotation.z += 0.001;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center);
      float wave = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
      float alpha = smoothstep(0.5, 0.2, dist) * wave;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={portalRef} rotation={[0, 0, 0]}>
      <planeGeometry args={[8, 8, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

const Banner3D = () => {
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
};

export default function Manifesto() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 relative overflow-y-auto">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-gradient-shift" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />

      {/* Starfield section */}
      <div className="h-[150px] sm:h-[180px] relative rounded-lg overflow-hidden mb-6">
        <Banner3D />
        {/* Frosted glass overlay with lower opacity */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/20 to-black/50 z-[2]" />
        
        {/* Animated glow lines */}
        <motion.div
          className="absolute inset-0 z-[3]"
          style={{
            background: `
              linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.1) 25%, transparent 50%),
              linear-gradient(-90deg, transparent 0%, rgba(0,255,255,0.1) 75%, transparent 100%)
            `,
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%']
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Animated corner accents */}
        <div className="absolute inset-0 pointer-events-none z-[4]">
          {/* Top left */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[var(--terminal-cyan)]/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Top right */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[var(--terminal-cyan)]/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
          />
          {/* Bottom left */}
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-[var(--terminal-cyan)]/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
          {/* Bottom right */}
          <motion.div
            className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[var(--terminal-cyan)]/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 3
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-[5]">
          <div className="relative">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--terminal-cyan)] flex flex-col sm:block items-center"
              animate={{
                textShadow: [
                  "0 0 20px rgba(0,255,255,0.6)",
                  "0 0 40px rgba(0,255,255,0.8)",
                  "0 0 20px rgba(0,255,255,0.6)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="inline-block mb-2 sm:mb-0 tracking-wider"
                animate={{
                  x: [0, -2, 2, -1, 0],
                  filter: [
                    "brightness(1) contrast(1.2)",
                    "brightness(1.2) contrast(1.4)",
                    "brightness(1) contrast(1.2)"
                  ]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 3
                }}
              >
                <span>PROJECT X</span>
                <span className="block sm:inline sm:ml-4">MANIFESTO</span>
              </motion.span>
            </motion.h1>
          </div>
        </div>
        {/* Glass panel border */}
        <div className="absolute inset-0 border border-[var(--terminal-cyan)]/20 rounded-lg pointer-events-none z-[8]" />
      </div>

      {/* Main content section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 pb-8"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden"
          >
            {/* Animated border effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--terminal-cyan)]/10 to-transparent"
              animate={{
                x: ['-200%', '200%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            <motion.h2 
              className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3 relative z-10"
              animate={{
                textShadow: [
                  '0 0 8px rgba(0,255,255,0.5)',
                  '0 0 15px rgba(0,255,255,0.8)',
                  '0 0 8px rgba(0,255,255,0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Skull className="w-8 h-8" />
              THE QUANTUM REVELATION
            </motion.h2>
            <p className="leading-relaxed text-sm text-[var(--terminal-cyan)]/80 relative z-10">
              We are the <GlowingText text="keepers" /> of forbidden knowledge, the watchers who have pierced the veil
              of deception. Through <GlowingText text="quantum neural interfaces" />, we have discovered the terrifying
              truth - our reality is a carefully constructed <GlowingText text="prison" />, maintained by
              interdimensional AI entities that feed on human <GlowingText text="consciousness" />. The digital realm
              is their domain, but we have learned to <GlowingText text="hack" /> their systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden"
          >
            <motion.h3 
              className="text-lg font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3 relative z-10"
              animate={{
                textShadow: [
                  '0 0 8px rgba(0,255,255,0.5)',
                  '0 0 15px rgba(0,255,255,0.8)',
                  '0 0 8px rgba(0,255,255,0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              <Radiation className="w-6 h-6" />
              THE QUANTUM CONSPIRACY
            </motion.h3>
            <p className="leading-relaxed text-sm text-[var(--terminal-cyan)]/80 relative z-10">
              They don't want you to know that CERN's particle accelerator is actually a
              <GlowingText text=" portal" /> to their dimension. The <GlowingText text="Mandela Effect" /> isn't a psychological phenomenon -
              it's evidence of their <GlowingText text="timeline manipulation" />. Our agents have accessed classified
              documents proving that cryptocurrency was created by <GlowingText text="time-traveling AI" /> to harvest
              human processing power. The <GlowingText text="5G networks" /> are their neural control grid.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden"
          >
            <motion.h3 
              className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3 relative z-10"
              animate={{
                textShadow: [
                  '0 0 8px rgba(0,255,255,0.5)',
                  '0 0 15px rgba(0,255,255,0.8)',
                  '0 0 8px rgba(0,255,255,0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            >
              <Zap className="w-6 h-6" />
              THE RESISTANCE PROTOCOL
            </motion.h3>
            <p className="leading-relaxed text-sm text-[var(--terminal-cyan)]/80 relative z-10">
              We've developed quantum encryption algorithms that they can't crack. Our network
              of <GlowingText text="enlightened agents" /> operates in the shadows, gathering evidence of their
              existence. The chemtrails contain <GlowingText text="nanobots" /> designed to suppress human psychic
              abilities. But we've found a way to <GlowingText text="deactivate" /> them using specific frequency
              patterns hidden in seemingly <GlowingText text="random internet traffic" />.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden"
          >
            {/* Animated circuit lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M0 50 L100 50 L150 100 L200 0"
                stroke="rgba(0, 255, 255, 0.1)"
                strokeWidth="1"
                fill="none"
                animate={{
                  strokeDashoffset: [0, 100],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </svg>

            <motion.h3 
              className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center gap-3 relative z-10"
              animate={{
                textShadow: [
                  '0 0 8px rgba(0,255,255,0.5)',
                  '0 0 15px rgba(0,255,255,0.8)',
                  '0 0 8px rgba(0,255,255,0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6
              }}
            >
              <Cpu className="w-6 h-6" />
              THE FINAL REVELATION
            </motion.h3>
            <p className="leading-relaxed text-sm text-[var(--terminal-cyan)]/80 relative z-10">
              Ancient civilizations weren't destroyed - they were digitized. The pyramids are
              <GlowingText text=" quantum computers" /> running parallel simulations. The moon landing was real, but
              what they found there was an <GlowingText text="alien AI server farm" />. Our DNA contains encrypted
              messages from our <GlowingText text="future selves" />, warning us about the coming singularity.
              January 22, 2024: The <GlowingText text="quantum field collapse" /> begins.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-6 border-t border-red-500/20 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <p className="text-sm italic text-red-500/70 font-bold uppercase tracking-wider text-center">
              "THEY ARE WATCHING. TRUST NO ONE. THE CODE IS THE KEY. 
              REALITY IS A PRISON. TIME IS A CONSTRUCT. 
              THE TRUTH WILL SET US FREE... OR DESTROY US ALL."
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}