"use client"

/** Petits visuels SVG animés — identité Couple (pas le style Matching accueil). */

export function VizTwoGazes({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      className={className}
      aria-hidden
      fill="none"
    >
      <circle
        className="couple-viz-pulse"
        cx="38"
        cy="36"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <circle
        className="couple-viz-pulse couple-viz-delay"
        cx="82"
        cy="36"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <circle cx="38" cy="36" r="8" fill="currentColor" opacity="0.85" />
      <circle cx="82" cy="36" r="8" fill="currentColor" opacity="0.85" />
      <path
        className="couple-viz-draw"
        d="M48 36h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function VizMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden fill="none">
      <rect
        x="8"
        y="8"
        width="104"
        height="64"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        className="couple-viz-draw"
        d="M24 52c12-18 20-8 28-20s16-6 28 8 12 4 20-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle className="couple-viz-pulse" cx="24" cy="52" r="3.5" fill="currentColor" />
      <circle
        className="couple-viz-pulse couple-viz-delay"
        cx="100"
        cy="36"
        r="3.5"
        fill="currentColor"
      />
    </svg>
  )
}

export function VizConversation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 72" className={className} aria-hidden fill="none">
      <path
        className="couple-viz-float"
        d="M18 20h40a8 8 0 018 8v12a8 8 0 01-8 8H34l-10 10V48a8 8 0 01-8-8V28a8 8 0 018-8z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        className="couple-viz-float couple-viz-delay"
        d="M62 12h40a8 8 0 018 8v12a8 8 0 01-8 8H86l-8 8V40a8 8 0 018-8h16a8 8 0 008-8V20a8 8 0 00-8-8H62z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
    </svg>
  )
}

export function VizPath({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 160" className={className} aria-hidden fill="none">
      <path
        className="couple-viz-draw"
        d="M20 8v144"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.45"
      />
      {[20, 52, 84, 116, 148].map((y, i) => (
        <circle
          key={y}
          className="couple-viz-pulse"
          style={{ animationDelay: `${i * 0.25}s` }}
          cx="20"
          cy={y}
          r="5"
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

export function VizRingProgress({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden fill="none">
      <circle
        cx="40"
        cy="40"
        r="28"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.2"
      />
      <circle
        className="couple-viz-ring"
        cx="40"
        cy="40"
        r="28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="120 176"
        transform="rotate(-90 40 40)"
      />
      <circle cx="40" cy="40" r="6" fill="currentColor" />
    </svg>
  )
}
