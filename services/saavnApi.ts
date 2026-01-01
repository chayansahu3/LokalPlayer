
import { SearchResponse, Song } from '../types';

const BASE_URL = 'https://saavn.sumit.co/api';

export const saavnApi = {
  searchSongs: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=20`);
    if (!response.ok) throw new Error('Failed to fetch songs');
    return response.json();
  },

  getSongDetails: async (id: string): Promise<{ success: boolean; data: Song[] }> => {
    const response = await fetch(`${BASE_URL}/songs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch song details');
    return response.json();
  },

  getRecommendations: async (id: string): Promise<{ success: boolean; data: Song[] }> => {
    const response = await fetch(`${BASE_URL}/songs/${id}/suggestions`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    return response.json();
  }
};
