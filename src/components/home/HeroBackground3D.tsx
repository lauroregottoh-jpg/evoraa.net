"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Particle System with distinct layers for depth
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const count = 4000;
  
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorPrimary = new THREE.Color("#722F37"); // Bordeaux
    const colorAccent = new THREE.Color("#D4AF37"); // Or Patiné
    const colorIvory = new THREE.Color("#FDFBF7"); // Ivoire

    for (let i = 0; i < count; i++) {
      // Spread across a wider area to allow camera movement
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Color distribution: 60% Ivory (stars), 30% Gold, 10% Bordeaux
      const rand = Math.random();
      let mixedColor = colorIvory;
      if (rand > 0.9) mixedColor = colorPrimary;
      else if (rand > 0.6) mixedColor = colorAccent;
      
      mixedColor.toArray(colors, i * 3);

      // Random sizes for depth perception
      sizes[i] = Math.random() * 0.05 + 0.01;
    }
    return [positions, colors, sizes];
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      // Very slow, elegant rotation (like a night sky)
      ref.current.rotation.x -= delta / 50;
      ref.current.rotation.y -= delta / 60;
      
      // Gentle breathing effect
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Interactive camera that reacts slightly to mouse movement for parallax
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * 2) / 10, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.pointer.y * 2) / 10, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    // Parallax effect on the background image
    if (imageRef.current && containerRef.current) {
      gsap.to(imageRef.current, {
        y: "20%", // Moves down as you scroll down
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-[#1A1A1A]">
      
      {/* 1. Base Photographic Image */}
      <div className="absolute inset-[-5%] z-0">
        <Image
          ref={imageRef}
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
          alt="Mariage Chrétien Élégant"
          fill
          priority
          className="object-cover opacity-60 scale-105"
        />
      </div>

      {/* 2. Golden Hour Light Ray Effect */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-[#D4AF37]/10 to-transparent mix-blend-overlay pointer-events-none" />
      
      {/* 3. Dark Gradient for Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#1A1A1A]/40 via-transparent to-[#FDFBF7] pointer-events-none" />

      {/* 4. Three.js Particle System */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ParticleField />
          <CameraRig />
          <ambientLight intensity={0.5} />
        </Canvas>
      </div>

    </div>
  );
}
