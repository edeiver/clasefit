import { inicioClase } from '../src/domain/dates';
import type { Clase } from '../src/domain/types';

const base: Clase = {
  id: 'X',
  nombre: 'Prueba',
  instructor: 'Instructor',
  diaOffset: 0,
  hora: '00:00',
  duracionMin: 60,
  cupoTotal: 10,
  ocupados: 0,
};

describe('Requirement: Cálculo del inicio de la clase', () => {
  test('Clase de hoy', () => {
    const now = new Date('2026-10-07T10:00:00-05:00');
    const inicio = inicioClase({ ...base, diaOffset: 0, hora: '18:00' }, now);
    expect(inicio.toISOString()).toBe('2026-10-07T23:00:00.000Z');
  });

  test('Clase de pasado mañana', () => {
    const now = new Date('2026-10-07T10:00:00-05:00');
    const inicio = inicioClase({ ...base, diaOffset: 2, hora: '08:00' }, now);
    expect(inicio.getTime()).toBe(new Date('2026-10-09T08:00:00-05:00').getTime());
  });

  test('Fecha calendario de Bogotá distinta de la fecha UTC', () => {
    const now = new Date('2026-10-07T23:30:00-05:00');
    expect(now.toISOString()).toBe('2026-10-08T04:30:00.000Z');
    const inicio = inicioClase({ ...base, diaOffset: 1, hora: '06:00' }, now);
    expect(inicio.getTime()).toBe(new Date('2026-10-08T06:00:00-05:00').getTime());
    expect(inicio.getTime()).not.toBe(new Date('2026-10-09T06:00:00-05:00').getTime());
  });
});
