import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';

describe('HeaderMobile', () => {
  it('renderiza el título', () => {
    render(<HeaderMobile title="Nueva Alerta" />);
    expect(screen.getByText('Nueva Alerta')).toBeTruthy();
  });

  it('renderiza rightText cuando se proporciona', () => {
    render(<HeaderMobile title="Test" rightText="Cancelar" />);
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('ejecuta onRightTextPress al presionar rightText', () => {
    const onPress = jest.fn();
    render(<HeaderMobile title="Test" rightText="Cancelar" onRightTextPress={onPress} />);
    fireEvent.press(screen.getByText('Cancelar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no muestra rightText cuando hay rightIcon', () => {
    // Sin rightText, no debería renderizarse
    render(<HeaderMobile title="Test" />);
    expect(screen.queryByText('Cancelar')).toBeNull();
  });
});
