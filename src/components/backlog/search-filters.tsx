import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, MoreHorizontal, X, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Edit, Copy, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { Epic } from "@/interfaces/epic.interface";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredResultsCount: number;
  epics?: Epic[];
  onOpenEpicDialog?: () => void;
  onEpicSelect?: (epicId: string) => void;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  filteredResultsCount,
  epics = [],
  onOpenEpicDialog,
  onEpicSelect
}: SearchFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Sincronizar el estado local con el prop externo
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Manejar cambios en el input de búsqueda
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };
  
  // Manejar la limpieza del campo de búsqueda
  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border-b border-black/10 dark:border-white/10 bg-white dark:bg-black/20">
      {/* Buscador */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 dark:text-gray-500" size={16} />
          <Input 
            placeholder="Buscar en el backlog..." 
            className="pl-10 h-9 pr-12 rounded-lg shadow-sm text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500" 
            value={localSearchTerm}
            onChange={handleInputChange}
          />
          {localSearchTerm && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-10 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {localSearchTerm && (
            <div className="absolute right-3 text-xs text-gray-500 dark:text-gray-400">
              {filteredResultsCount} resultado{filteredResultsCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
      
      {/* Filtros y acciones */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Epic Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-sm flex items-center gap-1 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Épicas <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 dark:bg-gray-800 dark:border-gray-700">
            {epics.map((epic) => (
              <DropdownMenuItem
                key={epic.id}
                onClick={() => onEpicSelect?.(epic.id)}
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2 ">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"/>
                  {epic.name}
                </div>
              </DropdownMenuItem>
            ))}
            {epics.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                No hay épicas creadas
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Epic Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          onClick={onOpenEpicDialog}
        >
          <Plus size={16} />
        </Button>
        
        <div className="flex items-center gap-1 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-lg dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  toast({
                    title: "Selecciona un sprint",
                    description: "Por favor, selecciona un sprint específico para editarlo.",
                  })
                }}
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar sprint</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Duplicar sprint",
                    description: "Esta funcionalidad será implementada próximamente.",
                  })
                }}
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicar sprint</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:border-gray-700" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 dark:hover:bg-red-900/30"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Eliminar sprint</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 