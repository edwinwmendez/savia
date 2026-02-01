import { create } from 'zustand';
import type { AlertData } from '@/shared/types/alert';

type AgentTab = 'pending' | 'myCases' | 'history';

interface AgentAlertsState {
  pendingAlerts: AlertData[];
  myCases: AlertData[];
  history: AlertData[];
  selectedTab: AgentTab;
  isLoading: boolean;
  isTakingCase: boolean;
  isUpdatingStatus: boolean;
  error: string | null;

  // Computed-like
  pendingCount: () => number;
  myCasesCount: () => number;

  // Actions
  setPendingAlerts: (alerts: AlertData[]) => void;
  setMyCases: (alerts: AlertData[]) => void;
  setHistory: (alerts: AlertData[]) => void;
  setSelectedTab: (tab: AgentTab) => void;
  setLoading: (loading: boolean) => void;
  setTakingCase: (taking: boolean) => void;
  setUpdatingStatus: (updating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  pendingAlerts: [] as AlertData[],
  myCases: [] as AlertData[],
  history: [] as AlertData[],
  selectedTab: 'pending' as AgentTab,
  isLoading: false,
  isTakingCase: false,
  isUpdatingStatus: false,
  error: null,
};

export const useAgentAlertsStore = create<AgentAlertsState>((set, get) => ({
  ...initialState,

  pendingCount: () => get().pendingAlerts.length,
  myCasesCount: () => get().myCases.length,

  setPendingAlerts: (alerts) => set({ pendingAlerts: alerts }),
  setMyCases: (alerts) => set({ myCases: alerts }),
  setHistory: (alerts) => set({ history: alerts }),
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setTakingCase: (taking) => set({ isTakingCase: taking }),
  setUpdatingStatus: (updating) => set({ isUpdatingStatus: updating }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
