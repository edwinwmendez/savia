import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ProgressBar } from '@/shared/components/ProgressBar';

describe('ProgressBar', () => {
  it('muestra "Paso 1 de 4" y "25%"', () => {
    render(<ProgressBar currentStep={1} totalSteps={4} />);
    expect(screen.getByText('Paso 1 de 4')).toBeTruthy();
    expect(screen.getByText('25%')).toBeTruthy();
  });

  it('muestra "Paso 3 de 4" y "75%"', () => {
    render(<ProgressBar currentStep={3} totalSteps={4} />);
    expect(screen.getByText('Paso 3 de 4')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
  });

  it('muestra "Paso 4 de 4" y "100%"', () => {
    render(<ProgressBar currentStep={4} totalSteps={4} />);
    expect(screen.getByText('Paso 4 de 4')).toBeTruthy();
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('muestra "Paso 2 de 4" y "50%"', () => {
    render(<ProgressBar currentStep={2} totalSteps={4} />);
    expect(screen.getByText('Paso 2 de 4')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
  });
});
