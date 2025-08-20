import { apiClient } from "./client-gateway";

export interface Channel {
  id: string;
  name: string;
  description?: string;
  serverId?: string;
  parentId?: string;
  created_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getChannels(team_id: string): Promise<PaginatedResponse<Channel>> {
  try {
    const response = await apiClient.get(`/server/get-channels/team/${team_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    // Retornar respuesta vacía en caso de error
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export interface Message {
  message_id: string;
  value: string;
  userName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  channel: {
    channel_id: string;
    name: string;
    description?: string;
  };
}

export async function getMessages(channelId: string, limit: number = 20, before?: string): Promise<Message[]> {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before) {
      params.append('before', before);
    }
    
    const response = await apiClient.get(`/server/get-messages/${channelId}?${params.toString()}`);
    console.log('API Response for messages:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export interface CreateChannelDto {
  name: string;
  description?: string;
  created_by: string;
  serverId: string;
  parentId?: string | "";
}

export interface ServerInfo {
  server_id: string;
  serverName: string;
  description: string;
  isAlive: boolean;
  created_by: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getServerByTeamId(teamId: string): Promise<ServerInfo> {
  try {
    const response = await apiClient.get(`/server/get-server/team/${teamId}`);
    console.log('Server info fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching server info:', error);
    throw error;
  }
}

export async function createChannel(channelData: CreateChannelDto): Promise<Channel> {
  try {
    const response = await apiClient.post('/server/create-channel', channelData);
    console.log('Channel created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
}
