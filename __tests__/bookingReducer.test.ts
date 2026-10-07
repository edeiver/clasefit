import { cargarClases } from '../src/data/clases';
import { etiquetaCupos } from '../src/domain/availability';
import { MENSAJES } from '../src/domain/messages';
import { bookingReducer, estadoInicial, type BookingState } from '../src/state/bookingReducer';

const clases = cargarClases();
const clase = (id: string) => clases.find((c) => c.id === id)!;
const now = new Date('2026-10-07T10:00:00-05:00');

describe('Requirement: HU-02 Reservar una clase', () => {
  test('Reserva exitosa', () => {
    expect(etiquetaCupos(clase('C-07'), estadoInicial.reservas)).toBe('7 de 12 cupos');
    const estado = bookingReducer(estadoInicial, { type: 'reservar', claseId: 'C-07', now });
    expect(estado.reservas).toEqual([{ claseId: 'C-07' }]);
    expect(etiquetaCupos(clase('C-07'), estado.reservas)).toBe('6 de 12 cupos');
    expect(estado.mensaje).toBe(MENSAJES.reservaExitosa);
  });

  test('Reserva rechazada no modifica el estado', () => {
    const casos: { previo: BookingState; claseId: string; mensaje: string }[] = [
      // RN-02
      { previo: { reservas: [{ claseId: 'C-07' }], mensaje: null }, claseId: 'C-07', mensaje: MENSAJES.rn02YaReservada },
      // RN-01
      { previo: estadoInicial, claseId: 'C-08', mensaje: MENSAJES.rn01SinCupos },
      // RN-03
      { previo: { reservas: [{ claseId: 'C-05' }, { claseId: 'C-07' }], mensaje: null }, claseId: 'C-06', mensaje: MENSAJES.rn03LimiteDia },
    ];
    for (const { previo, claseId, mensaje } of casos) {
      const cuposAntes = etiquetaCupos(clase(claseId), previo.reservas);
      const estado = bookingReducer(previo, { type: 'reservar', claseId, now });
      expect(estado.reservas).toEqual(previo.reservas);
      expect(etiquetaCupos(clase(claseId), estado.reservas)).toBe(cuposAntes);
      expect(estado.mensaje).toBe(mensaje);
    }
  });
});

describe('Requirement: HU-03 Ver y cancelar mis reservas', () => {
  test('Cancelación confirmada libera el cupo', () => {
    const previo: BookingState = { reservas: [{ claseId: 'C-07' }], mensaje: null };
    const estado = bookingReducer(previo, { type: 'cancelar', claseId: 'C-07', now });
    expect(estado.reservas).toEqual([]);
    expect(etiquetaCupos(clase('C-07'), estado.reservas)).toBe('7 de 12 cupos');
  });
});
