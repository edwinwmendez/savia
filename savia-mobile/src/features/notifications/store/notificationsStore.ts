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

const SECTION_ORDER = ['HOY', 'AYER', 'ESTA SEMANA', 'ANTERIORES'];

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

/** Agrupa notificaciones por fecha. Se usa desde los componentes con useMemo. */
export function groupNotificationsByDate(
  notifications: NotificationData[],
  tab: NotificationTab,
): NotificationSection[] {
  const filtered = tab === 'all' ? notifications : notifications.filter((n) => !n.read);
  const sections: Record<string, NotificationData[]> = {};

  for (const notif of filtered) {
    if (!notif.createdAt) continue;
    const section = getDateSection(notif.createdAt);
    if (!sections[section]) sections[section] = [];
    sections[section].push(notif);
  }

  return SECTION_ORDER
    .filter((title) => sections[title]?.length)
    .map((title) => ({ title, data: sections[title] }));
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  ...initialState,

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
