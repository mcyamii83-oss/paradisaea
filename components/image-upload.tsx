"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string, file?: File) => void
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
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]"
  }

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)
      onChange(dataUrl, file)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    setPreview("")
    onChange("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      {preview ? (
        <div className={cn("relative overflow-hidden rounded-none border border-border", aspectClasses[aspectRatio])}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 rounded-none"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Eliminar imagen</span>
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "cursor-pointer border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-3 rounded-none",
            aspectClasses[aspectRatio],
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Arrastra una imagen aqui
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              o haz clic para seleccionar
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG hasta 10MB
          </p>
        </div>
      )}
    </div>
  )
}

// Utility function to prepare image for server upload via FormData
export async function prepareImageFormData(
  file: File,
  additionalData?: Record<string, string>
): Promise<FormData> {
  const formData = new FormData()
  formData.append("image", file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }
  
  return formData
}

// Simulated upload function - ready for server connection
export async function uploadImage(file: File): Promise<string> {
  // This function is ready to connect to your hosting server
  // Example implementation:
  // const formData = await prepareImageFormData(file)
  // const response = await fetch('/api/upload', {
  //   method: 'POST',
  //   body: formData
  // })
  // const data = await response.json()
  // return data.url
  
  // For now, return the local preview URL
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}
