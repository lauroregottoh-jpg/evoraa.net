"use client"

import { useState, useEffect } from "react"
import { verses } from "@/utils/constants/verses"
import { cn } from "@/utils/cn"

export function BiblicalQuote({ className }: { className?: string }) {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Choisir un verset aléatoire au premier chargement
    setCurrentVerseIndex(Math.floor(Math.random() * verses.length))

    // Rotation toutes les 10 secondes
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentVerseIndex((prev) => (prev + 1) % verses.length)
        setIsVisible(true)
      }, 500) // Temps du fondu sortant
      
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const currentVerse = verses[currentVerseIndex]

  return (
    <div className={cn("relative min-h-[120px] flex flex-col justify-center", className)}>
      <blockquote 
        className={cn(
          "space-y-4 transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed shadow-sm">
          &ldquo;{currentVerse.quote}&rdquo;
        </p>
        <footer className="text-sm md:text-base font-medium text-white/80 uppercase tracking-widest">
          — {currentVerse.reference}
        </footer>
      </blockquote>
    </div>
  )
}
