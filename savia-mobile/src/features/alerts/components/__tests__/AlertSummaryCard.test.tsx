import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AlertSummaryCard } from '@/features/alerts/components/AlertSummaryCard';

const mockProps = {
  category: {
    id: 'robbery',
    name: 'Robo/Asalto',
    icon: 'Siren',
    color: '#D32F2F',
    order: 1,
  },
  urgency: 'high' as const,
  address: 'Av. Atalaya 234, Atalaya',
  description: 'Intento de robo en la esquina, dos sujetos en moto.',
};

describe('AlertSummaryCard', () => {
  it('muestra el encabezado', () => {
    render(<AlertSummaryCard {...mockProps} />);
    expect(screen.getByText('RESUMEN DE TU ALERTA')).toBeTruthy();
  });

  it('muestra el tipo de alerta', () => {
    render(<AlertSummaryCard {...mockProps} />);
    expect(screen.getByText('Robo/Asalto')).toBeTruthy();
  });

  it('muestra la urgencia', () => {
    render(<AlertSummaryCard {...mockProps} />);
    expect(screen.getByText('Alta')).toBeTruthy();
  });

  it('muestra la ubicación', () => {
    render(<AlertSummaryCard {...mockProps} />);
    expect(screen.getByText('Av. Atalaya 234, Atalaya')).toBeTruthy();
  });

  it('muestra la descripción', () => {
    render(<AlertSummaryCard {...mockProps} />);
    expect(screen.getByText(/Intento de robo/)).toBeTruthy();
  });
});
