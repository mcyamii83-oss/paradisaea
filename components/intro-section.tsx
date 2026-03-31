"use client"

import { useEffect, useRef } from "react"
import { Utensils, Landmark, Waves } from "lucide-react"

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".fade-element")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Utensils,
      title: "GASTRONOMIA",
      description: "Descubre la cultura de cada destino a través de su comida. Desde mercados locales hasta experiencias culinarias únicas.",
    },
    {
      icon: Landmark,
      title: "CULTURA",
      description: "Explora ciudades llenas de historia, arte y tradiciones que hacen único cada destino.",
    },
    {
      icon: Waves,
      title: "PLAYA",
      description: "Disfruta destinos de sol y mar donde el descanso y la belleza natural se encuentran.",
    },
  ]

  return (
    <section ref={sectionRef} id="nosotros" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 fade-element opacity-0">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            En <span className="font-semibold">PARADISAEA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            convertimos tus sueños de viaje en experiencias inolvidables. Te ayudamos a conectar con el Mundo de una manera auténtica, permitenos ser tus guias en la creación de tus próximas grandes historias. ¡TU AVENTURA COMIENZA AQUÍ!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="fade-element opacity-0 text-center"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-primary/30 flex items-center justify-center group hover:border-primary hover:bg-primary/5 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground font-semibold text-sm tracking-wider mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
