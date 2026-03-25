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
import { useBlog, BlogComment } from "@/lib/blog-context"

interface BlogPostPageProps {
  params: Promise<{ id: string }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { getPostById, addComment } = useBlog()
  const post = getPostById(id)
  
  const [copied, setCopied] = useState(false)
  const [commentForm, setCommentForm] = useState({ author: "", text: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)
  }, [])

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Articulo no encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            El articulo que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/#blog-posts">
            <Button variant="outline" className="rounded-none gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Share functions
  const shareOnFacebook = () => {
    const url = window.location.href
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    )
  }

  const shareOnTwitter = () => {
    const url = window.location.href
    const text = post.title
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "width=600,height=400"
    )
  }

  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentForm.author.trim() || !commentForm.text.trim()) return

    setIsSubmitting(true)
    
    const newComment: BlogComment = {
      id: Date.now().toString(),
      author: commentForm.author,
      text: commentForm.text,
      date: new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }

    addComment(post.id, newComment)
    setCommentForm({ author: "", text: "" })
    setIsSubmitting(false)
  }

  // Format content with basic markdown-like styling
  const formatContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => {
      // Check for bold text (**text**)
      const formattedParagraph = paragraph.replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="text-foreground font-semibold">$1</strong>'
      )
      
      return (
        <p 
          key={index} 
          className="text-muted-foreground leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      )
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link href="/#blog-posts">
            <Button
              variant="secondary"
              className="rounded-none gap-2 bg-white/90 hover:bg-white text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
        {/* Card with title and meta */}
        <div className="bg-background border border-border p-8 md:p-12 mb-8">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          
          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8">
            {post.title}
          </h1>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 pb-8 border-b border-border">
            <span className="text-sm text-muted-foreground">Compartir:</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-none hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                onClick={shareOnFacebook}
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Compartir en Facebook</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-none hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200"
                onClick={shareOnTwitter}
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Compartir en X</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-none hover:bg-primary/5 hover:text-primary hover:border-primary/20 relative"
                onClick={copyLink}
              >
                <Link2 className="h-4 w-4" />
                <span className="sr-only">Copiar enlace</span>
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background px-3 py-1.5 whitespace-nowrap">
                    Enlace copiado!
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="pt-8 text-base md:text-lg">
            {formatContent(post.content)}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-background border border-border p-8 md:p-12 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl text-foreground">
              Comentarios ({post.comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b border-border">
            <div className="space-y-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
                  Tu nombre
                </label>
                <Input
                  id="author"
                  value={commentForm.author}
                  onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                  placeholder="Escribe tu nombre"
                  className="rounded-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                  Tu comentario
                </label>
                <Textarea
                  id="comment"
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                  placeholder="Comparte tu opinion sobre este articulo..."
                  rows={4}
                  className="rounded-none resize-none"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="rounded-none gap-2"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4" />
                Publicar Comentario
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-muted/30 p-5 border-l-2 border-primary/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground ml-3">
                        {comment.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Se el primero en comentar este articulo.
            </p>
          )}
        </div>

        {/* Back to Blog */}
        <div className="text-center pb-20">
          <Link href="/#blog-posts">
            <Button variant="outline" className="rounded-none gap-2 px-8">
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Button>
          </Link>
        </div>
      </article>
    </main>
  )
}
