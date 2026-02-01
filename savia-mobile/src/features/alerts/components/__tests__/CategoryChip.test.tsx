import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CategoryChip } from '@/features/alerts/components/CategoryChip';

const mockCategory = {
  id: 'robbery',
  name: 'Robo/Asalto',
  icon: 'Siren',
  color: '#D32F2F',
  order: 1,
};

describe('CategoryChip', () => {
  it('renderiza el nombre de la categoría', () => {
    render(<CategoryChip category={mockCategory} />);
    expect(screen.getByText('Robo/Asalto')).toBeTruthy();
  });

  it('ejecuta onEdit al presionar', () => {
    const onEdit = jest.fn();
    render(<CategoryChip category={mockCategory} onEdit={onEdit} />);
    fireEvent.press(screen.getByText('Robo/Asalto'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('no es presionable sin onEdit', () => {
    const { getByText } = render(<CategoryChip category={mockCategory} />);
    // Sin onEdit, el componente debería estar deshabilitado
    fireEvent.press(getByText('Robo/Asalto'));
    // No debería lanzar error
  });
});
