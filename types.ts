
export enum Page {
  Dashboard = 'dashboard',
  Vault = 'vault',
  AIAnalysis = 'analysis',
  Moodboard = 'moodboard',
  Analytics = 'analytics',
  Planner = 'planner'
}

export type OutfitStatus = 'worked_well' | 'needs_improvement' | 'saved';

export interface Outfit {
  id: string;
  name: string;
  imageUrl: string;
  date: string;
  rating: number;
  occasion: string;
  weather: string;
  mood: string;
  status: OutfitStatus;
  liked?: boolean;
}

export interface StylingFeedback {
  reasoning: string;
  visualBalance: number;
  weatherPracticality: number;
  tips: string[];
  tags: string[];
  matchStatus: string; // e.g. "YES", "NO", "PARTIALLY"
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  preferences: string[];
}
