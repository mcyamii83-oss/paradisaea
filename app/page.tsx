"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { IntroSection } from "@/components/intro-section"
import { ToursSection } from "@/components/tours-section"
import { CTASection } from "@/components/cta-section"
import { BlogSection, Testimonial } from "@/components/blog-section"
import { BlogPostsSection, BlogPost } from "@/components/blog-posts-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"

export interface Tour {
  id: string
  name: string
  location?: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
}

const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    text: "Paradisaea hizo que nuestro viaje a Europa fuera inolvidable. Cada detalle fue cuidado con esmero, desde los hoteles hasta las excursiones. Definitivamente volveremos a viajar con ellos.",
    author: "María González",
    role: "Empresaria",
  },
  {
    id: "2",
    text: "Excelente servicio y atención personalizada. Nos ayudaron a planificar nuestra luna de miel y superaron todas nuestras expectativas. Los mejores precios y destinos increíbles.",
    author: "Carlos Mendoza",
    role: "Ingeniero",
  },
  {
    id: "3",
    text: "Viajamos en familia por primera vez a Cancún gracias a Paradisaea. Todo salió perfecto, los niños disfrutaron muchísimo. Muy recomendados para viajes familiares.",
    author: "Ana Rodríguez",
    role: "Médico",
  },
]

const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Los 10 Destinos Mas Impresionantes de Mexico en 2024",
    content: "Mexico es un pais lleno de maravillas naturales y culturales. Desde las playas de Cancun hasta los pueblos magicos del interior, cada rincon ofrece una experiencia unica. En este articulo te presentamos los destinos que no puedes perderte este ano. Descubre la magia de Oaxaca, la belleza de Guanajuato, y la tranquilidad de las playas de la Riviera Maya. Cada destino tiene algo especial que ofrecer, ya sea gastronomia, historia, o simplemente paisajes que te dejaran sin aliento.",
    imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80",
    date: "15 de Marzo, 2024",
    comments: [
      {
        id: "c1",
        author: "Laura Martinez",
        text: "Excelente articulo! Ya tengo mi lista de lugares para visitar.",
        date: "16 Mar, 2024"
      }
    ]
  },
  {
    id: "2",
    title: "Guia Completa para Viajar a Europa por Primera Vez",
    content: "Europa es un destino sonado para muchos viajeros mexicanos. Con su rica historia, arquitectura impresionante y diversidad cultural, ofrece experiencias inolvidables. En esta guia te compartimos todo lo que necesitas saber: desde tramites de visa, mejores epocas para viajar, hasta consejos de presupuesto. Aprende a optimizar tu itinerario para aprovechar al maximo tu tiempo y dinero mientras exploras ciudades como Paris, Barcelona, Roma y Amsterdam.",
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    date: "10 de Marzo, 2024",
    comments: []
  },
  {
    id: "3",
    title: "Tips para Empacar Ligero en Tus Viajes",
    content: "Viajar ligero es un arte que puede transformar tu experiencia de viaje. Olvida las maletas pesadas y las preocupaciones por equipaje extraviado. En este articulo te ensenamos tecnicas de empaque minimalista, como elegir la ropa adecuada para multiples ocasiones, y los articulos esenciales que nunca debes olvidar. Descubre como una maleta de mano puede ser suficiente incluso para viajes de varias semanas.",
    imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80",
    date: "5 de Marzo, 2024",
    comments: []
  }
]

const initialTours: Tour[] = [
  {
    id: "1",
    name: "Comida Típica Catalana",
    location: "chittagong, bangladesh",
    description: "Descubre los sabores auténticos de Cataluña en este tour gastronómico.",
    price: 2200,
    originalPrice: 3000,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
  },
  {
    id: "2",
    name: "Nice Building",
    location: "dhaka,bangladesh",
    description: "Explora la arquitectura más impresionante de la ciudad.",
    price: 2344,
    originalPrice: 3200,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
  },
  {
    id: "3",
    name: "Sundorban Bromon",
    location: "sunfrica",
    description: "Aventura en los manglares más grandes del mundo.",
    price: 1290,
    originalPrice: 1800,
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80"
  },
  {
    id: "4",
    name: "Norjahan Hall",
    location: "sanfrancida",
    description: "Visita histórica a uno de los monumentos más emblemáticos.",
    price: 2000,
    originalPrice: 2500,
    imageUrl: "https://images.unsplash.com/photo-1548127032-79b5ef7b9a35?w=800&q=80"
  }
]

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>(initialTours)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts)
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <HeroSection />
      <IntroSection />
      <ToursSection 
        tours={tours} 
        setTours={setTours} 
        isAdmin={isAdmin} 
      />
      <CTASection />
      <BlogPostsSection
        posts={blogPosts}
        setPosts={setBlogPosts}
        isAdmin={isAdmin}
      />
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
