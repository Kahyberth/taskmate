
export interface Task {
    id: string
    title: string
    tag: string
    tagColor: string
    taskId: string
    assignee: string
    completed?: boolean
    hideTag?: boolean
    hideTaskId?: boolean
    status: "todo" | "inProgress" | "done"
}
  