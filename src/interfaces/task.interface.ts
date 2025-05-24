export interface Task {
  id: string;
  title: string;
  description: string;
  code?: string;
  status: "to-do" | "in-progress" | "done" | "closed" | "review";
  priority: "low" | "medium" | "high" | "critical";
  type?: "bug" | "feature" | "task" | "refactor" | "user_story";
  storyPoints?: number | null;
  assignedTo?: string;
  createdBy: string;
  acceptanceCriteria?: string;
  isDeleted?: boolean;
  productBacklogId: string;
  epicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
  finishedAt?: Date;
} 