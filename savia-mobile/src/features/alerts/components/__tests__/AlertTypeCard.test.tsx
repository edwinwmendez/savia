import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AlertTypeCard } from '@/features/alerts/components/AlertTypeCard';
import type { AlertCategory } from '@/shared/types/alert';

const mockCategory: AlertCategory = {
  id: 'robbery',
  name: 'Robo/Asalto',
  icon: 'Siren',
  color: '#D32F2F',
  order: 1,
};

describe('AlertTypeCard', () => {
  it('renderiza el nombre de la categoría', () => {
    render(
      <AlertTypeCard category={mockCategory} selected={false} onPress={jest.fn()} />,
    );
    expect(screen.getByText('Robo/Asalto')).toBeTruthy();
  });

  it('ejecuta onPress al presionar', () => {
    const onPress = jest.fn();
    render(
      <AlertTypeCard category={mockCategory} selected={false} onPress={onPress} />,
    );

    fireEvent.press(screen.getByText('Robo/Asalto'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('tiene accessibilityLabel con el nombre', () => {
    render(
      <AlertTypeCard category={mockCategory} selected={false} onPress={jest.fn()} />,
    );
    expect(screen.getByLabelText('Robo/Asalto')).toBeTruthy();
  });

  it('indica estado selected en accessibility', () => {
    render(
      <AlertTypeCard category={mockCategory} selected={true} onPress={jest.fn()} />,
    );
    const card = screen.getByLabelText('Robo/Asalto');
    expect(card.props.accessibilityState).toEqual({ selected: true });
  });
});
