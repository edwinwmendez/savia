import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { UrgencySelector } from '@/features/alerts/components/UrgencySelector';

describe('UrgencySelector', () => {
  it('renderiza las 4 opciones de urgencia', () => {
    render(<UrgencySelector selectedLevel={null} onSelect={jest.fn()} />);
    expect(screen.getByText('Baja')).toBeTruthy();
    expect(screen.getByText('Media')).toBeTruthy();
    expect(screen.getByText('Alta')).toBeTruthy();
    expect(screen.getByText('Crítica')).toBeTruthy();
  });

  it('ejecuta onSelect al presionar una opción', () => {
    const onSelect = jest.fn();
    render(<UrgencySelector selectedLevel={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByText('Alta'));
    expect(onSelect).toHaveBeenCalledWith('high');
  });

  it('muestra el helper box cuando hay una selección', () => {
    render(<UrgencySelector selectedLevel="high" onSelect={jest.fn()} />);
    expect(screen.getByText(/Situación en curso/)).toBeTruthy();
  });

  it('no muestra helper box sin selección', () => {
    render(<UrgencySelector selectedLevel={null} onSelect={jest.fn()} />);
    expect(screen.queryByText(/Situación en curso/)).toBeNull();
  });

  it('renderiza el label', () => {
    render(<UrgencySelector selectedLevel={null} onSelect={jest.fn()} />);
    expect(screen.getByText('Nivel de urgencia')).toBeTruthy();
  });
});
