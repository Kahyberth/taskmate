import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { notifications } from "@mantine/notifications"
import { uploadProfilePicture, uploadProfileBanner } from "@/api/images"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

interface ProfileImageUploadProps {
  currentImage?: string
  onImageChange: (image: string | null) => void
  type: 'profile-picture' | 'profile-banner'
  onUploadStart?: () => void
  onUploadComplete?: (url: string) => void
}

export const ProfileImageUpload = ({
  currentImage,
  onImageChange,
  type,
  onUploadStart,
  onUploadComplete,
}: ProfileImageUploadProps) => {
  const { user } = useContext(AuthContext)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
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

  const handleFile = async (file: File) => {
    const maxSize = type === 'profile-banner' ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB para banner, 5MB para foto
    if (file.size > maxSize) {
      notifications.show({
        title: "Image too large",
        message: `Please upload an image smaller than ${maxSize / (1024 * 1024)}MB`,
        color: "red",
      })
      return
    }

    if (!user?.id) {
      notifications.show({
        title: "Error",
        message: "User not authenticated",
        color: "red",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    onUploadStart?.()

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      let result
      if (type === 'profile-picture') {
        result = await uploadProfilePicture(file, user.id)
      } else {
        result = await uploadProfileBanner(file, user.id)
      }
      
      if (result.success) {
        setUploadProgress(100)
        onImageChange(result.imageUrl)
        onUploadComplete?.(result.imageUrl)
        
        notifications.show({
          title: "Success",
          message: `${type === 'profile-picture' ? 'Profile picture' : 'Profile banner'} uploaded successfully`,
          color: "green",
        })
      } else {
        throw new Error(result.message || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      notifications.show({
        title: "Upload failed",
        message: error instanceof Error ? error.message : "Failed to upload image",
        color: "red",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      clearInterval(progressInterval)
    }
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
          <div className={cn(
            "relative overflow-hidden rounded-lg",
            type === 'profile-picture' ? "w-32 h-32" : "aspect-video w-full"
          )}>
            <img 
              src={currentImage} 
              alt={`${type === 'profile-picture' ? 'Profile picture' : 'Profile banner'} preview`} 
              className={cn(
                "object-cover",
                type === 'profile-picture' ? "w-full h-full rounded-full" : "w-full h-full"
              )} 
            />
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
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF (max. {type === 'profile-banner' ? '10MB' : '5MB'})
            </p>
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
      {(uploadProgress > 0 || isUploading) && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground">
            {isUploading ? "Uploading to Azure..." : `Uploading... ${uploadProgress}%`}
          </p>
        </div>
      )}
    </div>
  )
}
