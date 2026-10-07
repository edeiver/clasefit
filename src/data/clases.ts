import type { Clase } from '../domain/types';
import datos from './clases.json';

export function cargarClases(): Clase[] {
  return datos.clases;
}
