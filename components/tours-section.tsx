"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Pencil, Trash2, Loader2, Calendar, Clock } from "lucide-react" // Añadimos Clock
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { TourInquiryDialog } from "@/components/tour-inquiry-dialog"
import { ImageUpload } from "@/components/image-upload"
import { supabase } from "@/lib/supabase"
import type { Tour } from "@/app/page"

interface ToursSectionProps {
  isAdmin: boolean
}

interface TourFormData {
  name: string
  location: string // Usaremos este para "Día de Salida"
  description: string // Usaremos este para "Duración"
  price: string
  imageUrl: string
}

const emptyFormData: TourFormData = {
  name: "",
  location: "",
  description: "",
  price: "",
  imageUrl: "",
}

const DEFAULT_TOUR_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"

export function ToursSection({ isAdmin }: ToursSectionProps) {
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoadingTours, setIsLoadingTours] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [formData, setFormData] = useState<TourFormData>(emptyFormData)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tourToDelete, setTourToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const toursPerPage = 8

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoadingTours(true)
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error("Error al cargar:", error.message)
      } else if (data) {
        const formattedTours: Tour[] = data.map((t: any) => ({
          id: String(t.id),
          name: t.name || "Sin nombre",
          location: t.location || "",
          description: t.description || "", // Aquí guardamos la duración
          price: Number(t.price || 0),
          imageUrl: t.image_url || DEFAULT_TOUR_IMAGE, 
        }))
        setTours(formattedTours)
      }
      setIsLoadingTours(false)
    }
    fetchTours()
  }, [])

  const handleTourClick = (tour: Tour) => {
    if (!isAdmin) {
      setSelectedTour(tour)
      setInquiryDialogOpen(true)
    }
  }

  const handleOpenSheet = (tour?: Tour) => {
    if (tour) {
      setEditingTour(tour)
      setFormData({
        name: tour.name,
        location: tour.location || "",
        description: tour.description || "",
        price: tour.price.toString(),
        imageUrl: tour.imageUrl,
      })
    } else {
      setEditingTour(null)
      setFormData(emptyFormData)
    }
    setIsSheetOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const tourDataForSupabase = {
      name: formData.name,
      location: formData.location,
      description: formData.description, // Se guarda la duración
      price: parseFloat(formData.price),
      image_url: formData.imageUrl || DEFAULT_TOUR_IMAGE,
    }

    try {
      if (editingTour) {
        const { error } = await supabase
          .from('tours')
          .update(tourDataForSupabase)
          .eq('id', editingTour.id)
        if (error) throw error
        setTours(prev => prev.map(t => t.id === editingTour.id ? { ...t, ...formData, price: parseFloat(formData.price) } : t))
      } else {
        const { data, error } = await supabase
          .from('tours')
          .insert([tourDataForSupabase])
          .select()
        
        if (error) throw error
        if (data && data[0]) {
          const newTour = {
            ...data[0],
            id: String(data[0].id),
            imageUrl: data[0].image_url,
            description: data[0].description
          }
          setTours(prev => [newTour, ...prev])
        }
      }
      setIsSheetOpen(false)
      setFormData(emptyFormData)
      setEditingTour(null)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (tourToDelete) {
      setIsSubmitting(true)
      try {
        const { error } = await supabase.from('tours').delete().eq('id', tourToDelete)
        if (error) throw error
        setTours((prev) => prev.filter((t) => t.id !== tourToDelete))
      } catch (error: any) {
        alert(`Error al eliminar: ${error.message}`)
      } finally {
        setDeleteDialogOpen(false)
        setTourToDelete(null)
        setIsSubmitting(false)
      }
    }
  }

  const totalPages = Math.ceil(tours.length / toursPerPage)
  const displayedTours = tours.slice(currentPage * toursPerPage, (currentPage + 1) * toursPerPage)

  return (
    <section ref={sectionRef} id="tours" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl italic text-foreground">Explora Nuestros Tours</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Experiencias inolvidables diseñadas para ti.</p>
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-8">
            <Button onClick={() => handleOpenSheet()} className="rounded-none gap-2 bg-primary">
              <Plus className="h-4 w-4" /> Agregar Nuevo Tour
            </Button>
          </div>
        )}

        {isLoadingTours ? (
          <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedTours.map((tour) => (
              <article
                key={tour.id}
                className="group cursor-pointer border border-border p-2 bg-white flex flex-col hover:border-primary/30 transition-colors"
                onClick={() => handleTourClick(tour)}
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-muted">
                  <img src={tour.imageUrl} alt={tour.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-none" onClick={(e) => { e.stopPropagation(); handleOpenSheet(tour); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8 rounded-none" onClick={(e) => { e.stopPropagation(); setTourToDelete(tour.id); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex-grow px-1">
                  <h3 className="font-semibold text-sm truncate text-foreground mb-2">{tour.name}</h3>
                  
                  {/* Día de Salida */}
                  <div className="flex items-center text-muted-foreground text-[10px] mb-1">
                    <Calendar className="h-3 w-3 mr-1 text-primary" />
                    <span>Salida: {tour.location}</span>
                  </div>

                  {/* Duración del Tour */}
                  <div className="flex items-center text-muted-foreground text-[10px] mb-3">
                    <Clock className="h-3 w-3 mr-1 text-primary" />
                    <span>Duración: {tour.description}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-0 mt-auto border-t pt-2">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">Desde</span>
                  <span className="text-primary font-bold text-sm">${tour.price.toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i)} className={`w-2 h-2 rounded-full ${currentPage === i ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader><SheetTitle>{editingTour ? "Editar Tour" : "Nuevo Tour"}</SheetTitle></SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Tour</Label>
              <Input id="name" placeholder="Ej: Tour a las Cascadas" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="rounded-none" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Día de Salida</Label>
              <Input id="location" placeholder="Ej: Sábados y Domingos" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="rounded-none" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Duración del Tour</Label>
              <Input id="description" placeholder="Ej: 3 días, 2 noches" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-none" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Precio desde (Solo números)</Label>
              <Input id="price" type="number" placeholder="1500" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="rounded-none" />
            </div>

            <div className="grid gap-2">
              <Label>Imagen del Tour</Label>
              <ImageUpload value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url })} aspectRatio="video" />
            </div>

            <Button type="submit" className="w-full rounded-none h-12 text-base font-medium" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              {editingTour ? "Actualizar Tour" : "Crear Tour"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <TourInquiryDialog tour={selectedTour} open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tour?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive rounded-none">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}