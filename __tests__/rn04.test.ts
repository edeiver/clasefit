import { cargarClases } from '../src/data/clases';
import { validarCancelacion } from '../src/domain/booking';
import { inicioClase } from '../src/domain/dates';
import { MENSAJES } from '../src/domain/messages';

const c07 = cargarClases().find((c) => c.id === 'C-07')!;
// C-07 reservada el 2026-10-07 (diaOffset 1): inicio 2026-10-08 18:00 -05:00.
const inicioC07 = inicioClase(c07, new Date('2026-10-07T10:00:00-05:00'));

describe('Requirement: RN-04 Cancelar solo hasta 2 horas antes del inicio', () => {
  test('Faltan más de 2 horas', () => {
    const now = new Date('2026-10-08T10:00:00-05:00');
    expect(validarCancelacion(inicioC07, now)).toEqual({ ok: true });
  });

  test('Faltan exactamente 2 horas', () => {
    const now = new Date('2026-10-08T16:00:00.000-05:00');
    expect(validarCancelacion(inicioC07, now)).toEqual({ ok: true });
  });

  test('Faltan un poco menos de 2 horas', () => {
    const now = new Date('2026-10-08T16:00:00.001-05:00');
    expect(validarCancelacion(inicioC07, now)).toEqual({
      ok: false,
      mensaje: MENSAJES.rn04NoCancelar,
    });
  });

  test('La clase ya empezó', () => {
    const now = new Date('2026-10-08T18:10:00-05:00');
    expect(validarCancelacion(inicioC07, now)).toEqual({
      ok: false,
      mensaje: MENSAJES.rn04NoCancelar,
    });
  });
});
