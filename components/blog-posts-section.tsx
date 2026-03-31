"use client"

import { useEffect, useRef, useState } from "react"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar,
  MessageCircle,
  Send,
  Link2,
  Loader2
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
  isAdmin: boolean
}

const DEFAULT_BLOG_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"

export function BlogPostsSection({ isAdmin }: BlogPostsSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  })

  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; text: string }>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // 1. CARGAR POSTS DESDE SUPABASE
  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Intentando conectar con Supabase...");
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        alert("Error de Supabase: " + error.message);
        console.error("Error al cargar posts:", error);
      } else if (data) {
        console.log("Datos recibidos de la DB:", data);
        
        // Si la lista viene vacía, esto te avisará
        if (data.length === 0) {
          console.warn("La tabla 'posts' está vacía en Supabase.");
        }

        const formattedPosts = data.map((p: any) => ({
          id: String(p.id),
          title: p.title || "Sin título",
          content: p.content || "",
          // REVISIÓN CRÍTICA DE COLUMNA:
          imageUrl: p.image_url || p.imageUrl || DEFAULT_BLOG_IMAGE,
          date: p.date || "Sin fecha",
          comments: Array.isArray(p.comments) ? p.comments : []
        }));
        setPosts(formattedPosts);
      }
    };
    fetchPosts();
  }, []);

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

  // 2. GUARDAR O EDITAR EN SUPABASE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    
    try {
      const postDataForSupabase = {
        title: formData.title,
        content: formData.content,
        image_url: formData.imageUrl || DEFAULT_BLOG_IMAGE,
        author: "Yami", 
        category: "General",
        date: editingPost ? editingPost.date : new Date().toLocaleDateString("es-MX"),
        excerpt: formData.content.substring(0, 100) + "..."
      };

      if (editingPost) {
        // ACTUALIZAR POST EXISTENTE
        const { error } = await supabase
          .from('posts')
          .update(postDataForSupabase)
          .eq('id', editingPost.id);

        if (error) throw error;

        setPosts(prev => prev.map(p => 
          p.id === editingPost.id ? { ...p, ...formData } : p
        ));
        alert("¡Artículo actualizado correctamente!");
      } else {
        // INSERTAR NUEVO POST
        const { data, error } = await supabase
          .from('posts')
          .insert([postDataForSupabase])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          const newPost: BlogPost = {
            id: String(data[0].id),
            title: data[0].title,
            content: data[0].content,
            imageUrl: data[0].image_url,
            date: data[0].date,
            comments: []
          };
          setPosts(prev => [newPost, ...prev]);
          alert("¡Artículo publicado con éxito!");
        }
      }

      setIsSheetOpen(false);
      setEditingPost(null);
      setFormData({ title: "", content: "", imageUrl: "" });

    } catch (err: any) {
      console.error("Error en Supabase:", err);
      alert("Error al guardar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. ELIMINAR POST DE SUPABASE
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      alert("Artículo eliminado.");
    } catch (err: any) {
      alert("No se pudo eliminar: " + err.message);
    }
  };

  const updateCommentInput = (postId: string, field: "author" | "text", value: string) => {
    setCommentInputs({ ...commentInputs, [postId]: { ...commentInputs[postId], [field]: value } })
  }

  const copyLink = async (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.id}`
    await navigator.clipboard.writeText(url)
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section id="blog-posts" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl italic text-foreground">Blog de Viajes</h2>
          <p className="text-muted-foreground mt-3">Inspiración para tu próximo destino</p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-10">
            <Button onClick={() => handleOpenSheet()} className="bg-primary rounded-none gap-2 px-8">
              <Plus className="w-4 h-4" /> Nuevo Artículo
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-background border border-border group flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-none bg-white/90" onClick={() => handleOpenSheet(post)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-none text-white" onClick={() => setDeleteId(post.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" /> <span>{post.date}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">{post.content}</p>

                <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyLink(post)}>
                    <Link2 className="h-4 w-4" />
                    {copiedId === post.id && <span className="absolute -top-8 text-[10px] bg-black text-white px-2 py-1">¡Copiado!</span>}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-2" onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments?.length || 0} Comentarios
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* PANEL LATERAL PARA AGREGAR/EDITAR */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingPost ? "Editar Artículo" : "Nuevo Artículo"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label>Imagen de Portada</Label>
              <ImageUpload value={formData.imageUrl} onChange={(url) => setFormData({...formData, imageUrl: url})} aspectRatio="video" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-title">Título</Label>
              <Input 
                id="post-title"
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                required 
                className="rounded-none h-11" 
                placeholder="Ej: Mi viaje por Europa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">Contenido</Label>
              <Textarea 
                id="post-content"
                value={formData.content} 
                onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                rows={12} 
                required 
                className="rounded-none resize-none" 
                placeholder="Escribe el artículo aquí..."
              />
            </div>

            <Button type="submit" className="w-full h-12 rounded-none text-base font-medium" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {editingPost ? "Guardar Cambios" : "Publicar Ahora"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* DIÁLOGO DE ELIMINAR */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es permanente y no se podrá deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white rounded-none">
              Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}