"use client"

import { Button } from "@/components/ui/button"

const WHATSAPP_NUMBER = "525535013294"
const WHATSAPP_MESSAGE = "Hola! Quiero reservar mi proximo viaje con Paradisaea."

export function CTASection() {
  const handleBookNow = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, "_blank")
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Montanas y lago"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2d3436]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 italic">
          Por Que Viajar Con Paradisaea?
        </h2>
        <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          En Paradisaea Disenamos Experiencias De Viaje Personalizadas Para Que Disfrutes Cada Destino Sin Preocupaciones. Nuestro Objetivo Es Ayudarte A Descubrir El Mundo Con Seguridad, Comodidad Y Experiencias Autenticas.
        </p>
        <Button
          size="lg"
          onClick={handleBookNow}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-sm tracking-wider uppercase font-medium rounded-none"
        >
          Cotizar Ahora
        </Button>
      </div>
    </section>
  )
}
