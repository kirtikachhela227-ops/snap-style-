import { Outfit, User } from '../types';

const OUTFITS_KEY = 'stylesnap_outfits';
const USER_KEY = 'stylesnap_current_user';
const USERS_LIST_KEY = 'stylesnap_users';

const SUGGESTIONS: Outfit[] = [
  {
    id: 's1',
    name: 'Classic College Look',
    occasion: 'College',
    time: 'Day',
    top: 'White Polo Shirt',
    bottom: 'Blue Slim-fit Jeans',
    footwear: 'White Sneakers',
    color: 'White & Blue',
    price: 2500,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's2',
    name: 'Night Out Party',
    occasion: 'Party',
    time: 'Night',
    top: 'Black Leather Jacket',
    bottom: 'Black Ripped Jeans',
    footwear: 'Chelsea Boots',
    color: 'All Black',
    price: 8500,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's3',
    name: 'Casual Weekend Vibe',
    occasion: 'Casual',
    time: 'Day',
    top: 'Oversized Graphic Tee',
    bottom: 'Grey Cargo Pants',
    footwear: 'High-top Sneakers',
    color: 'Grey & Pastel',
    price: 3500,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's4',
    name: 'Elegant Dinner Date',
    occasion: 'Party',
    time: 'Night',
    top: 'Silk Maroon Shirt',
    bottom: 'Black Formal Trousers',
    footwear: 'Oxford Shoes',
    color: 'Maroon & Black',
    price: 5500,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's5',
    name: 'Royal Wedding Guest',
    occasion: 'Wedding',
    time: 'Day',
    top: 'Navy Blue Blazer',
    bottom: 'Beige Chinos',
    footwear: 'Brown Loafers',
    color: 'Navy & Beige',
    price: 12000,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's6',
    name: 'Summer Brunch',
    occasion: 'Casual',
    time: 'Day',
    top: 'Linen Floral Shirt',
    bottom: 'White Shorts',
    footwear: 'Espadrilles',
    color: 'Floral & White',
    price: 3200,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f684?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's7',
    name: 'Traditional Wedding',
    occasion: 'Wedding',
    time: 'Night',
    top: 'Embroidered Sherwani',
    bottom: 'White Pajama',
    footwear: 'Jutti',
    color: 'Gold & Cream',
    price: 15000,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 's8',
    name: 'Smart College Presentation',
    occasion: 'College',
    time: 'Day',
    top: 'Light Blue Oxford Shirt',
    bottom: 'Dark Grey Trousers',
    footwear: 'Brown Derbies',
    color: 'Blue & Grey',
    price: 4500,
    is_suggestion: true,
    imageUrl: 'https://images.unsplash.com/photo-1519085185758-2ad9f12117b1?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  }
];

const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const get = <T>(key: string): T[] => {
  if (!isStorageAvailable()) return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const save = <T>(key: string, data: T[]) => {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const storage = {
  // Auth
  getCurrentUser: (): User | null => {
    if (!isStorageAvailable()) return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  login: (email: string): User => {
    const users = get<User>(USERS_LIST_KEY);
    let user = users.find(u => u.email === email);
    if (!user) {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);
      user = { id, email, name: email.split('@')[0] };
      save(USERS_LIST_KEY, [...users, user]);
    }
    if (isStorageAvailable()) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  logout: () => {
    if (isStorageAvailable()) {
      localStorage.removeItem(USER_KEY);
    }
  },

  // Outfits
  getSuggestions: (): Outfit[] => SUGGESTIONS,

  getSavedOutfits: (userId: string): Outfit[] => {
    const outfits = get<Outfit>(OUTFITS_KEY);
    return outfits.filter(o => o.user_id === userId);
  },

  saveOutfit: (userId: string, outfit: Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'is_suggestion'>): Outfit => {
    const outfits = get<Outfit>(OUTFITS_KEY);
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15);
    const newOutfit: Outfit = {
      ...outfit,
      id,
      user_id: userId,
      is_suggestion: false,
      created_at: new Date().toISOString()
    };
    save(OUTFITS_KEY, [newOutfit, ...outfits]);
    return newOutfit;
  },

  deleteOutfit: (id: string) => {
    const outfits = get<Outfit>(OUTFITS_KEY);
    save(OUTFITS_KEY, outfits.filter(o => o.id !== id));
  }
};
