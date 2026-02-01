import { create } from 'zustand';
import type { AlertCategory, UrgencyLevel, AlertLocation } from '@/shared/types/alert';

interface CreateAlertState {
  // Step 1
  selectedCategory: AlertCategory | null;
  // Step 2
  description: string;
  urgency: UrgencyLevel | null;
  // Step 3
  location: AlertLocation | null;
  address: string;
  // Step 4
  imageUris: string[];

  // Actions
  setCategory: (category: AlertCategory) => void;
  setDescription: (description: string) => void;
  setUrgency: (urgency: UrgencyLevel) => void;
  setLocation: (location: AlertLocation) => void;
  setAddress: (address: string) => void;
  addImage: (uri: string) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

const initialState = {
  selectedCategory: null,
  description: '',
  urgency: null,
  location: null,
  address: '',
  imageUris: [],
};

export const useCreateAlertStore = create<CreateAlertState>((set, get) => ({
  ...initialState,

  setCategory: (category) => set({ selectedCategory: category }),
  setDescription: (description) => set({ description }),
  setUrgency: (urgency) => set({ urgency }),
  setLocation: (location) => set({ location }),
  setAddress: (address) => set({ address }),
  addImage: (uri) => {
    const current = get().imageUris;
    if (current.length < 3) {
      set({ imageUris: [...current, uri] });
    }
  },
  removeImage: (index) => {
    set({ imageUris: get().imageUris.filter((_, i) => i !== index) });
  },
  reset: () => set(initialState),
}));
