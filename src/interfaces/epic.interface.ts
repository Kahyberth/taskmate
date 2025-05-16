export interface Epic {
  id: string;
  title: string;
  description?: string;
  color?: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
} 