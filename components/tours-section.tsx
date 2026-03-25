"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { TourInquiryDialog } from "@/components/tour-inquiry-dialog"
import { ImageUpload } from "@/components/image-upload"
import type { Tour } from "@/app/page"

interface ToursSectionProps {
  tours: Tour[]
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>
  isAdmin: boolean
}

interface TourFormData {
  name: string
  location: string
  description: string
  price: string
  originalPrice: string
  imageUrl: string
}

const emptyFormData: TourFormData = {
  name: "",
  location: "",
  description: "",
  price: "",
  originalPrice: "",
  imageUrl: "",
}

export function ToursSection({ tours, setTours, isAdmin }: ToursSectionProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [formData, setFormData] = useState<TourFormData>(emptyFormData)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tourToDelete, setTourToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const toursPerPage = 4

  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour)
    setInquiryDialogOpen(true)
  }

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

    const cards = sectionRef.current?.querySelectorAll(".tour-card")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [tours, currentPage])

  const handleOpenSheet = (tour?: Tour) => {
    if (tour) {
      setEditingTour(tour)
      setFormData({
        name: tour.name,
        location: tour.location || "",
        description: tour.description,
        price: tour.price.toString(),
        originalPrice: tour.originalPrice?.toString() || "",
        imageUrl: tour.imageUrl,
      })
    } else {
      setEditingTour(null)
      setFormData(emptyFormData)
    }
    setIsSheetOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      return
    }

    const tourData: Tour = {
      id: editingTour?.id || Date.now().toString(),
      name: formData.name,
      location: formData.location,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    }

    if (editingTour) {
      setTours((prev) =>
        prev.map((t) => (t.id === editingTour.id ? tourData : t))
      )
    } else {
      setTours((prev) => [...prev, tourData])
    }

    setIsSheetOpen(false)
    setFormData(emptyFormData)
    setEditingTour(null)
  }

  const handleDelete = (id: string) => {
    setTourToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (tourToDelete) {
      setTours((prev) => prev.filter((t) => t.id !== tourToDelete))
    }
    setDeleteDialogOpen(false)
    setTourToDelete(null)
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const totalPages = Math.ceil(tours.length / toursPerPage)
  const displayedTours = tours.slice(currentPage * toursPerPage, (currentPage + 1) * toursPerPage)

  return (
    <section
      ref={sectionRef}
      id="tours"
      className="py-20 md:py-28 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Tour Places
          </h2>
        </div>

        {/* Admin Button */}
        {isAdmin && (
          <div className="flex justify-end mb-8">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  onClick={() => handleOpenSheet()}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Tour
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl">
                    {editingTour ? "Editar Tour" : "Agregar Nuevo Tour"}
                  </SheetTitle>
                  <SheetDescription>
                    {editingTour
                      ? "Actualiza los detalles del tour"
                      : "Completa los detalles para crear un nuevo tour"}
                  </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Tour</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="ej: Comida Típica Catalana"
                      required
                      className="rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="ej: chittagong, bangladesh"
                      className="rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Describe la experiencia..."
                      rows={3}
                      className="rounded-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="2200"
                        min="0"
                        required
                        className="rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Precio Original</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, originalPrice: e.target.value })
                        }
                        placeholder="3000"
                        min="0"
                        className="rounded-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Imagen del Tour</Label>
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                      aspectRatio="video"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-none"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
                    >
                      {editingTour ? "Guardar" : "Crear Tour"}
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Tours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedTours.map((tour, index) => (
            <article
              key={tour.id}
              className="tour-card group opacity-0 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => !isAdmin && handleTourClick(tour)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isAdmin) handleTourClick(tour)
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <img
                  src={tour.imageUrl}
                  alt={tour.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white rounded-none"
                      onClick={() => handleOpenSheet(tour)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Editar tour</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-destructive hover:text-destructive-foreground rounded-none"
                      onClick={() => handleDelete(tour.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Eliminar tour</span>
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-foreground text-base mb-1">
                  {tour.name}
                </h3>
                {tour.location && (
                  <p className="text-muted-foreground text-xs mb-2">
                    {tour.location}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">
                      {formatPrice(tour.price)}
                    </span>
                    {tour.originalPrice && (
                      <span className="text-muted-foreground text-sm line-through">
                        {formatPrice(tour.originalPrice)}
                      </span>
                    )}
                  </div>
                  {!isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none text-xs px-3 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTourClick(tour)
                      }}
                    >
                      Cotizar
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No hay tours disponibles.
            </p>
            {isAdmin && (
              <Button
                onClick={() => handleOpenSheet()}
                className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
              >
                <Plus className="h-4 w-4" />
                Agregar Tu Primer Tour
              </Button>
            )}
          </div>
        )}

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, index) => (
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
        )}
      </div>

      {/* Tour Inquiry Dialog */}
      <TourInquiryDialog
        tour={selectedTour}
        open={inquiryDialogOpen}
        onOpenChange={setInquiryDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Tour</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este tour? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
