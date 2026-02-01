import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';

const mockCategory = {
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
  it('inicia con estado vacío', () => {
    const state = useCreateAlertStore.getState();
    expect(state.selectedCategory).toBeNull();
    expect(state.description).toBe('');
    expect(state.urgency).toBeNull();
    expect(state.location).toBeNull();
    expect(state.address).toBe('');
    expect(state.imageUris).toEqual([]);
  });

  it('setCategory actualiza la categoría', () => {
    useCreateAlertStore.getState().setCategory(mockCategory);
    expect(useCreateAlertStore.getState().selectedCategory).toEqual(mockCategory);
  });

  it('setDescription actualiza la descripción', () => {
    useCreateAlertStore.getState().setDescription('Robo en la esquina');
    expect(useCreateAlertStore.getState().description).toBe('Robo en la esquina');
  });

  it('setUrgency actualiza el nivel de urgencia', () => {
    useCreateAlertStore.getState().setUrgency('high');
    expect(useCreateAlertStore.getState().urgency).toBe('high');
  });

  it('setLocation actualiza las coordenadas', () => {
    const coords = { latitude: -10.7312, longitude: -73.7565 };
    useCreateAlertStore.getState().setLocation(coords);
    expect(useCreateAlertStore.getState().location).toEqual(coords);
  });

  it('setAddress actualiza la dirección', () => {
    useCreateAlertStore.getState().setAddress('Av. Atalaya 234');
    expect(useCreateAlertStore.getState().address).toBe('Av. Atalaya 234');
  });

  it('addImage agrega una imagen', () => {
    useCreateAlertStore.getState().addImage('file://foto1.jpg');
    expect(useCreateAlertStore.getState().imageUris).toEqual(['file://foto1.jpg']);
  });

  it('addImage no excede el límite de 3', () => {
    const store = useCreateAlertStore.getState();
    store.addImage('file://1.jpg');
    store.addImage('file://2.jpg');
    store.addImage('file://3.jpg');
    store.addImage('file://4.jpg');
    expect(useCreateAlertStore.getState().imageUris).toHaveLength(3);
  });

  it('removeImage elimina por índice', () => {
    const store = useCreateAlertStore.getState();
    store.addImage('file://1.jpg');
    store.addImage('file://2.jpg');
    store.addImage('file://3.jpg');
    useCreateAlertStore.getState().removeImage(1);
    expect(useCreateAlertStore.getState().imageUris).toEqual(['file://1.jpg', 'file://3.jpg']);
  });

  it('reset limpia todo el estado', () => {
    const store = useCreateAlertStore.getState();
    store.setCategory(mockCategory);
    store.setDescription('Descripción de prueba');
    store.setUrgency('critical');
    store.setLocation({ latitude: -10, longitude: -73 });
    store.setAddress('Dirección');
    store.addImage('file://test.jpg');

    useCreateAlertStore.getState().reset();
    const state = useCreateAlertStore.getState();

    expect(state.selectedCategory).toBeNull();
    expect(state.description).toBe('');
    expect(state.urgency).toBeNull();
    expect(state.location).toBeNull();
    expect(state.address).toBe('');
    expect(state.imageUris).toEqual([]);
  });
});
