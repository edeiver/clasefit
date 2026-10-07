import { cargarClases } from '../data/clases';
import { validarCancelacion, validarReserva } from '../domain/booking';
import { inicioClase } from '../domain/dates';
import type { Reserva } from '../domain/types';

export type BookingState = {
  reservas: Reserva[];
  // Último mensaje a mostrar en la UI (éxito o error de la regla que falló).
  mensaje: string | null;
};

export type BookingAction =
  | { type: 'reservar'; claseId: string; now: Date }
  | { type: 'cancelar'; claseId: string; now: Date }
  | { type: 'limpiarMensaje' };

export const estadoInicial: BookingState = { reservas: [], mensaje: null };

const clases = cargarClases();

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'reservar': {
      const clase = clases.find((c) => c.id === action.claseId);
      if (!clase) return state;
      const resultado = validarReserva(clase, clases, state.reservas, action.now);
      if (!resultado.ok) return { ...state, mensaje: resultado.mensaje };
      return {
        reservas: [...state.reservas, { claseId: clase.id }],
        mensaje: resultado.mensaje,
      };
    }
    case 'cancelar': {
      const clase = clases.find((c) => c.id === action.claseId);
      if (!clase) return state;
      const resultado = validarCancelacion(inicioClase(clase, action.now), action.now);
      if (!resultado.ok) return { ...state, mensaje: resultado.mensaje };
      return {
        reservas: state.reservas.filter((r) => r.claseId !== clase.id),
        mensaje: null,
      };
    }
    case 'limpiarMensaje':
      return { ...state, mensaje: null };
  }
}
