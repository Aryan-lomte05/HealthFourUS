'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, memo } from 'react';
import * as THREE from 'three';

const DoctorModel = memo(({ state }) => {
  const { scene } = useGLTF('/models/doctor.glb');
  const groupRef = useRef();
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    clockRef.current += delta;

    // ✅ BREATHING
    const breathCycle = Math.sin(clockRef.current * 1.2) * 0.018;
    groupRef.current.scale.set(1, 1 + breathCycle, 1);

    // ✅ STATE ANIMATIONS
    if (state === 'idle') {
      groupRef.current.rotation.y = Math.sin(clockRef.current * 0.5) * 0.04;
    }

    if (state === 'thinking') {
      groupRef.current.rotation.z = Math.sin(clockRef.current * 2) * 0.06;
    }

    if (state === 'speaking') {
      const bounce = Math.abs(Math.sin(clockRef.current * 4)) * 0.03;
      groupRef.current.position.y = -0.5 + bounce;
      groupRef.current.rotation.y = Math.sin(clockRef.current * 2) * 0.06;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -0.5,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <primitive object={scene} scale={2.0} />
    </group>
  );
});

DoctorModel.displayName = 'DoctorModel';

function Loader() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function DoctorAvatarWithLipSync({ state = 'idle' }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      <div className="relative w-full h-full">
        <Canvas 
          shadows 
          dpr={[1, 2]} 
          gl={{ 
            antialias: true,
            alpha: true,
            premultipliedAlpha: false
          }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0.8, 3.8]} fov={55} />
          
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 3]} intensity={1.5} castShadow />
          <pointLight position={[-3, 2, -2]} intensity={0.6} color="#6366f1" />
          <spotLight position={[0, 4, 0]} angle={0.5} penumbra={1} intensity={1.2} />
          
          <Suspense fallback={<Loader />}>
            <DoctorModel state={state} />
          </Suspense>
        </Canvas>
      </div>

      {/* Status Badge - TOP RIGHT */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs shadow-lg transition-all duration-300 backdrop-blur-xl border ${
          state === 'thinking' 
            ? 'bg-blurple-500/90 text-slate-50 border-blurple-400/50 shadow-neon-glow' 
            : state === 'speaking' 
            ? 'bg-emerald-500/90 text-slate-50 animate-pulse border-emerald-400/50 shadow-neon-glow' 
            : 'glass-panel bg-slate-900/80 text-slate-200 border-slate-700/50'
        }`}>
          {state === 'thinking' && (
            <>
              <div className="w-1.5 h-1.5 bg-slate-50 rounded-full animate-ping" />
              <span>Listening...</span>
            </>
          )}
          {state === 'speaking' && (
            <>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-3 bg-slate-50 rounded-full"
                    style={{
                      animation: 'pulse 0.6s ease-in-out infinite',
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>
              <span>Speaking...</span>
            </>
          )}
          {state === 'idle' && (
            <>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
              <span>Ready to help</span>
            </>
          )}
        </div>
      </div>

      {/* Doctor Info - TOP CENTER */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-panel backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-lg border border-slate-700/50 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blurple-500 to-violetDeep rounded-full flex items-center justify-center shadow-neon-glow">
              <span className="text-xl">🩺</span>
            </div>
            <div>
              <p className="text-slate-100 font-bold text-xs leading-tight">Dr. AgentFoundry</p>
              <p className="text-slate-400 text-[10px]">AI Medical Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SOUND WAVES REMOVED - No more green bars! */}
    </div>
  );
}
