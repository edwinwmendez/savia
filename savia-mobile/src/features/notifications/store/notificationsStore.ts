import { create } from 'zustand';
import type { Timestamp } from 'firebase/firestore';
import type { NotificationData } from '@/shared/types/notification';

type NotificationTab = 'all' | 'unread';

export interface NotificationSection {
  title: string;
  data: NotificationData[];
}

interface NotificationsState {
  notifications: NotificationData[];
  unreadCount: number;
  selectedTab: NotificationTab;
  isLoading: boolean;
  error: string | null;

  // Computed-like
  filteredNotifications: () => NotificationData[];
  groupedByDate: () => NotificationSection[];

  // Actions
  setNotifications: (notifications: NotificationData[]) => void;
  setUnreadCount: (count: number) => void;
  setSelectedTab: (tab: NotificationTab) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  notifications: [] as NotificationData[],
  unreadCount: 0,
  selectedTab: 'all' as NotificationTab,
  isLoading: false,
  error: null,
};

function getDateSection(timestamp: Timestamp): string {
  const now = new Date();
  const date = timestamp.toDate();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

  if (date >= todayStart) return 'HOY';
  if (date >= yesterdayStart) return 'AYER';
  if (date >= weekStart) return 'ESTA SEMANA';
  return 'ANTERIORES';
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  ...initialState,

  filteredNotifications: () => {
    const { notifications, selectedTab } = get();
    if (selectedTab === 'all') return notifications;
    return notifications.filter((n) => !n.read);
  },

  groupedByDate: () => {
    const filtered = get().filteredNotifications();
    const sections: Record<string, NotificationData[]> = {};
    const sectionOrder = ['HOY', 'AYER', 'ESTA SEMANA', 'ANTERIORES'];

    for (const notif of filtered) {
      if (!notif.createdAt) continue;
      const section = getDateSection(notif.createdAt);
      if (!sections[section]) sections[section] = [];
      sections[section].push(notif);
    }

    return sectionOrder
      .filter((title) => sections[title]?.length)
      .map((title) => ({ title, data: sections[title] }));
  },

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
