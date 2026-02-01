export enum ComplexityLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert'
}

export interface Business {
  id: string;
  name: string;
  niche: string;
  website?: string;
  description: string;
  createdAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  imageUrl?: string; // Base64 data URI
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
}

export interface TermOfTheDay {
  term: string;
  definition: string;
  example: string;
}
