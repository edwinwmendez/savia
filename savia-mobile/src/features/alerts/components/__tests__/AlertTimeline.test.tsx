import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AlertTimeline } from '@/features/alerts/components/AlertTimeline';
import type { StatusHistoryEntry } from '@/shared/types/alert';

const mockTimestamp = {
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0,
  toDate: () => new Date(),
} as any;

const MOCK_HISTORY: StatusHistoryEntry[] = [
  { status: 'pending', timestamp: mockTimestamp },
  { status: 'assigned', timestamp: mockTimestamp, agentName: 'Juan Perez' },
];

describe('AlertTimeline', () => {
  it('renderiza las entradas del historial', () => {
    render(
      <AlertTimeline statusHistory={MOCK_HISTORY} currentStatus="assigned" />,
    );
    expect(screen.getByText('Reportada')).toBeTruthy();
    expect(screen.getByText('En camino')).toBeTruthy();
  });

  it('muestra el nombre del agente cuando existe', () => {
    render(
      <AlertTimeline statusHistory={MOCK_HISTORY} currentStatus="assigned" />,
    );
    expect(screen.getByText('Juan Perez')).toBeTruthy();
  });

  it('no renderiza nada si el historial esta vacio', () => {
    const { toJSON } = render(
      <AlertTimeline statusHistory={[]} currentStatus="pending" />,
    );
    expect(toJSON()).toBeNull();
  });
});
