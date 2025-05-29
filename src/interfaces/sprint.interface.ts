import { Task } from "./task.interface";
import { Projects } from "./projects.interface";

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  isFinished: boolean;
  isStarted: boolean;
  startedAt: Date | null;
  fnishedAt: Date | null;
  project: Projects;
  issues: Task[];
  status: 'active' | 'inactive';
} 