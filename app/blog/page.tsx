"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

// Definimos la interfaz para evitar errores de tipo
interface BlogPost {
  id: string
  title: string
  content: string
  imageUrl: string
  date: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // 1. CARGAR DATOS REALES DE SUPABASE
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('id', { ascending: false })

        if (error) throw error

        if (data) {
          const formatted = data.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            content: p.content,
            imageUrl: p.image_url, // Mapeo de la base de datos
            date: p.date
          }))
          setPosts(formatted)
        }
      } catch (err) {
        console.error("Error cargando blog:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Limpiar el contenido para el resumen
  const getSummary = (content: string) => {
    if (!content) return ""
    const cleanContent = content.replace(/\*\*/g, "").replace(/\n/g, " ")
    return cleanContent.length > 120 
      ? cleanContent.substring(0, 120) + "..." 
      : cleanContent
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/" className="inline-block mb-8">
            <Button variant="ghost" className="rounded-none gap-2 -ml-4">
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground italic">
            Blog de Viajes
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
            Inspiración, consejos y guías para planificar tu próximo viaje.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-10">Cargando artículos...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-background border border-border group hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  
                  <h2 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 h-20 overflow-hidden">
                    {getSummary(post.content)}
                  </p>

                  <Link href={`/blog/${post.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 gap-2 rounded-none group/btn border border-primary/20"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No hay artículos publicados todavía.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}