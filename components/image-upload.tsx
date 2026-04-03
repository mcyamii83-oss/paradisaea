"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// --- IMPORTANTE: Verifica que esta ruta a tu cliente de supabase sea la correcta ---
import { supabase } from "@/lib/supabase" 

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
  aspectRatio?: "square" | "video" | "wide"
}

export function ImageUpload({ 
  value, 
  onChange, 
  className,
  aspectRatio = "video" 
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]"
  }

  // --- AQUÍ ES DONDE HACES EL CAMBIO ---
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida")
      return
    }

    try {
      setIsUploading(true)

      // 1. Crear un nombre único para que no se sobreescriban las fotos
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}` // Se guardará en la raíz del bucket TOURS

      // 2. SUBIR A SUPABASE (Bucket: TOURS)
      const { error: uploadError } = await supabase.storage
        .from('tours') // <-- Asegúrate que en Supabase se llame exactamente 'tours'
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. OBTENER LA URL PÚBLICA (La que empieza con https://)
      const { data: { publicUrl } } = supabase.storage
        .from('tours')
        .getPublicUrl(filePath)
      
      // 4. GUARDAR EN EL ESTADO
      setPreview(publicUrl)
      onChange(publicUrl) // Esto le manda la URL real a tu base de datos de Tours
      
      console.log("Imagen guardada permanentemente:", publicUrl)
    } catch (error: any) {
      console.error("Error al subir a la nube:", error.message)
      alert("No se pudo guardar en la nube. Revisa tus políticas de Supabase.")
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview("")
    onChange("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />
      
      {preview ? (
        <div className={cn("relative overflow-hidden border border-border bg-muted", aspectClasses[aspectRatio])}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {!isUploading && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8 rounded-none"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file && !isUploading) handleFileSelect(file)
          }}
          className={cn(
            "cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-3",
            aspectClasses[aspectRatio],
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Subiendo a la nube...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium">Subir imagen</p>
                <p className="text-[10px] text-muted-foreground mt-1">Permanente en Supabase</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}