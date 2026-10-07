import { sinCupos } from './availability';
import { claveDiaClase } from './dates';
import { MENSAJES } from './messages';
import type { Clase, Reserva } from './types';

export type ResultadoReserva = { ok: boolean; mensaje: string };
export type ResultadoCancelacion = { ok: true } | { ok: false; mensaje: string };

const MAX_RESERVAS_POR_DIA = 2;
const MIN_ANTICIPACION_CANCELAR_MS = 2 * 60 * 60 * 1000;

// Valida una reserva en el orden RN-02 → RN-01 → RN-03 y devuelve el primer error.
export function validarReserva(
  clase: Clase,
  clases: Clase[],
  reservas: Reserva[],
  now: Date,
): ResultadoReserva {
  if (reservas.some((r) => r.claseId === clase.id)) {
    return { ok: false, mensaje: MENSAJES.rn02YaReservada };
  }
  if (sinCupos(clase, reservas)) {
    return { ok: false, mensaje: MENSAJES.rn01SinCupos };
  }
  const dia = claveDiaClase(clase, now);
  const reservasDelDia = reservas.filter((r) => {
    const reservada = clases.find((c) => c.id === r.claseId);
    return reservada !== undefined && claveDiaClase(reservada, now) === dia;
  }).length;
  if (reservasDelDia >= MAX_RESERVAS_POR_DIA) {
    return { ok: false, mensaje: MENSAJES.rn03LimiteDia };
  }
  return { ok: true, mensaje: MENSAJES.reservaExitosa };
}

// RN-04: se puede cancelar si faltan 2 horas o más para el inicio.
export function validarCancelacion(inicio: Date, now: Date): ResultadoCancelacion {
  if (inicio.getTime() - now.getTime() < MIN_ANTICIPACION_CANCELAR_MS) {
    return { ok: false, mensaje: MENSAJES.rn04NoCancelar };
  }
  return { ok: true };
}
