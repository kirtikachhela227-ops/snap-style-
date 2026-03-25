export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  occasion: 'College' | 'Party' | 'Wedding' | 'Casual';
  top: string;
  bottom: string;
  footwear: string;
  color: string;
  price: number;
  times_worn: number;
  is_favorite: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  name: string;
  date: string;
  outfit_id: string;
  created_at: string;
  outfit?: Outfit;
}

export interface UserStats {
  totalOutfits: number;
  favoriteOutfits: number;
}
