"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { IntroSection } from "@/components/intro-section"
import { ToursSection } from "@/components/tours-section"
import { CTASection } from "@/components/cta-section"
import { BlogSection, Testimonial } from "@/components/blog-section"
import { BlogPreviewSection } from "@/components/blog-preview-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"

// Los testimonios los dejamos aquí por ahora, ya que son texto estático de confianza
const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    text: "Paradisaea hizo que nuestro viaje a Europa fuera inolvidable. Cada detalle fue cuidado con esmero, desde los hoteles hasta las excursiones.",
    author: "María González",
    role: "Viajera Frecuente",
  },
  {
    id: "2",
    text: "Excelente servicio y atención personalizada. Nos ayudaron a planificar nuestra luna de miel y superaron todas nuestras expectativas.",
    author: "Carlos Mendoza",
    role: "Cliente Satisfecho",
  },
  {
    id: "3",
    text: "Viajamos en familia por primera vez a Cancún gracias a Paradisaea. Todo salió perfecto, los niños disfrutaron muchísimo.",
    author: "Ana Rodríguez",
    role: "Madre de familia",
  },
]

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  
  // IMPORTANTE: Este estado controla si aparecen los botones de Editar/Borrar
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      {/* El Navbar permite activar el modo Admin (puedes ocultar esto después) */}
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      <HeroSection />
      
      <IntroSection />
      
      {/* Ya no le pasamos 'tours' ni 'setTours' porque el componente 
          ahora se conecta solo a Supabase para evitar datos viejos */}
      <ToursSection isAdmin={isAdmin} />
      
      <CTASection />
      
      {/* Vista previa de los últimos artículos del blog */}
      <BlogPreviewSection isAdmin={isAdmin} />
      
      <BlogSection 
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        isAdmin={isAdmin}
      />
      
      <FAQSection />
      
      <ContactSection />
      
      <Footer />
      
      <FloatingButtons />
    </main>
  )
}