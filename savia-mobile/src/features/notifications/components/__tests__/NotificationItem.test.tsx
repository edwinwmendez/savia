import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationItem } from '../NotificationItem';
import type { NotificationData } from '@/shared/types/notification';

function createNotification(
  overrides: Partial<NotificationData> = {},
): NotificationData {
  return {
    id: 'notif-1',
    userId: 'user-1',
    type: 'status_change',
    title: 'Alerta Asignada',
    body: 'Un agente ha tomado tu caso y está en camino.',
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

describe('NotificationItem', () => {
  it('renderiza título y cuerpo correctamente', () => {
    const { getByText } = render(
      <NotificationItem notification={createNotification()} onPress={jest.fn()} />,
    );

    expect(getByText('Alerta Asignada')).toBeTruthy();
    expect(getByText('Un agente ha tomado tu caso y está en camino.')).toBeTruthy();
  });

  it('llama onPress al tocar', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <NotificationItem notification={createNotification()} onPress={onPress} />,
    );

    fireEvent.press(getByText('Alerta Asignada'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza con notificación de tipo new_alert', () => {
    const { getByText } = render(
      <NotificationItem
        notification={createNotification({ type: 'new_alert', title: 'Nueva Alerta' })}
        onPress={jest.fn()}
      />,
    );

    expect(getByText('Nueva Alerta')).toBeTruthy();
  });

  it('renderiza con notificación leída', () => {
    const { getByText } = render(
      <NotificationItem
        notification={createNotification({ read: true })}
        onPress={jest.fn()}
      />,
    );

    expect(getByText('Alerta Asignada')).toBeTruthy();
  });
});
