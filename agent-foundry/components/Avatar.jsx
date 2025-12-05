'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function DoctorModel({ state }) {
  const { scene } = useGLTF('/models/doctor.glb');
  const groupRef = useRef();
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    clock.current += delta;

    // BREATHING - Always active
    const breathCycle = Math.sin(clock.current * 1.5) * 0.02;
    groupRef.current.scale.set(1, 1 + breathCycle, 1);

    // Different animations based on state
    if (state === 'idle') {
      // Gentle swaying
      groupRef.current.rotation.y = Math.sin(clock.current * 0.5) * 0.05;
      groupRef.current.position.x = Math.sin(clock.current * 0.3) * 0.02;
    }

    if (state === 'thinking') {
      // Head tilt animation
      groupRef.current.rotation.z = Math.sin(clock.current * 2) * 0.1;
      groupRef.current.rotation.x = Math.sin(clock.current * 1.5) * 0.05;
    }

    if (state === 'speaking') {
      // Bounce animation when speaking
      const bounce = Math.abs(Math.sin(clock.current * 4)) * 0.08;
      groupRef.current.position.y = -1 + bounce;
      
      // Slight head movement
      groupRef.current.rotation.y = Math.sin(clock.current * 3) * 0.08;
    } else {
      // Smooth return to normal position
      groupRef.current.position.y += (-1 - groupRef.current.position.y) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

// Animated particles for speaking state
function FloatingParticles({ state }) {
  if (state !== 'speaking') return null;

  return (
    <group>
      {[...Array(6)].map((_, i) => (
        <AnimatedParticle key={i} index={i} />
      ))}
    </group>
  );
}

function AnimatedParticle({ index }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + index * 0.5;
      meshRef.current.position.y = Math.sin(time * 2) * 0.5 + 0.5;
      meshRef.current.position.x = Math.sin(time) * 0.3;
      meshRef.current.material.opacity = Math.abs(Math.sin(time)) * 0.6;
    }
  });

  return (
    <mesh ref={meshRef} position={[index * 0.2 - 0.6, -0.5, 0]}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
    </mesh>
  );
}

// Glow ring effect
function GlowRing({ state }) {
  const ringRef = useRef();
  
  useFrame((frameState) => {
    if (!ringRef.current) return;
    
    if (state === 'speaking' || state === 'thinking') {
      const pulse = Math.sin(frameState.clock.elapsedTime * 2) * 0.2;
      ringRef.current.scale.setScalar(1 + pulse);
      ringRef.current.material.opacity = 0.3 + pulse;
    }
  });
  
  if (state === 'idle') return null;
  
  return (
    <mesh ref={ringRef} position={[0, -0.5, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.5, 0.1, 16, 100]} />
      <meshBasicMaterial 
        color={state === 'speaking' ? '#8b5cf6' : '#3b82f6'} 
        transparent 
        opacity={0.4}
      />
    </mesh>
  );
}

// Loading fallback
function LoadingFallback() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
    </mesh>
  );
}

// Eye blink effect (overlay)
function BlinkOverlay() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000); // Blink every 4 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  if (!isBlinking) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[35%] left-[45%] w-2 h-1 bg-black/80 rounded-full" />
      <div className="absolute top-[35%] right-[45%] w-2 h-1 bg-black/80 rounded-full" />
    </div>
  );
}

export default function Avatar({ state = 'idle' }) {
  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0.5, 3.5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} castShadow />
        <pointLight position={[-5, 3, -5]} intensity={0.6} color="#8b5cf6" />
        <spotLight position={[0, 5, 0]} angle={0.4} penumbra={1} intensity={1} />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Model and effects */}
        <Suspense fallback={<LoadingFallback />}>
          <DoctorModel state={state} />
          <GlowRing state={state} />
          <FloatingParticles state={state} />
        </Suspense>
        
        {/* Camera controls - DISABLE auto-rotate */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          enableDamping
          dampingFactor={0.05}
          autoRotate={false}  // ← DISABLED auto-rotate
        />
      </Canvas>

      {/* Blink effect overlay */}
      <BlinkOverlay />
      
      {/* Status Badge */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`px-6 py-3 backdrop-blur-md rounded-full text-sm font-semibold transition-all duration-300 shadow-2xl ${
          state === 'thinking' 
            ? 'bg-blue-500/90 text-white shadow-blue-500/50 animate-pulse' 
            : state === 'speaking' 
            ? 'bg-purple-500/90 text-white shadow-purple-500/50' 
            : 'bg-slate-900/90 text-slate-200 shadow-slate-900/50'
        }`}>
          <div className="flex items-center gap-2">
            {state === 'thinking' && (
              <>
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span>Listening...</span>
              </>
            )}
            {state === 'speaking' && (
              <>
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-white rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span>Responding...</span>
              </>
            )}
            {state === 'idle' && (
              <>
                <span className="text-green-400">●</span>
                <span>Ready to assist</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Name Badge */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-2xl border-2 border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
              🩺
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm leading-tight">Dr. AgentFoundry</p>
              <p className="text-slate-600 text-xs">AI Medical Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Wave Animation for Speaking */}
      {state === 'speaking' && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-12 bg-purple-500 rounded-full origin-bottom animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
