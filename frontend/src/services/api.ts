import axios from 'axios';
import { SearchParams, SearchResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchItems = async (params: SearchParams): Promise<SearchResponse> => {
  const { data } = await api.get<SearchResponse>('/search', { params });
  return data;
};

export const getSuggestions = async (q: string): Promise<string[]> => {
  const { data } = await api.get<{ suggestions: string[] }>('/suggestions', { params: { q } });
  return data.suggestions;
};
