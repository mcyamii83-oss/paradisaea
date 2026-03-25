"use client"

import { useEffect, useRef, useState } from "react"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Check,
  Facebook,
  Twitter,
  Link2,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Calendar,
  User
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

export interface BlogComment {
  id: string
  author: string
  text: string
  date: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  imageUrl: string
  date: string
  comments: BlogComment[]
}

interface BlogPostsSectionProps {
  posts: BlogPost[]
  setPosts: (posts: BlogPost[]) => void
  isAdmin: boolean
}

export function BlogPostsSection({ posts, setPosts, isAdmin }: BlogPostsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  })

  // Comments state for each post
  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; text: string }>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    setImageFile(null)
    setIsSheetOpen(true)
  }

  const handleImageChange = (url: string, file?: File) => {
    setFormData({ ...formData, imageUrl: url })
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If there's a file, you would upload it here
    // const uploadedUrl = imageFile ? await uploadImage(imageFile) : formData.imageUrl
    
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
    setImageFile(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      setPosts(posts.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  // Share functions
  const shareOnFacebook = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.id}`
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    )
  }

  const shareOnTwitter = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.id}`
    const text = post.title
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "width=600,height=400"
    )
  }

  const copyLink = async (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(post.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopiedId(post.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // Comments functions
  const handleCommentSubmit = (postId: string) => {
    const input = commentInputs[postId]
    if (!input?.author?.trim() || !input?.text?.trim()) return

    const newComment: BlogComment = {
      id: Date.now().toString(),
      author: input.author,
      text: input.text,
      date: new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }

    setPosts(posts.map((p) => 
      p.id === postId 
        ? { ...p, comments: [...p.comments, newComment] }
        : p
    ))

    setCommentInputs({ ...commentInputs, [postId]: { author: "", text: "" } })
  }

  const updateCommentInput = (postId: string, field: "author" | "text", value: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: {
        ...commentInputs[postId],
        [field]: value
      }
    })
  }

  return (
    <section ref={sectionRef} id="blog-posts" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 fade-element opacity-0">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Blog de Viajes
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

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="fade-element opacity-0 bg-background border border-border group"
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
                      onClick={() => handleOpenSheet(post)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-destructive hover:text-white rounded-none"
                      onClick={() => setDeleteId(post.id)}
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
                
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                  {post.content}
                </p>

                {/* Share Buttons */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">Compartir:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-blue-600 rounded-none"
                      onClick={() => shareOnFacebook(post)}
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Compartir en Facebook</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-sky-500 rounded-none"
                      onClick={() => shareOnTwitter(post)}
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Compartir en X</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-primary rounded-none relative"
                      onClick={() => copyLink(post)}
                    >
                      <Link2 className="h-4 w-4" />
                      <span className="sr-only">Copiar enlace</span>
                      {copiedId === post.id && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background px-2 py-1 rounded whitespace-nowrap">
                          Copiado!
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Comments Section Toggle */}
                <Button
                  variant="ghost"
                  className="w-full mt-3 text-muted-foreground hover:text-foreground gap-2 rounded-none"
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {post.comments.length} Comentario{post.comments.length !== 1 ? "s" : ""}
                  </span>
                  {expandedPostId === post.id ? (
                    <ChevronUp className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  )}
                </Button>

                {/* Expanded Comments */}
                {expandedPostId === post.id && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    {/* Existing Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {post.comments.map((comment) => (
                          <div 
                            key={comment.id} 
                            className="bg-muted/50 p-3 text-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium text-foreground">
                                {comment.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {comment.date}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Form */}
                    <div className="space-y-3">
                      <Input
                        placeholder="Tu nombre"
                        value={commentInputs[post.id]?.author || ""}
                        onChange={(e) => updateCommentInput(post.id, "author", e.target.value)}
                        className="rounded-none text-sm"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escribe un comentario..."
                          value={commentInputs[post.id]?.text || ""}
                          onChange={(e) => updateCommentInput(post.id, "text", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleCommentSubmit(post.id)
                            }
                          }}
                          className="rounded-none text-sm flex-1"
                        />
                        <Button
                          size="icon"
                          className="rounded-none shrink-0"
                          onClick={() => handleCommentSubmit(post.id)}
                        >
                          <Send className="w-4 h-4" />
                          <span className="sr-only">Enviar comentario</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
                onChange={handleImageChange}
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
