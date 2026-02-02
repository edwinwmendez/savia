import { create } from 'zustand';
import type { AlertCategory } from '@/shared/types/alert';
import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';
import { fetchCategories } from '@/features/alerts/services/categoryService';

interface CategoryState {
  categories: AlertCategory[];
  isLoading: boolean;
  isLoaded: boolean;
  load: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: ALERT_CATEGORIES,
  isLoading: false,
  isLoaded: false,
  load: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const categories = await fetchCategories();
      set({ categories, isLoading: false, isLoaded: true });
    } catch (error) {
      console.error('[CategoryStore] Error:', error);
      set({ isLoading: false, isLoaded: true });
    }
  },
}));
