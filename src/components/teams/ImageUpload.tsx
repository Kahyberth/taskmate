import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { notifications } from "@mantine/notifications"

export const ImageUpload = ({
  currentImage,
  onImageChange,
}: {
  currentImage?: string
  onImageChange: (image: string | null) => void
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      notifications.show({
        title: "Imagen demasiado grande",
        message: "Por favor, sube una imagen de menos de 2MB",
        color: "red",
      })
      return
    }
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setTimeout(() => {
          onImageChange(e.target?.result as string)
          setUploadProgress(0)
        }, 1000)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          currentImage ? "bg-muted/50" : "bg-background",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img src={currentImage || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
            <button
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background z-20"
            >
              <X className="h-4 w-4 z-20" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
        </div>
      )}
    </div>
  )
}

