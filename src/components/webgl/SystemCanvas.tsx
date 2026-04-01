"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleNetwork() {
  const ref = useRef<THREE.Points>(null);
  
  // High density geometric point distribution simulating a data cloud
  const [positions, color] = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const color = new THREE.Color("#C1E8FF");
    
    for (let i = 0; i < count; i++) {
      // Create a massive spherical volume of data particles
      const r = 25 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return [positions, color];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Base rotation
      ref.current.rotation.x -= delta * 0.05;
      ref.current.rotation.y -= delta * 0.08;
      
      // Hardware-accelerated pointer parallax mapping
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.02;
      ref.current.rotation.x += (-targetY - ref.current.rotation.x) * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export function SystemCanvas() {
  return (
    <div className="fixed inset-0 z-0 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 35], fov: 60 }} dpr={[1, 2]}>
        <fog attach="fog" args={["#050505", 15, 50]} />
        <ambientLight intensity={0.5} />
        <ParticleNetwork />
      </Canvas>
      {/* Heavy vignette overlay for cinematic grading mapping deeply over the 3D grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />
    </div>
  );
}
