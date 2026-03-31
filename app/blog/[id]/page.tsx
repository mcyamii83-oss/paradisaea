"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Facebook, 
  Twitter, 
  Link2, 
  Calendar,
  User,
  Send,
  MessageCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

interface BlogComment {
  id: string
  author: string
  text: string
  date: string
}

interface BlogPost {
  id: string
  title: string
  content: string
  imageUrl: string
  date: string
  comments: BlogComment[]
}

interface BlogPostPageProps {
  params: Promise<{ id: string }>
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [commentForm, setCommentForm] = useState({ author: "", text: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. CARGAR POST Y COMENTARIOS DESDE SUPABASE
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        if (data) {
          setPost({
            id: String(data.id),
            title: data.title || "Sin título",
            content: data.content || "",
            // Corregimos el nombre de la columna y añadimos fallback
            imageUrl: data.image_url || data.imageUrl || DEFAULT_IMAGE,
            date: data.date || "Fecha no disponible",
            comments: Array.isArray(data.comments) ? data.comments : []
          })
        }
      } catch (err) {
        console.error("Error al cargar el post:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
    window.scrollTo(0, 0)
  }, [id])

  // 2. LOGICA DE COMENTARIOS
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentForm.author.trim() || !commentForm.text.trim() || !post) return

    setIsSubmitting(true)
    
    const newComment: BlogComment = {
      id: Date.now().toString(),
      author: commentForm.author,
      text: commentForm.text,
      date: new Date().toLocaleDateString("es-MX")
    }

    const updatedComments = [...post.comments, newComment]

    try {
      const { error } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', post.id)

      if (error) throw error

      setPost({ ...post, comments: updatedComments })
      setCommentForm({ author: "", text: "" })
    } catch (err) {
      alert("Error al publicar comentario. Revisa los permisos de la base de datos.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareOnFacebook = () => {
    const url = window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400")
  }

  const shareOnTwitter = () => {
    const url = window.location.href
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post?.title || "")}`, "_blank", "width=600,height=400")
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando aventura...</div>

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4 text-foreground">Artículo no encontrado</h1>
          <Link href="/blog"><Button variant="outline">Volver al Blog</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Image - CORREGIDA para evitar error de src vacío */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img 
          src={post.imageUrl || DEFAULT_IMAGE} 
          alt={post.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-6 left-6">
          <Link href="/blog">
            <Button variant="secondary" className="rounded-none gap-2 bg-white/90 shadow-sm">
              <ArrowLeft className="w-4 h-4" /> Volver al Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Card */}
      <article className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-background border border-border p-8 md:p-12 mb-8 shadow-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" /> <span>{post.date}</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-8 italic">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 pb-8 border-b border-border mb-8">
            <span className="text-sm text-muted-foreground">Compartir:</span>
            <Button size="icon" variant="outline" className="rounded-none hover:bg-primary/5" onClick={shareOnFacebook}><Facebook className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" className="rounded-none hover:bg-primary/5" onClick={shareOnTwitter}><Twitter className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" className="rounded-none relative hover:bg-primary/5" onClick={copyLink}>
              <Link2 className="h-4 w-4" />
              {copied && <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1">¡Copiado!</span>}
            </Button>
          </div>

          <div className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-background border border-border p-8 md:p-12 mb-20 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl">Comentarios ({post.comments?.length || 0})</h2>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4 border-b border-border pb-8">
            <Input 
              value={commentForm.author} 
              onChange={(e) => setCommentForm({...commentForm, author: e.target.value})} 
              placeholder="Tu nombre" 
              className="rounded-none border-border focus:border-primary" 
              required 
            />
            <Textarea 
              value={commentForm.text} 
              onChange={(e) => setCommentForm({...commentForm, text: e.target.value})} 
              placeholder="Escribe un comentario..." 
              className="rounded-none resize-none min-h-[100px] border-border focus:border-primary" 
              required 
            />
            <Button type="submit" disabled={isSubmitting} className="rounded-none gap-2 px-8">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSubmitting ? "Publicando..." : "Publicar Comentario"}
            </Button>
          </form>

          <div className="space-y-6">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="bg-muted/30 p-5 border-l-2 border-primary/30">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{comment.date}</span>
                  </div>
                  <p className="text-muted-foreground">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm italic">Sé el primero en dejar un comentario.</p>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}