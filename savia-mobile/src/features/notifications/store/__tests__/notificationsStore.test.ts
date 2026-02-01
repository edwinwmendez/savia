import { useNotificationsStore } from '../notificationsStore';
import type { NotificationData } from '@/shared/types/notification';

// Helper para crear notificaciones mock
function createNotification(
  overrides: Partial<NotificationData> = {},
): NotificationData {
  return {
    id: 'notif-1',
    userId: 'user-1',
    type: 'status_change',
    title: 'Alerta Asignada',
    body: 'Un agente ha tomado tu caso.',
    alertId: 'alert-1',
    read: false,
    createdAt: {
      toDate: () => new Date(),
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    } as any,
    ...overrides,
  };
}

beforeEach(() => {
  useNotificationsStore.getState().reset();
});

describe('notificationsStore', () => {
  it('setNotifications actualiza la lista', () => {
    const notifications = [createNotification(), createNotification({ id: 'notif-2' })];
    useNotificationsStore.getState().setNotifications(notifications);

    expect(useNotificationsStore.getState().notifications).toHaveLength(2);
  });

  it('setUnreadCount actualiza el conteo', () => {
    useNotificationsStore.getState().setUnreadCount(5);
    expect(useNotificationsStore.getState().unreadCount).toBe(5);
  });

  it('filteredNotifications retorna todo cuando tab es all', () => {
    const notifications = [
      createNotification({ read: false }),
      createNotification({ id: 'notif-2', read: true }),
    ];
    useNotificationsStore.getState().setNotifications(notifications);
    useNotificationsStore.getState().setSelectedTab('all');

    expect(useNotificationsStore.getState().filteredNotifications()).toHaveLength(2);
  });

  it('filteredNotifications filtra no leídas cuando tab es unread', () => {
    const notifications = [
      createNotification({ read: false }),
      createNotification({ id: 'notif-2', read: true }),
      createNotification({ id: 'notif-3', read: false }),
    ];
    useNotificationsStore.getState().setNotifications(notifications);
    useNotificationsStore.getState().setSelectedTab('unread');

    expect(useNotificationsStore.getState().filteredNotifications()).toHaveLength(2);
  });

  it('groupedByDate agrupa por secciones de fecha', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);

    const notifications = [
      createNotification({
        id: 'today-1',
        createdAt: { toDate: () => now, seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      }),
      createNotification({
        id: 'yesterday-1',
        createdAt: { toDate: () => yesterday, seconds: Math.floor(yesterday.getTime() / 1000), nanoseconds: 0 } as any,
      }),
    ];
    useNotificationsStore.getState().setNotifications(notifications);

    const sections = useNotificationsStore.getState().groupedByDate();
    expect(sections.length).toBeGreaterThanOrEqual(1);
    expect(sections[0].title).toBe('HOY');
  });

  it('reset limpia todo el estado', () => {
    useNotificationsStore.getState().setNotifications([createNotification()]);
    useNotificationsStore.getState().setUnreadCount(3);
    useNotificationsStore.getState().setSelectedTab('unread');
    useNotificationsStore.getState().setLoading(true);

    useNotificationsStore.getState().reset();

    const state = useNotificationsStore.getState();
    expect(state.notifications).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
    expect(state.selectedTab).toBe('all');
    expect(state.isLoading).toBe(false);
  });
});
