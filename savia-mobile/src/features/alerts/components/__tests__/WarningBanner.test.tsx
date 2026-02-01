import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WarningBanner } from '@/features/alerts/components/WarningBanner';

describe('WarningBanner', () => {
  it('renderiza el mensaje', () => {
    render(<WarningBanner message="Al enviar esta alerta, las autoridades serán notificadas." />);
    expect(screen.getByText('Al enviar esta alerta, las autoridades serán notificadas.')).toBeTruthy();
  });

  it('renderiza el icono de advertencia', () => {
    render(<WarningBanner message="Mensaje de prueba" />);
    expect(screen.getByTestId('icon-TriangleAlert')).toBeTruthy();
  });
});
