"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 3200;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorPrimary = new THREE.Color("#722F37");
    const colorAccent = new THREE.Color("#D4AF37");
    const colorIvory = new THREE.Color("#FDFBF7");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const rand = Math.random();
      let mixedColor = colorIvory;
      if (rand > 0.9) mixedColor = colorPrimary;
      else if (rand > 0.55) mixedColor = colorAccent;
      mixedColor.toArray(colors, i * 3);
    }
    return [positions, colors];
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 45;
      ref.current.rotation.y -= delta / 55;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.25;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      (state.pointer.x * 2) / 10,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      (state.pointer.y * 2) / 10,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

type HeroBackground3DProps = {
  /** Softer photo so particles remain the star */
  imageOpacity?: number;
};

export function HeroBackground3D({ imageOpacity = 0.35 }: HeroBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (imageRef.current && containerRef.current) {
        gsap.to(imageRef.current, {
          y: "12%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#120f10]">
      <div className="absolute inset-[-4%] z-0">
        <Image
          ref={imageRef}
          src="/home/hero-african-wedding.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_32%] sm:object-[center_40%] md:object-center scale-105 md:scale-110"
          style={{ opacity: imageOpacity }}
          aria-hidden
        />
      </div>

      {/* Warm wash — keeps particles readable without a flat slab */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/30 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/25 to-black/70 pointer-events-none" />

      <div className="absolute inset-0 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]}>
          <ParticleField />
          <CameraRig />
          <ambientLight intensity={0.45} />
        </Canvas>
      </div>
    </div>
  );
}
