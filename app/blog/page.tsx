"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBlog } from "@/lib/blog-context"

export default function BlogPage() {
  const { posts } = useBlog()

  // Get summary from content (first 150 characters)
  const getSummary = (content: string) => {
    const cleanContent = content.replace(/\*\*/g, "").replace(/\n/g, " ")
    return cleanContent.length > 150 
      ? cleanContent.substring(0, 150) + "..." 
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
            Inspiracion, consejos y guias para planificar tu proximo viaje
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-background border border-border group hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.imageUrl}
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
              No hay articulos publicados todavia.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
