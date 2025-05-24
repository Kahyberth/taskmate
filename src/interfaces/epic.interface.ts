export interface Epic {
  id: string;
  name: string;
  description?: string;
  backlogId: string;
  createdAt?: Date;
  updatedAt?: Date;
} 