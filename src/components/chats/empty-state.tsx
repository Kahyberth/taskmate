import { MessageSquare } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          Ningún chat seleccionado
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecciona un chat para comenzar una conversación
        </p>
      </div>
    </div>
  )
}

