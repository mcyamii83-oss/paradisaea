"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog" 

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Lock, Loader2, AlertCircle } from "lucide-react"

interface AdminLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: () => void
}

export function AdminLoginDialog({ open, onOpenChange, onLoginSuccess }: AdminLoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Limpiamos espacios accidentales en el correo
    const cleanEmail = email.trim().toLowerCase()

    try {
      // Intentamos el login oficial
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      })

      if (authError) {
        // Si Supabase nos da error, lo mostramos específico
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("El correo o la contraseña no coinciden.")
        }
        throw authError
      }

      if (data.user) {
        console.log("Login exitoso para:", data.user.email)
        onLoginSuccess()
        onOpenChange(false)
        setEmail("")
        setPassword("")
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
      console.error("Login Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#2d3436] text-white border-white/10 shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto border border-primary/30">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center italic tracking-wide">
            Panel de Control
          </DialogTitle>
          <DialogDescription className="text-center text-white/60">
            Ingresa como administrador para gestionar Paradisaea.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-white/50">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@paradisaea.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-primary h-11"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-white/50">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-primary h-11"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 border border-red-400/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full rounded-none h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              "Acceder ahora"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}