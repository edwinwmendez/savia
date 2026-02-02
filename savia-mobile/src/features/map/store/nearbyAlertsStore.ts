import { create } from 'zustand';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';
import { getDistanceInMeters } from '@/features/map/utils/geoUtils';

export type RadiusOption = 200 | 500 | 1000 | 2000;

export const RADIUS_OPTIONS: RadiusOption[] = [200, 500, 1000, 2000];

const ALL_URGENCIES: UrgencyLevel[] = ['critical', 'high', 'medium', 'low'];

export type NearbyAlert = AlertData & { distance: number };

interface NearbyAlertsState {
  allAlerts: AlertData[];
  userLatitude: number | null;
  userLongitude: number | null;
  selectedRadius: RadiusOption;
  selectedUrgencies: UrgencyLevel[];
  selectedCategories: string[];
  showMapPOIs: boolean;
  isLoading: boolean;
  error: string | null;
  locationError: string | null;

  // Computed
  filteredAlerts: () => NearbyAlert[];
  mapFilteredAlerts: () => AlertData[];

  // Actions
  setAllAlerts: (alerts: AlertData[]) => void;
  setUserLocation: (latitude: number, longitude: number) => void;
  setSelectedRadius: (radius: RadiusOption) => void;
  toggleUrgency: (level: UrgencyLevel) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  toggleMapPOIs: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLocationError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  allAlerts: [] as AlertData[],
  userLatitude: null as number | null,
  userLongitude: null as number | null,
  selectedRadius: 1000 as RadiusOption,
  selectedUrgencies: [...ALL_URGENCIES],
  selectedCategories: [] as string[],
  showMapPOIs: false,
  isLoading: false,
  error: null as string | null,
  locationError: null as string | null,
};

export const useNearbyAlertsStore = create<NearbyAlertsState>((set, get) => ({
  ...initialState,

  mapFilteredAlerts: () => {
    const { allAlerts, selectedUrgencies, selectedCategories } = get();

    return allAlerts.filter((alert) => {
      const matchesUrgency = selectedUrgencies.includes(alert.urgency);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(alert.type);
      return matchesUrgency && matchesCategory;
    });
  },

  filteredAlerts: () => {
    const { userLatitude, userLongitude, selectedRadius } = get();
    const baseFiltered = get().mapFilteredAlerts();

    if (userLatitude === null || userLongitude === null) return [];

    return baseFiltered
      .map((alert) => ({
        ...alert,
        distance: getDistanceInMeters(
          userLatitude,
          userLongitude,
          alert.location.latitude,
          alert.location.longitude,
        ),
      }))
      .filter((alert) => alert.distance <= selectedRadius)
      .sort((a, b) => a.distance - b.distance);
  },

  setAllAlerts: (alerts) => set({ allAlerts: alerts }),

  setUserLocation: (latitude, longitude) =>
    set({ userLatitude: latitude, userLongitude: longitude }),

  setSelectedRadius: (radius) => set({ selectedRadius: radius }),

  toggleUrgency: (level) => {
    const { selectedUrgencies } = get();
    if (selectedUrgencies.includes(level)) {
      if (selectedUrgencies.length <= 1) return;
      set({ selectedUrgencies: selectedUrgencies.filter((u) => u !== level) });
    } else {
      set({ selectedUrgencies: [...selectedUrgencies, level] });
    }
  },

  setSelectedCategories: (categories) => set({ selectedCategories: categories }),

  toggleMapPOIs: () => set((state) => ({ showMapPOIs: !state.showMapPOIs })),

  toggleCategory: (categoryId) => {
    const { selectedCategories } = get();
    if (selectedCategories.includes(categoryId)) {
      set({ selectedCategories: selectedCategories.filter((c) => c !== categoryId) });
    } else {
      set({ selectedCategories: [...selectedCategories, categoryId] });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setLocationError: (error) => set({ locationError: error }),

  reset: () => set(initialState),
}));
