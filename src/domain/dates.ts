import type { Clase } from './types';

// America/Bogota: desfase fijo UTC-05:00, sin horario de verano.
const DESFASE_BOGOTA_MS = 5 * 60 * 60 * 1000;

export type FechaCalendario = { anio: number; mes: number; dia: number };

// Fecha calendario de Bogotá del instante dado (mes 1-12).
export function fechaBogota(instante: Date): FechaCalendario {
  const desplazado = new Date(instante.getTime() - DESFASE_BOGOTA_MS);
  return {
    anio: desplazado.getUTCFullYear(),
    mes: desplazado.getUTCMonth() + 1,
    dia: desplazado.getUTCDate(),
  };
}

// Inicio de la clase: fecha de Bogotá de `now` + diaOffset días, a la `hora` en -05:00.
export function inicioClase(clase: Clase, now: Date): Date {
  const { anio, mes, dia } = fechaBogota(now);
  const [horas, minutos] = clase.hora.split(':').map(Number);
  return new Date(
    Date.UTC(anio, mes - 1, dia + clase.diaOffset, horas, minutos) + DESFASE_BOGOTA_MS,
  );
}

// Clave "YYYY-MM-DD" del día de clase (fecha de Bogotá de su inicio).
export function claveDiaClase(clase: Clase, now: Date): string {
  const { anio, mes, dia } = fechaBogota(inicioClase(clase, now));
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}
