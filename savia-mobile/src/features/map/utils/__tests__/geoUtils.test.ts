import { getDistanceInMeters, formatDistance, radiusToDelta } from '../geoUtils';

describe('geoUtils', () => {
  describe('getDistanceInMeters', () => {
    it('retorna 0 para el mismo punto', () => {
      const result = getDistanceInMeters(-10.7291, -73.7538, -10.7291, -73.7538);
      expect(result).toBe(0);
    });

    it('calcula distancia conocida Lima-Callao (~14 km)', () => {
      // Lima centro → Callao
      const result = getDistanceInMeters(-12.0464, -77.0428, -12.0566, -77.1181);
      // Distancia real ≈ 8.4 km
      expect(result).toBeGreaterThan(7_000);
      expect(result).toBeLessThan(10_000);
    });

    it('calcula distancia corta (~100 m)', () => {
      // Dos puntos cercanos en Atalaya
      const result = getDistanceInMeters(-10.7291, -73.7538, -10.7300, -73.7538);
      expect(result).toBeGreaterThan(80);
      expect(result).toBeLessThan(120);
    });

    it('calcula distancia media (~1 km)', () => {
      const result = getDistanceInMeters(-10.7291, -73.7538, -10.7200, -73.7538);
      expect(result).toBeGreaterThan(900);
      expect(result).toBeLessThan(1_100);
    });
  });

  describe('formatDistance', () => {
    it('formatea metros menores a 1000', () => {
      expect(formatDistance(150)).toBe('150 m');
      expect(formatDistance(0)).toBe('0 m');
      expect(formatDistance(999)).toBe('999 m');
    });

    it('formatea metros con redondeo', () => {
      expect(formatDistance(50.7)).toBe('51 m');
    });

    it('formatea kilómetros con un decimal', () => {
      expect(formatDistance(1200)).toBe('1.2 km');
      expect(formatDistance(1000)).toBe('1.0 km');
      expect(formatDistance(2500)).toBe('2.5 km');
    });
  });

  describe('radiusToDelta', () => {
    it('retorna deltas proporcionales al radio', () => {
      const small = radiusToDelta(200);
      const large = radiusToDelta(2000);

      expect(large.latitudeDelta).toBeGreaterThan(small.latitudeDelta);
      expect(large.longitudeDelta).toBeGreaterThan(small.longitudeDelta);
    });

    it('retorna deltas positivos', () => {
      const result = radiusToDelta(1000);
      expect(result.latitudeDelta).toBeGreaterThan(0);
      expect(result.longitudeDelta).toBeGreaterThan(0);
    });

    it('retorna deltas con ratio razonable para 1km', () => {
      const result = radiusToDelta(1000);
      // Para 1km, delta debería ser ~0.02 (2.5 * 1000 / 111320)
      expect(result.latitudeDelta).toBeGreaterThan(0.01);
      expect(result.latitudeDelta).toBeLessThan(0.05);
    });
  });
});
