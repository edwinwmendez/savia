import { create } from 'zustand';
import type { AlertCategory } from '@/shared/types/alert';

interface CreateAlertState {
  selectedCategory: AlertCategory | null;
  setCategory: (category: AlertCategory) => void;
  reset: () => void;
}

export const useCreateAlertStore = create<CreateAlertState>((set) => ({
  selectedCategory: null,

  setCategory: (category) => set({ selectedCategory: category }),

  reset: () => set({ selectedCategory: null }),
}));
