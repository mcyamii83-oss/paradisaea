"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Importación necesaria para el logo
import { Menu, Phone, Mail, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminLoginDialog } from "@/components/admin-login-dialog"
import { supabase } from "@/lib/supabase"

interface NavbarProps {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

export function Navbar({ isAdmin, setIsAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#tours", label: "Tours" },
    { href: "#blog-posts", label: "Blog" },
    { href: "#blog", label: "Testimonios" },
    { href: "#faq", label: "FAQ" },
    { href: "#contacto", label: "Contacto" },
  ]

  const handleAdminClick = async () => {
    if (isAdmin) {
      await supabase.auth.signOut()
      setIsAdmin(false)
    } else {
      setShowLoginDialog(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsAdmin(true)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#2d3436] shadow-lg"
            : "bg-[#2d3436]/90"
        )}
      >
        {isAdmin && (
          <div className="bg-primary text-primary-foreground text-center py-1 text-xs tracking-widest uppercase font-medium">
            Modo Admin Activo - Sesión iniciada
          </div>
        )}

        {/* Barra superior de contacto */}
        <div className="hidden md:block border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-end gap-6 text-sm text-white/80">
              <a href="tel:+525501135254" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>52 55 01 13 52 54</span>
              </a>
              <a href="mailto:ventas.paradisaea@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>ventas.paradisaea@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra de navegación principal */}
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center justify-between">
            {/* TU NUEVO LOGO */}
            <Link href="/" className="flex items-center">
  <Image 
    src="/logo.png" 
    alt="Paradisaea Logo" 
    width={220}    
    height={80}    // Le damos un poco más de margen de altura
    style={{ height: 'auto', width: '220px' }} // Esto mantiene la proporción perfecta
    className="object-contain py-1"
    priority 
  />
</Link>

            {/* Menú de escritorio */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-white/90 hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Botones de acción y móvil */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAdminClick}
                className={cn(
                  "text-white/70 hover:text-primary hover:bg-white/10",
                  isAdmin && "text-primary bg-white/10"
                )}
              >
                {isAdmin ? <LogOut className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </Button>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#2d3436] border-white/10 w-80 text-white">
                  <div className="flex flex-col gap-6 mt-8">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="text-white text-lg font-medium hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent border-white/20 text-white" 
                      onClick={() => { setIsMobileMenuOpen(false); handleAdminClick(); }}
                    >
                      {isAdmin ? "Cerrar Sesión Admin" : "Acceso Admin"}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      <AdminLoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}