"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920&q=80"
        >
          {/* Video de crucero/viaje de alta calidad */}
          <source
            src="https://videos.pexels.com/video-files/1918465/1918465-uhd_2560_1440_24fps.mp4"
            type="video/mp4"
          />
          {/* Fallback image si el video no carga */}
          <img
            src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920&q=80"
            alt="Crucero de lujo"
            className="w-full h-full object-cover"
          />
        </video>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Title */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-bold italic tracking-tight mb-4 drop-shadow-lg">
            DESCUBRE
          </h1>
          
          {/* Subtitle */}
          <p className="text-white/90 text-sm sm:text-base tracking-[0.3em] uppercase mb-10 drop-shadow-md">
            El Mundo Con Confianza
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-sm tracking-wider uppercase font-medium rounded-none"
            >
              Comienza Tu Aventura
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#2d3436] hover:bg-[#2d3436]/80 text-white border-[#2d3436] px-8 py-6 text-sm tracking-wider uppercase font-medium rounded-none"
            >
              Awesome Places
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}
