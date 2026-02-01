import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { UrgencyBadge } from '@/features/alerts/components/UrgencyBadge';

describe('UrgencyBadge', () => {
  it('renderiza la etiqueta "Alta" para nivel high', () => {
    render(<UrgencyBadge level="high" />);
    expect(screen.getByText('Alta')).toBeTruthy();
  });

  it('renderiza la etiqueta "Baja" para nivel low', () => {
    render(<UrgencyBadge level="low" />);
    expect(screen.getByText('Baja')).toBeTruthy();
  });

  it('renderiza la etiqueta "Crítica" para nivel critical', () => {
    render(<UrgencyBadge level="critical" />);
    expect(screen.getByText('Crítica')).toBeTruthy();
  });

  it('renderiza la etiqueta "Media" para nivel medium', () => {
    render(<UrgencyBadge level="medium" />);
    expect(screen.getByText('Media')).toBeTruthy();
  });
});
