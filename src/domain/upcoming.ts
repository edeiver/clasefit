import { inicioClase } from './dates';
import type { Clase } from './types';

export type ClaseProgramada = { clase: Clase; inicio: Date };

export function ordenarPorInicio(programadas: ClaseProgramada[]): ClaseProgramada[] {
  return [...programadas].sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
}

// Clases que aún no han empezado (inicio > now), ordenadas por inicio ascendente.
export function proximasClases(clases: Clase[], now: Date): ClaseProgramada[] {
  const programadas = clases
    .map((clase) => ({ clase, inicio: inicioClase(clase, now) }))
    .filter(({ inicio }) => inicio.getTime() > now.getTime());
  return ordenarPorInicio(programadas);
}
