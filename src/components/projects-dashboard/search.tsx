

import { SearchIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Buscar..."
        className="w-full pl-8"
      />
    </div>
  )
}

