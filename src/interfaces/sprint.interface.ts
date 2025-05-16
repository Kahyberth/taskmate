import { Task } from "./task.interface";

export interface Sprint {
  id: string;
  name: string;
  isActive: boolean;
  tasks: Task[];
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 