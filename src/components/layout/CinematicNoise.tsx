"use client";

import * as React from "react";

export function CinematicNoise() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.015] select-none mix-blend-multiply">
      <svg className="h-full w-full">
        <filter id="cinematic-noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinematic-noiseFilter)" />
      </svg>
    </div>
  );
}
