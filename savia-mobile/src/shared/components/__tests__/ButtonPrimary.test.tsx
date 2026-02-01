import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';

describe('ButtonPrimary', () => {
  it('renderiza el título correctamente', () => {
    render(<ButtonPrimary title="Iniciar sesión" onPress={jest.fn()} />);
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
  });

  it('ejecuta onPress al presionar', () => {
    const onPress = jest.fn();
    render(<ButtonPrimary title="Enviar" onPress={onPress} />);

    fireEvent.press(screen.getByText('Enviar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onPress cuando está disabled', () => {
    const onPress = jest.fn();
    render(<ButtonPrimary title="Enviar" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText('Enviar'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('muestra ActivityIndicator cuando loading=true', () => {
    render(<ButtonPrimary title="Enviar" onPress={jest.fn()} loading />);

    // Cuando loading=true, el texto NO se renderiza
    expect(screen.queryByText('Enviar')).toBeNull();
  });

  it('no ejecuta onPress cuando loading=true', () => {
    const onPress = jest.fn();
    const { root } = render(
      <ButtonPrimary title="Enviar" onPress={onPress} loading />,
    );

    // Presionar el contenedor del botón
    fireEvent.press(root);
    expect(onPress).not.toHaveBeenCalled();
  });
});
