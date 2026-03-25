"use client"

import { useState } from "react"
import { Send, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Tour } from "@/app/page"

// ============================================
// CONFIGURACION
// ============================================
const CONFIG = {
  whatsapp: "525535013294",
  email: "ventas.paradisaea@gmail.com",
}
// ============================================

interface TourInquiryDialogProps {
  tour: Tour | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface InquiryFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  destination: string
  travelers: string
  departureDay: string
  departureMonth: string
  departureYear: string
  returnDay: string
  returnMonth: string
  returnYear: string
  tripType: string
  tripTypeOther: string
  activities: string[]
  activitiesOther: string
  budget: string
  contactPreference: string
}

const emptyFormData: InquiryFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  destination: "",
  travelers: "",
  departureDay: "",
  departureMonth: "",
  departureYear: "",
  returnDay: "",
  returnMonth: "",
  returnYear: "",
  tripType: "",
  tripTypeOther: "",
  activities: [],
  activitiesOther: "",
  budget: "",
  contactPreference: "whatsapp",
}

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))
const months = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 3 }, (_, i) => (currentYear + i).toString())

const tripTypes = [
  { value: "descanso", label: "Descanso" },
  { value: "aventura", label: "Aventura" },
  { value: "familiar", label: "Familiar" },
  { value: "cultural", label: "Cultural" },
  { value: "todo-incluido", label: "Todo incluido" },
  { value: "otro", label: "Otro" },
]

const activitiesOptions = [
  { id: "tours", label: "Tours guiados" },
  { id: "acuaticas", label: "Actividades acuaticas" },
  { id: "gastronomia", label: "Gastronomia" },
  { id: "culturales", label: "Experiencias culturales" },
  { id: "ninos", label: "Actividades para ninos" },
  { id: "nocturna", label: "Vida nocturna" },
  { id: "otro", label: "Otro" },
]

const budgetOptions = [
  { value: "$10,000 - $25,000 MXN", label: "$10,000 - $25,000 MXN" },
  { value: "$25,000 - $50,000 MXN", label: "$25,000 - $50,000 MXN" },
  { value: "$50,000 - $100,000 MXN", label: "$50,000 - $100,000 MXN" },
  { value: "$100,000+ MXN", label: "$100,000+ MXN" },
  { value: "Por definir", label: "Por definir" },
]

// Simulated email function - ready to connect with API
async function sendEmail(data: {
  to: string
  subject: string
  body: string
}): Promise<{ success: boolean }> {
  // This function is prepared to connect with an email API
  // such as Resend, SendGrid, Nodemailer, etc.
  console.log("Email ready to send:", data)
  
  // TODO: Implement actual email sending
  // Example with API route:
  // const response = await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // return response.json()
  
  return { success: true }
}

export function TourInquiryDialog({ tour, open, onOpenChange }: TourInquiryDialogProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    ...emptyFormData,
    destination: tour?.name || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update destination when tour changes
  if (tour && formData.destination !== tour.name && !formData.destination) {
    setFormData((prev) => ({ ...prev, destination: tour.name }))
  }

  const handleActivityChange = (activityId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      activities: checked
        ? [...prev.activities, activityId]
        : prev.activities.filter((a) => a !== activityId),
    }))
  }

  const buildWhatsAppMessage = (): string => {
    const departureDate = formData.departureDay && formData.departureMonth && formData.departureYear
      ? `${formData.departureDay}/${formData.departureMonth}/${formData.departureYear}`
      : "Por definir"
    
    const returnDate = formData.returnDay && formData.returnMonth && formData.returnYear
      ? `${formData.returnDay}/${formData.returnMonth}/${formData.returnYear}`
      : "Por definir"

    const selectedActivities = formData.activities
      .map((id) => {
        if (id === "otro") return formData.activitiesOther || "Otro"
        return activitiesOptions.find((a) => a.id === id)?.label || id
      })
      .join(", ") || "No especificadas"

    const tripTypeLabel = formData.tripType === "otro" 
      ? formData.tripTypeOther || "Otro"
      : tripTypes.find((t) => t.value === formData.tripType)?.label || "No especificado"

    return `
*Nueva Solicitud de Tour - Paradisaea*
━━━━━━━━━━━━━━━━━━━━

*DATOS DEL CLIENTE:*
• Nombre: ${formData.firstName} ${formData.lastName}
• Email: ${formData.email}
• Telefono: ${formData.phone}

*DETALLES DEL VIAJE:*
• Destino: ${formData.destination || tour?.name || "Por definir"}
• Numero de viajeros: ${formData.travelers || "Por definir"}
• Fecha de salida: ${departureDate}
• Fecha de regreso: ${returnDate}

*PREFERENCIAS:*
• Tipo de viaje: ${tripTypeLabel}
• Actividades de interes: ${selectedActivities}

*PRESUPUESTO:*
${formData.budget || "Por definir"}

*PREFERENCIA DE CONTACTO:*
${formData.contactPreference === "whatsapp" ? "WhatsApp" : "Correo electronico"}

━━━━━━━━━━━━━━━━━━━━
    `.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const message = buildWhatsAppMessage()

    // Send to WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    // Also prepare email (simulated - ready to connect)
    await sendEmail({
      to: CONFIG.email,
      subject: `Nueva Solicitud de Tour: ${formData.destination || tour?.name}`,
      body: message,
    })

    setIsSubmitting(false)
    setFormData({ ...emptyFormData })
    onOpenChange(false)
  }

  const handleClose = () => {
    setFormData({ ...emptyFormData })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Solicitar Informacion
          </DialogTitle>
          <DialogDescription>
            {tour ? `Completa el formulario para cotizar: ${tour.name}` : "Completa el formulario para cotizar tu viaje ideal"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Data */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Datos Personales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Tu nombre"
                  required
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Tu apellido"
                  required
                  className="rounded-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+52 55 1234 5678"
                  required
                  className="rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Detalles del Viaje
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destino de interes</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="ej: Cancun, Europa, etc."
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelers">Numero de viajeros</Label>
                <Select
                  value={formData.travelers}
                  onValueChange={(value) => setFormData({ ...formData, travelers: value })}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 persona</SelectItem>
                    <SelectItem value="2">2 personas</SelectItem>
                    <SelectItem value="3-4">3-4 personas</SelectItem>
                    <SelectItem value="5-10">5-10 personas</SelectItem>
                    <SelectItem value="10+">Mas de 10 personas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Fechas Tentativas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure Date */}
              <div className="space-y-2">
                <Label>Fecha de Salida</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={formData.departureDay}
                    onValueChange={(value) => setFormData({ ...formData, departureDay: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.departureMonth}
                    onValueChange={(value) => setFormData({ ...formData, departureMonth: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.departureYear}
                    onValueChange={(value) => setFormData({ ...formData, departureYear: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Return Date */}
              <div className="space-y-2">
                <Label>Fecha de Regreso</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={formData.returnDay}
                    onValueChange={(value) => setFormData({ ...formData, returnDay: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.returnMonth}
                    onValueChange={(value) => setFormData({ ...formData, returnMonth: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.returnYear}
                    onValueChange={(value) => setFormData({ ...formData, returnYear: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Preferencias de Viaje
            </h3>
            
            {/* Trip Type */}
            <div className="space-y-3">
              <Label>Tipo de viaje</Label>
              <RadioGroup
                value={formData.tripType}
                onValueChange={(value) => setFormData({ ...formData, tripType: value })}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              >
                {tripTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`trip-${type.value}`} />
                    <Label htmlFor={`trip-${type.value}`} className="text-sm font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {formData.tripType === "otro" && (
                <Input
                  value={formData.tripTypeOther}
                  onChange={(e) => setFormData({ ...formData, tripTypeOther: e.target.value })}
                  placeholder="Especifica el tipo de viaje"
                  className="rounded-none mt-2"
                />
              )}
            </div>

            {/* Activities */}
            <div className="space-y-3">
              <Label>Actividades de interes</Label>
              <div className="grid grid-cols-2 gap-2">
                {activitiesOptions.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`activity-${activity.id}`}
                      checked={formData.activities.includes(activity.id)}
                      onCheckedChange={(checked) => handleActivityChange(activity.id, checked === true)}
                    />
                    <Label htmlFor={`activity-${activity.id}`} className="text-sm font-normal cursor-pointer">
                      {activity.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.activities.includes("otro") && (
                <Input
                  value={formData.activitiesOther}
                  onChange={(e) => setFormData({ ...formData, activitiesOther: e.target.value })}
                  placeholder="Especifica otras actividades"
                  className="rounded-none mt-2"
                />
              )}
            </div>
          </div>

          {/* Budget & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Presupuesto y Contacto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto aproximado</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prefiero que me contacten por</Label>
                <RadioGroup
                  value={formData.contactPreference}
                  onValueChange={(value) => setFormData({ ...formData, contactPreference: value })}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                    <Label htmlFor="contact-whatsapp" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="contact-email" />
                    <Label htmlFor="contact-email" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Correo
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-none"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Enviando..." : "Enviar a WhatsApp"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Al enviar, se abrira WhatsApp con tu solicitud lista para enviar
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
