import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';
import type { AlertCategory } from '@/shared/types/alert';

const mockCategory: AlertCategory = {
  id: 'robbery',
  name: 'Robo/Asalto',
  icon: 'Siren',
  color: '#D32F2F',
  order: 1,
};

beforeEach(() => {
  useCreateAlertStore.getState().reset();
});

describe('createAlertStore', () => {
  it('inicia con selectedCategory null', () => {
    const state = useCreateAlertStore.getState();
    expect(state.selectedCategory).toBeNull();
  });

  it('setCategory actualiza la categoría seleccionada', () => {
    useCreateAlertStore.getState().setCategory(mockCategory);

    const state = useCreateAlertStore.getState();
    expect(state.selectedCategory).toEqual(mockCategory);
  });

  it('setCategory reemplaza la categoría anterior', () => {
    const otherCategory: AlertCategory = {
      id: 'fire',
      name: 'Incendio',
      icon: 'Flame',
      color: '#FF5722',
      order: 4,
    };

    useCreateAlertStore.getState().setCategory(mockCategory);
    useCreateAlertStore.getState().setCategory(otherCategory);

    const state = useCreateAlertStore.getState();
    expect(state.selectedCategory?.id).toBe('fire');
  });

  it('reset limpia la categoría seleccionada', () => {
    useCreateAlertStore.getState().setCategory(mockCategory);
    useCreateAlertStore.getState().reset();

    const state = useCreateAlertStore.getState();
    expect(state.selectedCategory).toBeNull();
  });
});
