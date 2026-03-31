"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowRight,
  Calendar,
  Loader2,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { ImageUpload } from "@/components/image-upload"
import { supabase } from "@/lib/supabase"

interface BlogPreviewSectionProps {
  isAdmin: boolean
}

export interface BlogPost {
  id: string
  title: string
  content: string
  imageUrl: string
  date: string
  comments: any[]
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"

export function BlogPreviewSection({ isAdmin }: BlogPreviewSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  })

  // 1. CARGAR DATOS (Mapeo correcto de image_url a imageUrl)
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false })
        .limit(6)

      if (error) throw error

      if (data) {
        setPosts(data.map((p: any) => ({
          id: String(p.id),
          title: p.title,
          content: p.content,
          imageUrl: p.image_url || DEFAULT_IMAGE, // Asegura que lea la columna de la DB
          date: p.date,
          comments: p.comments || []
        })))
      }
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Animaciones
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
  }, [posts])

  const handleOpenSheet = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({ title: post.title, content: post.content, imageUrl: post.imageUrl })
    } else {
      setEditingPost(null)
      setFormData({ title: "", content: "", imageUrl: "" })
    }
    setIsSheetOpen(true)
  }

  // 2. GUARDAR CON SUBIDA DE ARCHIVO REAL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let finalImageUrl = formData.imageUrl

      // Intentar capturar el archivo del input dentro de ImageUpload
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = fileInput?.files?.[0]

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `blog/${fileName}`

        // Subida al Storage
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Obtener URL Pública
        const { data: urlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath)
        
        finalImageUrl = urlData.publicUrl
      }

      const postDataForDB = {
  title: formData.title,
  content: formData.content,
  image_url: finalImageUrl || DEFAULT_IMAGE,
  // CAMBIA ESTO:
  date: editingPost?.date || new Date().toISOString().split('T')[0], 
  // Esto generará "2026-03-30", que Supabase sí acepta.
};

      if (editingPost) {
        const { error } = await supabase.from('posts').update(postDataForDB).eq('id', editingPost.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').insert([postDataForDB])
        if (error) throw error
      }

      await fetchPosts()
      setIsSheetOpen(false)
      setFormData({ title: "", content: "", imageUrl: "" })
    } catch (err: any) {
      alert("Error: " + (err.message || "No se pudo guardar"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('posts').delete().eq('id', deleteId)
      if (error) throw error
      setPosts(prev => prev.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch (err: any) {
      alert("Error al eliminar: " + err.message)
    }
  }

  const getSummary = (content: string) => {
    const cleanContent = content.replace(/\*\*/g, "").replace(/\n/g, " ")
    return cleanContent.length > 120 ? cleanContent.substring(0, 120) + "..." : cleanContent
  }

  return (
    <section ref={sectionRef} id="blog-posts" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 fade-element opacity-0">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">Últimas Entradas
</h2>
          <p className="text-muted-foreground mt-3 text-sm">Inspiración y consejos para tu próximo destino</p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button onClick={() => handleOpenSheet()} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-none px-8">
              <Plus className="w-4 h-4" /> Nuevo Artículo
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className="fade-element opacity-0 bg-background border border-border group hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                  />
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 rounded-none shadow-sm" onClick={() => handleOpenSheet(post)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-destructive hover:text-white rounded-none shadow-sm" onClick={() => setDeleteId(post.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" /> <span>{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{getSummary(post.content)}</p>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 gap-2 rounded-none group/btn">
                      Leer más <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl">{editingPost ? "Editar Artículo" : "Nuevo Artículo"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 pb-10">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagen (Desde tu PC)</Label>
              <ImageUpload 
                value={formData.imageUrl} 
                onChange={(url) => setFormData({ ...formData, imageUrl: url })} 
                aspectRatio="video" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Título *</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                required 
                className="rounded-none" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contenido *</Label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                rows={10} 
                required 
                className="resize-none rounded-none" 
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary rounded-none py-6">
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              {editingPost ? "Guardar Cambios" : "Publicar Artículo"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará permanentemente de la base de datos.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90 rounded-none">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}