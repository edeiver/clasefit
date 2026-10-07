import { cargarClases } from '../src/data/clases';
import { validarCancelacion, validarReserva } from '../src/domain/booking';
import { inicioClase } from '../src/domain/dates';
import { MENSAJES } from '../src/domain/messages';
import type { Reserva } from '../src/domain/types';

const clases = cargarClases();
const clase = (id: string) => clases.find((c) => c.id === id)!;
const now = new Date('2026-10-07T10:00:00-05:00');

describe('Requirement: RN-02 No reservar la misma clase dos veces', () => {
  test('Segunda reserva de la misma clase', () => {
    let reservas: Reserva[] = [{ claseId: 'C-07' }];
    const resultado = validarReserva(clase('C-07'), clases, reservas, now);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe(MENSAJES.rn02YaReservada);
    if (resultado.ok) reservas = [...reservas, { claseId: 'C-07' }];
    expect(reservas.filter((r) => r.claseId === 'C-07')).toHaveLength(1);
  });

  test('Reservar de nuevo tras cancelar', () => {
    const c07 = clase('C-07');
    let reservas: Reserva[] = [];
    expect(validarReserva(c07, clases, reservas, now).ok).toBe(true);
    reservas = [...reservas, { claseId: 'C-07' }];

    expect(validarCancelacion(inicioClase(c07, now), now).ok).toBe(true);
    reservas = reservas.filter((r) => r.claseId !== 'C-07');

    expect(validarReserva(c07, clases, reservas, now).ok).toBe(true);
  });
});
