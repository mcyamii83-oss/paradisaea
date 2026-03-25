"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Phone, Mail, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminLoginDialog } from "@/components/admin-login-dialog"

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
    { href: "#blog", label: "Blog" },
    { href: "#faq", label: "FAQ" },
    { href: "#contacto", label: "Contacto" },
  ]

  const handleAdminClick = () => {
    if (isAdmin) {
      // Si ya esta logueado, cerrar sesion
      setIsAdmin(false)
    } else {
      // Si no esta logueado, mostrar dialogo de login
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
        {/* Admin Mode Indicator */}
        {isAdmin && (
          <div className="bg-primary text-primary-foreground text-center py-1 text-xs tracking-widest uppercase font-medium">
            Modo Admin Activo - Sesion iniciada
          </div>
        )}

        {/* Top bar with contact info */}
        <div className="hidden md:block border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-end gap-6 text-sm text-white/80">
              <a href="tel:+525501135254" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>52 55 01 13 52 54</span>
              </a>
              <a href="tel:+525554059150" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>52 55 54 05 91 50</span>
              </a>
              <a href="mailto:ventas.paradisaea@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Ventas.Paradisaea@Gmail.Com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-primary flex items-center justify-center bg-transparent">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-semibold text-base tracking-wider">PARADISAEA</span>
                <span className="text-primary text-[10px] tracking-[0.3em] uppercase">Travel</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Admin Toggle & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAdminClick}
                className={cn(
                  "text-white/70 hover:text-primary hover:bg-white/10",
                  isAdmin && "text-primary bg-white/10"
                )}
                title={isAdmin ? "Cerrar sesion admin" : "Acceso administrador"}
              >
                {isAdmin ? <LogOut className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#2d3436] border-white/10 w-80">
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
                    <div className="pt-6 border-t border-white/10 space-y-4">
                      <a href="tel:+525501135254" className="flex items-center gap-3 text-white/80 hover:text-primary text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>52 55 01 13 52 54</span>
                      </a>
                      <a href="mailto:ventas.paradisaea@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-primary text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>ventas.paradisaea@gmail.com</span>
                      </a>
                    </div>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleAdminClick()
                        }}
                      >
                        {isAdmin ? (
                          <>
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesion Admin
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4 mr-2" />
                            Acceso Admin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {/* Login Dialog */}
      <AdminLoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
