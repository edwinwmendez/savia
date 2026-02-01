import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TabSelector } from '@/shared/components/TabSelector';

const MOCK_TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Activas', badge: 3 },
  { key: 'closed', label: 'Cerradas' },
];

describe('TabSelector', () => {
  it('renderiza todas las tabs', () => {
    render(
      <TabSelector tabs={MOCK_TABS} activeTab="all" onTabChange={() => {}} />,
    );
    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.getByText('Activas')).toBeTruthy();
    expect(screen.getByText('Cerradas')).toBeTruthy();
  });

  it('muestra badge numerico cuando tiene valor', () => {
    render(
      <TabSelector tabs={MOCK_TABS} activeTab="all" onTabChange={() => {}} />,
    );
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('llama a onTabChange al presionar una tab', () => {
    const onTabChange = jest.fn();
    render(
      <TabSelector tabs={MOCK_TABS} activeTab="all" onTabChange={onTabChange} />,
    );
    fireEvent.press(screen.getByText('Activas'));
    expect(onTabChange).toHaveBeenCalledWith('active');
  });

  it('llama a onTabChange incluso al presionar la tab activa', () => {
    const onTabChange = jest.fn();
    render(
      <TabSelector tabs={MOCK_TABS} activeTab="all" onTabChange={onTabChange} />,
    );
    fireEvent.press(screen.getByText('Todas'));
    expect(onTabChange).toHaveBeenCalledWith('all');
  });
});
