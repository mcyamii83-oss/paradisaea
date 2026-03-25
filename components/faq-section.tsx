"use client"

import { useRef, useEffect } from "react"
import { HelpCircle, Package, Palette, CreditCard, Receipt, XCircle, Shield, Award } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    id: "paquetes",
    icon: Package,
    question: "Que incluyen los paquetes de viaje?",
    answer: "Nuestros paquetes estan disenados para que no te preocupes por nada. Incluyen vuelos redondos, hospedaje de calidad, traslados aeropuerto-hotel-aeropuerto, seguro de viaje basico y asistencia 24/7. Dependiendo del destino y paquete seleccionado, pueden incluir tours, comidas y actividades especiales. Te entregamos un itinerario detallado para que sepas exactamente que esperar.",
  },
  {
    id: "personalizacion",
    icon: Palette,
    question: "Puedo personalizar mi viaje a mi gusto?",
    answer: "Absolutamente! En Paradisaea creemos que cada viajero es unico. Podemos ajustar fechas, cambiar hoteles, agregar excursiones privadas, incluir experiencias gastronomicas, modificar duracion del viaje y crear itinerarios completamente a la medida. Solo cuentanos tu sueno y nosotros lo hacemos realidad. La personalizacion no tiene costo adicional por el servicio, solo pagas las diferencias en servicios.",
  },
  {
    id: "pagos",
    icon: CreditCard,
    question: "Cuales son las formas de pago disponibles?",
    answer: "Aceptamos multiples formas de pago para tu comodidad: transferencia bancaria (SPEI), deposito en efectivo, tarjetas de debito y credito (Visa, Mastercard, American Express). Tambien puedes apartar tu viaje con un anticipo del 30% y liquidar el resto antes de la fecha de salida. Trabajamos con planes de pago flexibles para que viajar sea accesible para todos.",
  },
  {
    id: "msi",
    icon: CreditCard,
    question: "Ofrecen meses sin intereses (MSI)?",
    answer: "Si! Puedes pagar tu viaje hasta en 12 meses sin intereses con tarjetas participantes. Bancos como Banamex, HSBC, Santander, Banorte y BBVA suelen tener promociones disponibles. Al momento de cotizar, te informamos las opciones vigentes de MSI para que elijas la que mejor se adapte a tu presupuesto. Viajar nunca habia sido tan facil de pagar.",
  },
  {
    id: "impuestos",
    icon: Receipt,
    question: "Los precios incluyen impuestos?",
    answer: "Todos nuestros precios mostrados incluyen impuestos y cargos por servicio. El precio que ves es el precio final, sin sorpresas ocultas. En el desglose de tu cotizacion podras ver: tarifa base, impuestos, TUA (Tarifa de Uso de Aeropuerto) si aplica, y cualquier cargo adicional. Creemos en la transparencia total para que tomes decisiones informadas.",
  },
  {
    id: "cancelaciones",
    icon: XCircle,
    question: "Cual es la politica de cancelaciones?",
    answer: "Entendemos que los planes pueden cambiar. Nuestra politica de cancelacion es clara: con mas de 30 dias de anticipacion, reembolso del 90%; entre 15-30 dias, reembolso del 70%; menos de 15 dias, se aplican penalizaciones segun el proveedor. Tambien ofrecemos la opcion de cambiar fechas o destino sin cargo adicional de nuestra parte (sujeto a disponibilidad). Te recomendamos siempre adquirir el seguro de cancelacion para mayor tranquilidad.",
  },
  {
    id: "seguros",
    icon: Shield,
    question: "Que seguros de viaje ofrecen?",
    answer: "Todos nuestros paquetes incluyen un seguro basico de viaje. Adicionalmente, ofrecemos seguros premium que cubren: gastos medicos hasta $100,000 USD, cancelacion por cualquier motivo, perdida de equipaje, demora de vuelos, asistencia legal, repatriacion y mas. Trabajamos con aseguradoras reconocidas como Assist Card, World Nomads y Allianz. Un viaje protegido es un viaje tranquilo.",
  },
  {
    id: "agencia",
    icon: Award,
    question: "Por que elegir una agencia en vez de reservar solo?",
    answer: "Reservar con Paradisaea te da ventajas invaluables: acceso a tarifas preferenciales negociadas, atencion personalizada antes, durante y despues del viaje, respaldo legal como empresa registrada ante SECTUR, apoyo inmediato ante cualquier imprevisto, itinerarios optimizados por expertos, y la tranquilidad de tener un aliado que conoce los destinos. Ademas, ahorramos tu tiempo investigando y comparando. Viajar con agencia es viajar inteligente.",
  },
]

export function FAQSection() {
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

  return (
    <section ref={sectionRef} id="faq" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 fade-element opacity-0">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Preguntas Frecuentes
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Resolvemos tus dudas para que viajes con total confianza
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="fade-element opacity-0 bg-background border border-border px-6 data-[state=open]:border-primary/50 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AccordionTrigger className="hover:no-underline py-5 group">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center flex-shrink-0 group-data-[state=open]:bg-primary/10 transition-colors">
                    <faq.icon className="w-5 h-5 text-muted-foreground group-data-[state=open]:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pt-0 pl-14 pr-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="text-center mt-12 fade-element opacity-0">
          <p className="text-muted-foreground text-sm mb-4">
            ¿Tienes otra pregunta? Estamos para ayudarte
          </p>
          <a
            href="https://wa.me/525535013294?text=Hola!%20Tengo%20una%20pregunta%20sobre%20sus%20servicios%20de%20viaje"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 fill-current"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
