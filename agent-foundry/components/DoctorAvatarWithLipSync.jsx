'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState, memo } from 'react';
import * as THREE from 'three';

const VISEME_MAP = {
  'sil': 'viseme_sil',
  'PP': 'viseme_PP',
  'FF': 'viseme_FF',
  'TH': 'viseme_TH',
  'DD': 'viseme_DD',
  'kk': 'viseme_kk',
  'CH': 'viseme_CH',
  'SS': 'viseme_SS',
  'nn': 'viseme_nn',
  'RR': 'viseme_RR',
  'aa': 'viseme_aa',
  'E': 'viseme_E',
  'I': 'viseme_I',
  'O': 'viseme_O',
  'U': 'viseme_U'
};

const DoctorModel = memo(({ state, currentViseme }) => {
  const { scene } = useGLTF('/models/doctor.glb');
  const groupRef = useRef();
  const clockRef = useRef(0);
  const blinkTimer = useRef(0);
  const headMeshRef = useRef();

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.morphTargetDictionary) {
          headMeshRef.current = child;
          console.log('Head mesh found:', Object.keys(child.morphTargetDictionary));
        }
      });
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    clockRef.current += delta;

    // BREATHING
    const breathCycle = Math.sin(clockRef.current * 1.2) * 0.018;
    groupRef.current.scale.set(1, 1 + breathCycle, 1);

    // BLINKING
    blinkTimer.current += delta;
    if (blinkTimer.current > 3.5) {
      blinkTimer.current = 0;
      
      if (headMeshRef.current?.morphTargetDictionary) {
        const blinkIndex = headMeshRef.current.morphTargetDictionary['eyeBlinkLeft'] || 
                          headMeshRef.current.morphTargetDictionary['eyesClosed'] ||
                          headMeshRef.current.morphTargetDictionary['Blink'];
        
        if (blinkIndex !== undefined) {
          headMeshRef.current.morphTargetInfluences[blinkIndex] = 1;
          setTimeout(() => {
            if (headMeshRef.current) {
              headMeshRef.current.morphTargetInfluences[blinkIndex] = 0;
            }
          }, 150);
        }
      }
    }

    // STATE ANIMATIONS
    if (state === 'idle') {
      groupRef.current.rotation.y = Math.sin(clockRef.current * 0.5) * 0.04;
    }

    if (state === 'thinking') {
      groupRef.current.rotation.z = Math.sin(clockRef.current * 2) * 0.06;
    }

    if (state === 'speaking') {
      const bounce = Math.abs(Math.sin(clockRef.current * 4)) * 0.03;
      groupRef.current.position.y = -0.5 + bounce;

      // LIP-SYNC
      if (headMeshRef.current?.morphTargetDictionary && currentViseme) {
        const visemeKey = VISEME_MAP[currentViseme] || 'viseme_sil';
        const visemeIndex = headMeshRef.current.morphTargetDictionary[visemeKey];
        
        if (visemeIndex !== undefined) {
          Object.values(VISEME_MAP).forEach(visemeName => {
            const idx = headMeshRef.current.morphTargetDictionary[visemeName];
            if (idx !== undefined) {
              headMeshRef.current.morphTargetInfluences[idx] = 0;
            }
          });
          
          headMeshRef.current.morphTargetInfluences[visemeIndex] = 0.8;
        } else {
          const jawIndex = headMeshRef.current.morphTargetDictionary['jawOpen'] ||
                          headMeshRef.current.morphTargetDictionary['mouthOpen'];
          if (jawIndex !== undefined) {
            headMeshRef.current.morphTargetInfluences[jawIndex] = 
              0.3 + Math.sin(clockRef.current * 8) * 0.3;
          }
        }
      }
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -0.5,
        0.1
      );
      
      if (headMeshRef.current?.morphTargetDictionary) {
        Object.values(VISEME_MAP).forEach(visemeName => {
          const idx = headMeshRef.current.morphTargetDictionary[visemeName];
          if (idx !== undefined) {
            headMeshRef.current.morphTargetInfluences[idx] = 0;
          }
        });
        
        const jawIndex = headMeshRef.current.morphTargetDictionary['jawOpen'] ||
                        headMeshRef.current.morphTargetDictionary['mouthOpen'];
        if (jawIndex !== undefined) {
          headMeshRef.current.morphTargetInfluences[jawIndex] = 0;
        }
      }
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

function SpeakingParticles({ state }) {
  if (state !== 'speaking') return null;

  return (
    <group>
      {[...Array(5)].map((_, i) => (
        <AnimatedParticle key={i} index={i} />
      ))}
    </group>
  );
}

function AnimatedParticle({ index }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + index * 0.5;
      meshRef.current.position.y = Math.sin(t * 2) * 0.4 + 0.3;
      meshRef.current.position.x = Math.sin(t) * 0.2 + (index - 2) * 0.15;
      meshRef.current.material.opacity = Math.abs(Math.sin(t)) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.5} />
    </mesh>
  );
}

export default function DoctorAvatarWithLipSync({ state = 'idle' }) {
  const [currentViseme, setCurrentViseme] = useState('sil');
  const visemeIntervalRef = useRef(null);

  useEffect(() => {
    if (state === 'speaking') {
      const visemes = ['aa', 'E', 'O', 'sil', 'PP', 'aa', 'I', 'U', 'sil', 'DD', 'kk'];
      let index = 0;
      
      visemeIntervalRef.current = setInterval(() => {
        setCurrentViseme(visemes[index % visemes.length]);
        index++;
      }, 150);
      
    } else {
      setCurrentViseme('sil');
      if (visemeIntervalRef.current) {
        clearInterval(visemeIntervalRef.current);
      }
    }

    return () => {
      if (visemeIntervalRef.current) {
        clearInterval(visemeIntervalRef.current);
      }
    };
  }, [state]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* ✅ Transparent Canvas Background */}
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
          
          {/* ✅ Removed Environment to prevent white background */}
          
          <Suspense fallback={<Loader />}>
            <DoctorModel state={state} currentViseme={currentViseme} />
            <SpeakingParticles state={state} />
          </Suspense>
        </Canvas>
      </div>

      {/* ✅ Status Badge - MOVED TO TOP RIGHT CORNER */}
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

      {/* ✅ Doctor Info - TOP CENTER (kept same) */}
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

      {/* ✅ Sound Waves - When Speaking (kept same) */}
      {state === 'speaking' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-10 bg-emerald-400/80 rounded-full origin-bottom shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              style={{
                animation: 'pulse 0.6s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
