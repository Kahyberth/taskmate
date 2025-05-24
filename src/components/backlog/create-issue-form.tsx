import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Epic } from "@/interfaces/epic.interface";

interface CreateIssueFormProps {
  onCreateUserStory: () => Promise<void>;
  newUserStoryTitle: string;
  onNewUserStoryTitleChange: (title: string) => void;
  newUserStoryType: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story';
  onNewUserStoryTypeChange: (type: 'bug' | 'feature' | 'task' | 'refactor' | 'user_story') => void;
  newUserStoryPriority: 'low' | 'medium' | 'high' | 'critical';
  onNewUserStoryPriorityChange: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
  newUserStoryEpicId?: string;
  onNewUserStoryEpicIdChange?: (epicId: string | undefined) => void;
  epics: Epic[];
}

export function CreateIssueForm({
  onCreateUserStory,
  newUserStoryTitle,
  onNewUserStoryTitleChange,
  newUserStoryType,
  onNewUserStoryTypeChange,
  newUserStoryPriority,
  onNewUserStoryPriorityChange,
  newUserStoryEpicId,
  onNewUserStoryEpicIdChange,
  epics,
}: CreateIssueFormProps) {
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const handleCreateUserStory = async () => {
    if (!newUserStoryTitle.trim() || isCreatingStory) return;
    
    setIsCreatingStory(true);
    try {
      await onCreateUserStory();
    } finally {
      setIsCreatingStory(false);
    }
  };
  
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreatingStory) {
      e.preventDefault();
      await handleCreateUserStory();
    }
  };

  return (
    <div className="flex flex-nowrap items-center gap-2 my-4 w-full">
      <Input
        type="text"
        placeholder="Título de la historia"
        value={newUserStoryTitle}
        onChange={(e) => onNewUserStoryTitleChange(e.target.value)}
        className="flex-1 min-w-0 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
        onKeyDown={handleKeyDown}
        disabled={isCreatingStory}
      />
      <Select value={newUserStoryType} onValueChange={onNewUserStoryTypeChange} disabled={isCreatingStory}>
        <SelectTrigger className="w-[100px] min-w-[100px] text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          <SelectItem value="user_story" className="dark:text-gray-200">User Story</SelectItem>
          <SelectItem value="task" className="dark:text-gray-200">Task</SelectItem>
          <SelectItem value="bug" className="dark:text-gray-200">Bug</SelectItem>
          <SelectItem value="feature" className="dark:text-gray-200">Feature</SelectItem>
          <SelectItem value="refactor" className="dark:text-gray-200">Refactor</SelectItem>
        </SelectContent>
      </Select>
      <Select value={newUserStoryPriority} onValueChange={onNewUserStoryPriorityChange} disabled={isCreatingStory}>
        <SelectTrigger className="w-[90px] min-w-[90px] text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          <SelectItem value="low" className="text-green-600 dark:text-green-400">Baja</SelectItem>
          <SelectItem value="medium" className="text-yellow-600 dark:text-yellow-400">Media</SelectItem>
          <SelectItem value="high" className="text-red-600 dark:text-red-400">Alta</SelectItem>
          <SelectItem value="critical" className="text-purple-600 dark:text-purple-400">Crítica</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={newUserStoryEpicId || "none"} 
        onValueChange={(value) => {
          if (onNewUserStoryEpicIdChange) {
            onNewUserStoryEpicIdChange(value === "none" ? undefined : value);
          }
        }}
        disabled={isCreatingStory}
      >
        <SelectTrigger className="w-[100px] min-w-[100px] text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
          <SelectValue placeholder="Épica" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
          <SelectItem value="none" className="dark:text-gray-200">Sin épica</SelectItem>
          {epics.map((epic) => (
            <SelectItem key={epic.id} value={epic.id} className="dark:text-gray-200">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" 
                />
                {epic.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleCreateUserStory} 
        size="sm"
        className="h-9 px-3 text-xs whitespace-nowrap dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700"
        disabled={isCreatingStory || !newUserStoryTitle.trim()}
      >
        {isCreatingStory ? (
          <>
            <Loader2 size={14} className="mr-1 animate-spin" />
            Añadiendo...
          </>
        ) : 'Añadir'}
      </Button>
    </div>
  );
} 