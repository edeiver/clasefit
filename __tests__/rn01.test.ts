import { cargarClases } from '../src/data/clases';
import { cuposDisponibles, etiquetaCupos } from '../src/domain/availability';
import { validarReserva } from '../src/domain/booking';
import { MENSAJES } from '../src/domain/messages';
import type { Reserva } from '../src/domain/types';

const clases = cargarClases();
const clase = (id: string) => clases.find((c) => c.id === id)!;
const now = new Date('2026-10-07T10:00:00-05:00');

describe('Requirement: RN-01 No reservar una clase sin cupos', () => {
  test('Clase llena desde los datos', () => {
    const resultado = validarReserva(clase('C-08'), clases, [], now);
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe(MENSAJES.rn01SinCupos);
  });

  test('Último cupo disponible', () => {
    const c10 = clase('C-10');
    let reservas: Reserva[] = [];
    const resultado = validarReserva(c10, clases, reservas, now);
    expect(resultado.ok).toBe(true);
    reservas = [...reservas, { claseId: 'C-10' }];
    expect(cuposDisponibles(c10, reservas)).toBe(0);
    expect(etiquetaCupos(c10, reservas)).toBe(MENSAJES.llena);
  });
});
