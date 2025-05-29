import { Task } from "@/interfaces/task.interface"
import { AssignedUser } from "@/interfaces/assigned-user.interface"
import { KanbanColumn } from "./components"

// Vista móvil con DnD específico
export const MobileKanbanView = ({ 
  tasks, 
  visibleColumns, 
  getAssignedUser, 
  activeColumn, 
  onToggleColumnVisibility 
}: {
  tasks: Task[],
  visibleColumns: { review: boolean, closed: boolean },
  getAssignedUser: (userId?: string) => AssignedUser | null,
  activeColumn: string | null,
  onToggleColumnVisibility: (column: 'review' | 'closed') => void
}) => {
  const getTodoTasks = () => tasks.filter((task) => task.status === "to-do")
  const getInProgressTasks = () => tasks.filter((task) => task.status === "in-progress")
  const getDoneTasks = () => tasks.filter((task) => task.status === "done")
  const getReviewTasks = () => tasks.filter((task) => task.status === "review")
  const getClosedTasks = () => tasks.filter((task) => task.status === "closed")

  return (
    <div className="flex flex-col gap-4 h-full min-h-[600px] border border-black/10 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-black/20 shadow-sm mb-8 overflow-y-auto">
      <KanbanColumn 
        title="TO-DO" 
        count={getTodoTasks().length} 
        status="to-do" 
        tasks={getTodoTasks()} 
        getAssignedUser={getAssignedUser}
        isActive={activeColumn === "to-do"}
        isMobile={true}
      />

      <KanbanColumn
        title="IN-PROGRESS"
        count={getInProgressTasks().length}
        status="in-progress"
        tasks={getInProgressTasks()}
        getAssignedUser={getAssignedUser}
        isActive={activeColumn === "in-progress"}
        isMobile={true}
      />

      {visibleColumns.review && (
        <KanbanColumn
          title="REVIEW"
          count={getReviewTasks().length}
          status="review"
          tasks={getReviewTasks()}
          getAssignedUser={getAssignedUser}
          isOptional={true}
          onToggleVisibility={() => onToggleColumnVisibility('review')}
          isActive={activeColumn === "review"}
          isMobile={true}
        />
      )}

      <KanbanColumn
        title="DONE"
        count={getDoneTasks().length}
        status="done"
        tasks={getDoneTasks()}
        showCheckmark
        getAssignedUser={getAssignedUser}
        isActive={activeColumn === "done"}
        isMobile={true}
      />

      {visibleColumns.closed && (
        <KanbanColumn
          title="CLOSED"
          count={getClosedTasks().length}
          status="closed"
          tasks={getClosedTasks()}
          getAssignedUser={getAssignedUser}
          isOptional={true}
          onToggleVisibility={() => onToggleColumnVisibility('closed')}
          isActive={activeColumn === "closed"}
          isMobile={true}
        />
      )}
    </div>
  )
}

// Vista desktop con DnD específico
export const DesktopKanbanView = ({ 
  tasks, 
  visibleColumns, 
  getAssignedUser, 
  activeColumn, 
  onToggleColumnVisibility,
  visibleColumnCount
}: {
  tasks: Task[],
  visibleColumns: { review: boolean, closed: boolean },
  getAssignedUser: (userId?: string) => AssignedUser | null,
  activeColumn: string | null,
  onToggleColumnVisibility: (column: 'review' | 'closed') => void,
  visibleColumnCount: number
}) => {
  const getTodoTasks = () => tasks.filter((task) => task.status === "to-do")
  const getInProgressTasks = () => tasks.filter((task) => task.status === "in-progress")
  const getDoneTasks = () => tasks.filter((task) => task.status === "done")
  const getReviewTasks = () => tasks.filter((task) => task.status === "review")
  const getClosedTasks = () => tasks.filter((task) => task.status === "closed")

  return (
    <div 
      className="hidden lg:grid gap-4 h-full min-h-[600px] border border-black/10 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-black/20 shadow-sm mb-8" 
      style={{ gridTemplateColumns: `repeat(${visibleColumnCount}, minmax(0, 1fr)` }}
    >
      <KanbanColumn 
        title="TO-DO" 
        count={getTodoTasks().length} 
        status="to-do" 
        tasks={getTodoTasks()} 
        getAssignedUser={getAssignedUser}
        isActive={activeColumn === "to-do"}
      />

      <KanbanColumn
        title="IN-PROGRESS"
        count={getInProgressTasks().length}
        status="in-progress"
        tasks={getInProgressTasks()}
        getAssignedUser={getAssignedUser}
        isActive={activeColumn === "in-progress"}
      />

      {visibleColumns.review && (
        <KanbanColumn
          title="REVIEW"
          count={getReviewTasks().length}
          status="review"
          tasks={getReviewTasks()}
          getAssignedUser={getAssignedUser}
          isOptional={true}
          onToggleVisibility={() => onToggleColumnVisibility('review')}
          isActive={activeColumn === "review"}
        />
      )}

      <KanbanColumn
        title="DONE"
        count={getDoneTasks().length}
        status="done"
        tasks={getDoneTasks()}
        showCheckmark
        getAssignedUser={getAssignedUser}
        isActive={activeColumn === "done"}
      />

      {visibleColumns.closed && (
        <KanbanColumn
          title="CLOSED"
          count={getClosedTasks().length}
          status="closed"
          tasks={getClosedTasks()}
          getAssignedUser={getAssignedUser}
          isOptional={true}
          onToggleVisibility={() => onToggleColumnVisibility('closed')}
          isActive={activeColumn === "closed"}
        />
      )}
    </div>
  )
} 