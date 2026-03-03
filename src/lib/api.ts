import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'http://localhost:4000'
  : 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Link {
  code: string;
  target: string;
  createdAt: string;
  clicks: number;
  lastClick: string | null;
  deleted: boolean;
}

export interface CreateLinkRequest {
  target: string;
  code?: string;
}

export interface CreateLinkResponse extends Link {
  shortUrl: string;
}

export const linksApi = {
  createLink: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
    try {
      const response = await api.post<CreateLinkResponse>('/api/links', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Failed to create link');
      }
      throw new Error('Network error');
    }
  },

  getAllLinks: async (): Promise<Link[]> => {
    try {
      const response = await api.get<Link[]>('/api/links');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Failed to fetch links');
      }
      throw new Error('Network error');
    }
  },

  getLinkStats: async (code: string): Promise<Link> => {
    try {
      const response = await api.get<Link>(`/api/links/${code}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Failed to fetch link');
      }
      throw new Error('Network error');
    }
  },

  deleteLink: async (code: string): Promise<void> => {
    try {
      await api.delete(`/api/links/${code}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Failed to delete link');
      }
      throw new Error('Network error');
    }
  }
};

export default api;
