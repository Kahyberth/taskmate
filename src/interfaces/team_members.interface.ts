export interface TeamMember {
    id: number;
    name: string;
    role: string;
    avatar: string;
    initials: string;
    status: 'online' | 'offline';
    projects: string[];
    email: string;
  }