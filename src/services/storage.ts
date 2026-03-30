import { Outfit, User } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

export const storage = {
  // Users
  getUserProfile: async (userId: string): Promise<User | null> => {
    const path = `users/${userId}`;
    try {
      // Use getDocFromServer to force a network request and bypass cache
      const userDoc = await getDocFromServer(doc(db, 'users', userId));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  saveUserProfile: async (user: User): Promise<void> => {
    const path = `users/${user.id}`;
    try {
      await setDoc(doc(db, 'users', user.id), user);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Outfits
  getSuggestions: (): Outfit[] => SUGGESTIONS,

  getSavedOutfits: async (userId: string): Promise<Outfit[]> => {
    const path = 'outfits';
    try {
      const q = query(collection(db, 'outfits'), where('user_id', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Outfit);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  saveOutfit: async (userId: string, outfit: Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'is_suggestion'>): Promise<Outfit> => {
    const id = crypto.randomUUID();
    const path = `outfits/${id}`;
    const newOutfit: Outfit = {
      ...outfit,
      id,
      user_id: userId,
      is_suggestion: false,
      created_at: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'outfits', id), newOutfit);
      return newOutfit;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  deleteOutfit: async (id: string): Promise<void> => {
    const path = `outfits/${id}`;
    try {
      await deleteDoc(doc(db, 'outfits', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
