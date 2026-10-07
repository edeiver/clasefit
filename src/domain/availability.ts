import { MENSAJES } from './messages';
import type { Clase, Reserva } from './types';

export function cuposDisponibles(clase: Clase, reservas: Reserva[]): number {
  const reservasDeLaura = reservas.filter((r) => r.claseId === clase.id).length;
  return clase.cupoTotal - clase.ocupados - reservasDeLaura;
}

export function sinCupos(clase: Clase, reservas: Reserva[]): boolean {
  return cuposDisponibles(clase, reservas) <= 0;
}

// "X de Y cupos", o "Llena" cuando no hay cupos disponibles.
export function etiquetaCupos(clase: Clase, reservas: Reserva[]): string {
  if (sinCupos(clase, reservas)) {
    return MENSAJES.llena;
  }
  return `${cuposDisponibles(clase, reservas)} de ${clase.cupoTotal} cupos`;
}
