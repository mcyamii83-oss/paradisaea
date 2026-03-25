"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Check,
  ArrowRight,
  Calendar
} from "lucide-react"
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
import { useBlog, BlogPost } from "@/lib/blog-context"

interface BlogPreviewSectionProps {
  isAdmin: boolean
}

export function BlogPreviewSection({ isAdmin }: BlogPreviewSectionProps) {
  const { posts, setPosts } = useBlog()
  const sectionRef = useRef<HTMLElement>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
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
  }, [posts])

  const handleOpenSheet = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
      })
    } else {
      setEditingPost(null)
      setFormData({ title: "", content: "", imageUrl: "" })
    }
    setIsSheetOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const postData: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      date: editingPost?.date || new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      comments: editingPost?.comments || []
    }

    if (editingPost) {
      setPosts(posts.map((p) => p.id === editingPost.id ? postData : p))
    } else {
      setPosts([postData, ...posts])
    }
    
    setIsSheetOpen(false)
    setFormData({ title: "", content: "", imageUrl: "" })
  }

  const handleDelete = () => {
    if (deleteId) {
      setPosts(posts.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  // Get summary from content (first 120 characters)
  const getSummary = (content: string) => {
    const cleanContent = content.replace(/\*\*/g, "").replace(/\n/g, " ")
    return cleanContent.length > 120 
      ? cleanContent.substring(0, 120) + "..." 
      : cleanContent
  }

  return (
    <section ref={sectionRef} id="blog-posts" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 fade-element opacity-0">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Ultimas Entradas
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Inspiracion y consejos para tu proximo destino
          </p>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => handleOpenSheet()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-none"
            >
              <Plus className="w-4 h-4" />
              Nuevo Articulo
            </Button>
          </div>
        )}

        {/* Blog Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 6).map((post, index) => (
            <article
              key={post.id}
              className="fade-element opacity-0 bg-background border border-border group hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white rounded-none"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleOpenSheet(post)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-destructive hover:text-white rounded-none"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDeleteId(post.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                
                <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {getSummary(post.content)}
                </p>

                {/* Read More Button */}
                <Link href={`/blog/${post.id}`}>
                  <Button
                    variant="ghost"
                    className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 gap-2 rounded-none group/btn"
                  >
                    Leer mas
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No hay articulos publicados.
            </p>
            {isAdmin && (
              <Button
                onClick={() => handleOpenSheet()}
                className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
              >
                <Plus className="h-4 w-4" />
                Crear Primer Articulo
              </Button>
            )}
          </div>
        )}

        {/* View All Button */}
        {posts.length > 3 && (
          <div className="text-center mt-12 fade-element opacity-0">
            <Link href="/blog">
              <Button
                variant="outline"
                className="rounded-none px-8 py-6 text-sm gap-2"
              >
                Ver Todos los Articulos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl">
              {editingPost ? "Editar Articulo" : "Nuevo Articulo"}
            </SheetTitle>
            <SheetDescription>
              {editingPost ? "Actualiza el contenido del articulo" : "Crea un nuevo articulo para el blog"}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Imagen del Articulo
              </Label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                aspectRatio="video"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Titulo *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titulo del articulo"
                required
                className="rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Contenido *
              </Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escribe el contenido del articulo..."
                rows={10}
                required
                className="resize-none rounded-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-none"
                onClick={() => setIsSheetOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 rounded-none">
                <Check className="w-4 h-4 mr-2" />
                {editingPost ? "Guardar" : "Publicar"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar articulo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El articulo sera eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-none"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
