"use client"

import { useEffect, useRef, useState } from "react"
import { Quote, Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface Testimonial {
  id: string
  text: string
  author: string
  role: string
}

interface BlogSectionProps {
  testimonials: Testimonial[]
  setTestimonials: (testimonials: Testimonial[]) => void
  isAdmin: boolean
}

export function BlogSection({ testimonials, setTestimonials, isAdmin }: BlogSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    role: "",
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

  const handleOpenSheet = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        text: testimonial.text,
        author: testimonial.author,
        role: testimonial.role,
      })
    } else {
      setEditingTestimonial(null)
      setFormData({ text: "", author: "", role: "" })
    }
    setIsSheetOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTestimonial) {
      setTestimonials(
        testimonials.map((t) =>
          t.id === editingTestimonial.id
            ? { ...t, ...formData }
            : t
        )
      )
    } else {
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        ...formData,
      }
      setTestimonials([...testimonials, newTestimonial])
    }
    setIsSheetOpen(false)
    setFormData({ text: "", author: "", role: "" })
  }

  const handleDelete = () => {
    if (deleteId) {
      setTestimonials(testimonials.filter((t) => t.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <section ref={sectionRef} id="blog" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 fade-element opacity-0">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Testimonios
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Lo que dicen nuestros viajeros
          </p>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => handleOpenSheet()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Testimonio
            </Button>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="fade-element opacity-0 text-center p-6 border border-border relative group bg-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleOpenSheet(testimonial)}
                    className="p-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setDeleteId(testimonial.id)}
                    className="p-2 bg-destructive text-white rounded-sm hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex justify-center mb-4">
                <Quote className="w-8 h-8 text-primary/30" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {testimonial.text}
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-muted-foreground text-xs">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                currentPage === index ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl">
              {editingTestimonial ? "Editar Testimonio" : "Nuevo Testimonio"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Testimonio *
              </label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Escribe el testimonio..."
                rows={5}
                required
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre del Autor *
              </label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Rol / Profesión *
              </label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ej: Empresario, Viajero, etc."
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsSheetOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                <Check className="w-4 h-4 mr-2" />
                {editingTestimonial ? "Guardar" : "Agregar"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar testimonio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El testimonio será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
