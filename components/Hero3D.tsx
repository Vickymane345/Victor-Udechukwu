"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/** Subtle wireframe torus-knot — the single 3D accent (hybrid approach). */
function Knot({ scroll }: { scroll: React.RefObject<number> }) {
  const mesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.08;
    mesh.current.rotation.y += delta * 0.12;
    // scroll-linked rotation + drift
    mesh.current.rotation.z = scroll.current * 1.4;
    mesh.current.position.y = -0.4 + scroll.current * 2.2;
    // gentle mouse parallax
    const px = state.pointer.x * 0.35;
    const py = state.pointer.y * 0.25;
    mesh.current.position.x += (px + 2.1 - mesh.current.position.x) * 0.04;
    mesh.current.position.z += (py - mesh.current.position.z) * 0.04;
  });

  return (
    <mesh ref={mesh} position={[2.1, -0.4, 0]} scale={0.85}>
      <torusKnotGeometry args={[1, 0.28, 110, 12, 2, 3]} />
      <meshBasicMaterial wireframe color="#c4501e" transparent opacity={0.14} />
    </mesh>
  );
}

export default function Hero3D({ scroll }: { scroll: React.RefObject<number> }) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      <Knot scroll={scroll} />
    </Canvas>
  );
}
