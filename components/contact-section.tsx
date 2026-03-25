"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, Phone, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================================
// CONFIGURACION - Cambia estos valores por los tuyos
// ============================================
const CONFIG = {
  whatsapp: "525535013294", // Tu numero de WhatsApp (sin + ni espacios)
  phone: "+52 55 3501 32 94", // Numero formateado para mostrar
  phone2: "+52 55 5456 9159", // Segundo numero (opcional)
  email: "ventas.paradisaea@gmail.com",
  location: "Villa Coapa, Ciudad de Mexico",
}
// ============================================

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelers: "",
    budget: "",
    message: "",
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Crear mensaje para WhatsApp
    const message = `
*Nueva Cotización - Paradisaea*
━━━━━━━━━━━━━━━━━━━━

*Datos del Cliente:*
• Nombre: ${formData.name}
• Email: ${formData.email}
• Teléfono: ${formData.phone}

*Detalles del Viaje:*
• Destino: ${formData.destination || "Por definir"}
• Viajeros: ${formData.travelers || "Por definir"}
• Presupuesto: ${formData.budget || "Por definir"}

*Mensaje:*
${formData.message}

━━━━━━━━━━━━━━━━━━━━
    `.trim()

    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    setIsSubmitting(false)
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travelers: "",
        budget: "",
        message: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Ubicación:",
      details: CONFIG.location,
      action: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(CONFIG.location)}`, "_blank"),
    },
    {
      icon: Phone,
      title: "Teléfono:",
      details: `${CONFIG.phone} / ${CONFIG.phone2}`,
      action: () => window.open(`tel:${CONFIG.phone.replace(/\s/g, "")}`, "_self"),
    },
    {
      icon: Mail,
      title: "Email:",
      details: CONFIG.email,
      action: () => window.open(`mailto:${CONFIG.email}`, "_self"),
    },
  ]

  const destinations = [
    "Cancún y Riviera Maya",
    "Europa",
    "Estados Unidos",
    "Sudamérica",
    "Asia",
    "Cruceros",
    "Otro destino",
  ]

  return (
    <section ref={sectionRef} id="contacto" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 fade-element opacity-0">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Solicita Tu Cotización
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Cuéntanos sobre tu viaje soñado y te enviaremos una propuesta personalizada
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <button
              key={info.title}
              onClick={info.action}
              className="fade-element opacity-0 flex items-start gap-4 text-left group hover:bg-muted/50 p-4 -m-4 rounded-lg transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-sm bg-[#2d3436] flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                <info.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{info.title}</h3>
                <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  {info.details}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="fade-element opacity-0 max-w-4xl mx-auto">
          {submitted ? (
            <div className="text-center py-12 border border-primary bg-primary/5">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">
                ¡Mensaje Enviado!
              </h3>
              <p className="text-muted-foreground">
                Te contactaremos pronto por WhatsApp
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="Nombre completo *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-none border-border bg-muted/30 py-6"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-none border-border bg-muted/30 py-6"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Teléfono *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-none border-border bg-muted/30 py-6"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <Select
                  value={formData.destination}
                  onValueChange={(value) => setFormData({ ...formData, destination: value })}
                >
                  <SelectTrigger className="rounded-none border-border bg-muted/30 py-6 h-auto">
                    <SelectValue placeholder="Destino de interés" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.travelers}
                  onValueChange={(value) => setFormData({ ...formData, travelers: value })}
                >
                  <SelectTrigger className="rounded-none border-border bg-muted/30 py-6 h-auto">
                    <SelectValue placeholder="Número de viajeros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 persona</SelectItem>
                    <SelectItem value="2">2 personas</SelectItem>
                    <SelectItem value="3-4">3-4 personas</SelectItem>
                    <SelectItem value="5-10">5-10 personas</SelectItem>
                    <SelectItem value="10+">Más de 10 personas</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                >
                  <SelectTrigger className="rounded-none border-border bg-muted/30 py-6 h-auto">
                    <SelectValue placeholder="Presupuesto estimado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$10,000 - $25,000 MXN">$10,000 - $25,000 MXN</SelectItem>
                    <SelectItem value="$25,000 - $50,000 MXN">$25,000 - $50,000 MXN</SelectItem>
                    <SelectItem value="$50,000 - $100,000 MXN">$50,000 - $100,000 MXN</SelectItem>
                    <SelectItem value="$100,000+ MXN">$100,000+ MXN</SelectItem>
                    <SelectItem value="Por definir">Por definir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Cuéntanos sobre tu viaje ideal... ¿Qué lugares te gustaría visitar? ¿Fechas tentativas? *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="rounded-none border-border bg-muted/30 mb-6 resize-none"
                required
              />
              
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-sm tracking-wider uppercase font-medium rounded-none gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Al enviar, serás redirigido a WhatsApp para completar tu solicitud
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
