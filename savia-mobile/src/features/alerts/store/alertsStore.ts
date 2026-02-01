import { create } from 'zustand';
import type { AlertData } from '@/shared/types/alert';

type AlertTab = 'all' | 'active' | 'closed';

const ACTIVE_STATUSES = ['pending', 'assigned', 'in_progress'] as const;
const CLOSED_STATUSES = ['resolved', 'cancelled'] as const;

interface AlertsState {
  alerts: AlertData[];
  selectedTab: AlertTab;
  isLoading: boolean;
  error: string | null;

  // Computed-like
  filteredAlerts: () => AlertData[];
  activeCount: () => number;

  // Actions
  setAlerts: (alerts: AlertData[]) => void;
  setSelectedTab: (tab: AlertTab) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  alerts: [] as AlertData[],
  selectedTab: 'all' as AlertTab,
  isLoading: false,
  error: null,
};

export const useAlertsStore = create<AlertsState>((set, get) => ({
  ...initialState,

  filteredAlerts: () => {
    const { alerts, selectedTab } = get();

    if (selectedTab === 'all') {
      return alerts;
    }

    if (selectedTab === 'active') {
      return alerts.filter((a) =>
        (ACTIVE_STATUSES as readonly string[]).includes(a.status),
      );
    }

    // closed
    return alerts.filter((a) =>
      (CLOSED_STATUSES as readonly string[]).includes(a.status),
    );
  },

  activeCount: () => {
    const { alerts } = get();
    return alerts.filter((a) =>
      (ACTIVE_STATUSES as readonly string[]).includes(a.status),
    ).length;
  },

  setAlerts: (alerts) => set({ alerts }),
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
