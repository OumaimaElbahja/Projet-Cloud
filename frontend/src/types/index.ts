export interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  brand: string;
  imageUrl: string;
  isAvailable: boolean;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  items: Item[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

export interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
