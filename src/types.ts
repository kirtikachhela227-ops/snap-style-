export interface Outfit {
  id: string;
  name: string;
  occasion: 'College' | 'Party' | 'Casual' | 'Wedding';
  time: 'Day' | 'Night';
  top: string;
  bottom: string;
  footwear: string;
  color: string;
  price: number;
  user_id?: string;
  is_suggestion?: boolean;
  imageUrl?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
