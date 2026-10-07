import { cargarClases } from '../src/data/clases';
import { validarCancelacion, validarReserva } from '../src/domain/booking';
import { inicioClase } from '../src/domain/dates';
import { MENSAJES } from '../src/domain/messages';
import type { Reserva } from '../src/domain/types';

const clases = cargarClases();
const clase = (id: string) => clases.find((c) => c.id === id)!;
const now = new Date('2026-10-07T10:00:00-05:00');
const reservasDe = (...ids: string[]): Reserva[] => ids.map((claseId) => ({ claseId }));

describe('Requirement: RN-03 Máximo 2 reservas por día de clase', () => {
  test('Segunda reserva del mismo día de clase', () => {
    const resultado = validarReserva(clase('C-07'), clases, reservasDe('C-05'), now);
    expect(resultado.ok).toBe(true);
  });

  test('Tercera reserva del mismo día de clase', () => {
    const resultado = validarReserva(clase('C-06'), clases, reservasDe('C-05', 'C-07'), now);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe(MENSAJES.rn03LimiteDia);
  });

  test('Varias reservas creadas hoy para distintos días de clase', () => {
    let reservas: Reserva[] = [];
    for (const id of ['C-02', 'C-04', 'C-05']) {
      expect(validarReserva(clase(id), clases, reservas, now).ok).toBe(true);
      reservas = [...reservas, { claseId: id }];
    }
    const resultado = validarReserva(clase('C-07'), clases, reservas, now);
    expect(resultado.ok).toBe(true);
  });

  test('Reservas de días de clase distintos no cuentan para el límite', () => {
    const resultado = validarReserva(clase('C-09'), clases, reservasDe('C-05', 'C-07'), now);
    expect(resultado.ok).toBe(true);
  });

  test('Cancelar libera el límite del día', () => {
    let reservas = reservasDe('C-05', 'C-07');
    expect(validarCancelacion(inicioClase(clase('C-07'), now), now).ok).toBe(true);
    reservas = reservas.filter((r) => r.claseId !== 'C-07');
    const resultado = validarReserva(clase('C-06'), clases, reservas, now);
    expect(resultado.ok).toBe(true);
  });
});
