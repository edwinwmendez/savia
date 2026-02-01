import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StatusBadge } from '@/features/alerts/components/StatusBadge';

describe('StatusBadge', () => {
  it('renderiza "Pendiente" para status pending', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pendiente')).toBeTruthy();
  });

  it('renderiza "En camino" para status assigned', () => {
    render(<StatusBadge status="assigned" />);
    expect(screen.getByText('En camino')).toBeTruthy();
  });

  it('renderiza "En el lugar" para status in_progress', () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText('En el lugar')).toBeTruthy();
  });

  it('renderiza "Resuelta" para status resolved', () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText('Resuelta')).toBeTruthy();
  });

  it('renderiza "Cancelada" para status cancelled', () => {
    render(<StatusBadge status="cancelled" />);
    expect(screen.getByText('Cancelada')).toBeTruthy();
  });

  it('renderiza en tamaño sm', () => {
    render(<StatusBadge status="pending" size="sm" />);
    expect(screen.getByText('Pendiente')).toBeTruthy();
  });
});
