import { cargarClases } from '../src/data/clases';
import { cuposDisponibles } from '../src/domain/availability';
import { validarReserva } from '../src/domain/booking';
import { MENSAJES } from '../src/domain/messages';

const clases = cargarClases();
const clase = (id: string) => clases.find((c) => c.id === id)!;
const now = new Date('2026-10-07T10:00:00-05:00');

describe('Requirement: Orden de evaluación de reglas al reservar', () => {
  test('RN-02 tiene prioridad sobre RN-01', () => {
    const reservas = [{ claseId: 'C-06' }];
    expect(cuposDisponibles(clase('C-06'), reservas)).toBe(0);
    const resultado = validarReserva(clase('C-06'), clases, reservas, now);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe(MENSAJES.rn02YaReservada);
  });

  test('RN-01 tiene prioridad sobre RN-03', () => {
    const reservas = [{ claseId: 'C-05' }, { claseId: 'C-07' }];
    const resultado = validarReserva(clase('C-08'), clases, reservas, now);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe(MENSAJES.rn01SinCupos);
  });

  test('RN-02 tiene prioridad sobre RN-03', () => {
    const reservas = [{ claseId: 'C-05' }, { claseId: 'C-07' }];
    const resultado = validarReserva(clase('C-07'), clases, reservas, now);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe(MENSAJES.rn02YaReservada);
  });
});
