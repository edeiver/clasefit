import { inicioClase } from './dates';
import type { Clase, Reserva } from './types';
import { ordenarPorInicio, type ClaseProgramada } from './upcoming';

// Reservas de Laura ordenadas por inicio de clase, la más próxima primero.
export function misReservas(reservas: Reserva[], clases: Clase[], now: Date): ClaseProgramada[] {
  const programadas = reservas.flatMap((r) => {
    const clase = clases.find((c) => c.id === r.claseId);
    return clase ? [{ clase, inicio: inicioClase(clase, now) }] : [];
  });
  return ordenarPorInicio(programadas);
}
