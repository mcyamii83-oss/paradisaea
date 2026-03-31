"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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

interface BlogContextType {
  posts: BlogPost[]
  setPosts: (posts: BlogPost[]) => void
  getPostById: (id: string) => BlogPost | undefined
  addComment: (postId: string, comment: BlogComment) => void
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Los 10 Destinos Mas Impresionantes de Mexico en 2024",
    content: `Mexico es un pais lleno de maravillas naturales y culturales que cautivan a viajeros de todo el mundo. Desde las playas paradisiacas de Cancun hasta los pueblos magicos del interior, cada rincon de este hermoso pais ofrece una experiencia unica e inolvidable.

En este articulo te presentamos los destinos que no puedes perderte este ano:

**1. Oaxaca** - Conocida como la capital cultural de Mexico, Oaxaca te sorprendera con su gastronomia unica, sus mezcales artesanales y sus tradiciones ancestrales. No te pierdas Monte Alban y Hierve el Agua.

**2. Guanajuato** - Sus calles coloridas, tuneles subterraneos y arquitectura colonial hacen de esta ciudad un destino magico. El Festival Cervantino y las momias son atracciones imperdibles.

**3. Riviera Maya** - Playas de arena blanca, cenotes cristalinos y ruinas mayas como Tulum te esperan en este paraiso del Caribe mexicano.

**4. San Miguel de Allende** - Considerada una de las ciudades mas bellas del mundo, su centro historico es Patrimonio de la Humanidad.

**5. Chiapas** - Selvas, cascadas impresionantes como Agua Azul y sitios arqueologicos como Palenque te dejaran sin aliento.

**6. Baja California** - Avistamiento de ballenas, vinos de clase mundial y paisajes deserticos unicos.

**7. Merida** - La Ciudad Blanca te recibe con su arquitectura colonial, gastronomia yucateca y cercanía a Chichen Itza.

**8. Puerto Vallarta** - Romantico destino de playa con malecon pintoresco y vida nocturna vibrante.

**9. Queretaro** - Vinos, quesos y pueblos magicos en una de las zonas mas prosperas del pais.

**10. Huasteca Potosina** - Cascadas color turquesa, rios y aventura en uno de los secretos mejor guardados de Mexico.

Cada destino tiene algo especial que ofrecer, ya sea gastronomia, historia, naturaleza o simplemente paisajes que te dejaran sin aliento. En Paradisaea podemos ayudarte a planificar tu viaje perfecto a cualquiera de estos destinos.`,
    imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80",
    date: "15 de Marzo, 2024",
    comments: [
      {
        id: "c1",
        author: "Laura Martinez",
        text: "Excelente articulo! Ya tengo mi lista de lugares para visitar. Oaxaca esta en mi top 3.",
        date: "16 Mar, 2024"
      },
      {
        id: "c2",
        author: "Roberto Sanchez",
        text: "Visite Guanajuato el ano pasado y es tal como lo describen. Recomendadisimo!",
        date: "17 Mar, 2024"
      }
    ]
  },
  {
    id: "2",
    title: "Guia Completa para Viajar a Europa por Primera Vez",
    content: `Europa es un destino sonado para muchos viajeros mexicanos. Con su rica historia, arquitectura impresionante y diversidad cultural, ofrece experiencias inolvidables que quedan grabadas en la memoria para siempre.

En esta guia completa te compartimos todo lo que necesitas saber para tu primer viaje al viejo continente:

**Documentacion y Visa**
Los mexicanos pueden viajar a la zona Schengen sin visa por hasta 90 dias. Solo necesitas pasaporte vigente con al menos 6 meses de validez, comprobante de hospedaje, seguro de viaje y fondos suficientes para tu estancia.

**Mejor Epoca para Viajar**
- Primavera (abril-junio): Clima agradable, flores en los parques, menos turistas
- Verano (julio-agosto): Dias largos pero muy concurrido
- Otono (septiembre-noviembre): Colores hermosos, precios mas bajos
- Invierno (diciembre-marzo): Mercados navidenos, pero frio intenso

**Presupuesto Aproximado**
- Vuelo desde Mexico: $15,000 - $25,000 MXN (ida y vuelta)
- Hospedaje: $800 - $3,000 MXN por noche
- Comidas: $400 - $1,000 MXN por dia
- Transporte local: $200 - $500 MXN por dia

**Ciudades Imperdibles para Primera Vez**
1. **Paris, Francia** - La Torre Eiffel, el Louvre, Montmartre
2. **Barcelona, Espana** - La Sagrada Familia, Las Ramblas, Gaudi
3. **Roma, Italia** - El Coliseo, el Vaticano, la Fontana di Trevi
4. **Amsterdam, Holanda** - Canales, museos, cultura unica

**Tips de Viaje**
- Compra un chip europeo o activa roaming internacional
- Lleva adaptador de corriente europeo
- Aprende frases basicas del idioma local
- Reserva atracciones populares con anticipacion
- Viaja ligero para moverte facilmente en trenes

En Paradisaea te ayudamos a planificar cada detalle de tu viaje europeo para que solo te preocupes por disfrutar.`,
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80",
    date: "10 de Marzo, 2024",
    comments: []
  },
  {
    id: "3",
    title: "Tips para Empacar Ligero en Tus Viajes",
    content: `Viajar ligero es un arte que puede transformar completamente tu experiencia de viaje. Olvida las maletas pesadas, las filas en el check-in de equipaje y las preocupaciones por maletas extraviadas. 

En este articulo te ensenamos tecnicas de empaque minimalista que haran tus viajes mucho mas comodos y eficientes.

**La Regla del 5-4-3-2-1**
Una formula probada para empacar lo justo:
- 5 prendas superiores
- 4 prendas inferiores  
- 3 accesorios
- 2 pares de zapatos
- 1 prenda de abrigo

**Tecnicas de Empaque**
1. **Enrollar en lugar de doblar** - Ahorra espacio y evita arrugas
2. **Usar cubos organizadores** - Comprimen la ropa y mantienen orden
3. **Llevar ropa multiuso** - Prendas que combinan para varias ocasiones
4. **Colores neutros** - Facilitan crear diferentes outfits

**Articulos Esenciales que No Debes Olvidar**
- Documentos (pasaporte, reservaciones impresas)
- Cargadores y adaptadores
- Medicamentos personales
- Un cambio de ropa en equipaje de mano
- Botella de agua reutilizable

**Articulos que Puedes Dejar**
- Secadora de pelo (los hoteles la tienen)
- Libros fisicos (usa e-reader)
- Mas de 2 pares de zapatos
- Ropa "por si acaso"

**El Kit de Viaje Perfecto**
Manten siempre lista una bolsa pequena con:
- Articulos de tocador en tamano viaje
- Tapones para oidos
- Antifaz para dormir
- Snacks
- Entretenimiento para el vuelo

Con practica, descubriras que una maleta de mano puede ser suficiente incluso para viajes de varias semanas. La libertad de viajar ligero te permitira moverte mas rapido, gastar menos en equipaje y disfrutar mas de cada destino.`,
    imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=80",
    date: "5 de Marzo, 2024",
    comments: []
  }
]

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts)

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id)
  }

  const addComment = (postId: string, comment: BlogComment) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ))
  }

  return (
    <BlogContext.Provider value={{ posts, setPosts, getPostById, addComment }}>
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider")
  }
  return context
}
