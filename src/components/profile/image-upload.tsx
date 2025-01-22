import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { ImageIcon, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

interface ImageUploadProps {
  onUpload: (formData: FormData) => Promise<{ success: boolean }>
  triggerText: string
  dialogTitle: string
  dialogDescription: string
}

export function ImageUpload({ onUpload, triggerText, dialogTitle, dialogDescription }: ImageUploadProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const uploadImage = async () => {
      try {
        const result = await onUpload(formData)
        if (result.success) {
          toast.success('Image updated successfully')
          setOpen(false)
        }
      } catch {
        toast.error('Failed to update image')
      }
    }

    startTransition(() => {
      uploadImage()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <ImageIcon className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image">Select Image</Label>
            <Input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

