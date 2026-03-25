import { Outfit, Event } from '../types';

const OUTFITS_KEY = 'style_snap_outfits';
const EVENTS_KEY = 'style_snap_events';

// Helper to get data from localStorage
const get = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to localStorage
const save = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storage = {
  // Outfits
  getOutfits: (): Outfit[] => get<Outfit>(OUTFITS_KEY),
  
  saveOutfit: (outfit: Omit<Outfit, 'id' | 'created_at' | 'user_id' | 'is_favorite' | 'times_worn'>): Outfit => {
    const outfits = get<Outfit>(OUTFITS_KEY);
    const newOutfit: Outfit = {
      ...outfit,
      id: crypto.randomUUID(),
      user_id: 'demo-user',
      is_favorite: false,
      times_worn: 1,
      created_at: new Date().toISOString()
    };
    save(OUTFITS_KEY, [newOutfit, ...outfits]);
    return newOutfit;
  },

  updateOutfit: (id: string, updates: Partial<Outfit>) => {
    const outfits = get<Outfit>(OUTFITS_KEY);
    const updated = outfits.map(o => o.id === id ? { ...o, ...updates } : o);
    save(OUTFITS_KEY, updated);
  },

  deleteOutfit: (id: string) => {
    const outfits = get<Outfit>(OUTFITS_KEY);
    save(OUTFITS_KEY, outfits.filter(o => o.id !== id));
  },

  // Events
  getEvents: (): (Event & { outfit?: Outfit })[] => {
    const events = get<Event>(EVENTS_KEY);
    const outfits = get<Outfit>(OUTFITS_KEY);
    return events.map(event => ({
      ...event,
      outfit: outfits.find(o => o.id === event.outfit_id)
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  saveEvent: (event: Omit<Event, 'id' | 'created_at' | 'user_id'>): Event => {
    const events = get<Event>(EVENTS_KEY);
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      user_id: 'demo-user',
      created_at: new Date().toISOString()
    };
    save(EVENTS_KEY, [...events, newEvent]);
    return newEvent;
  },

  deleteEvent: (id: string) => {
    const events = get<Event>(EVENTS_KEY);
    save(EVENTS_KEY, events.filter(e => e.id !== id));
  }
};
