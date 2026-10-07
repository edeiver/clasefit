import { cargarClases } from '../src/data/clases';
import { cuposDisponibles, etiquetaCupos } from '../src/domain/availability';
import { MENSAJES } from '../src/domain/messages';

const clases = cargarClases();
const clase = (id: string) => clases.find((c) => c.id === id)!;

describe('Requirement: Cálculo de cupos disponibles', () => {
  test('Cupos sin reservas de Laura', () => {
    const c07 = clase('C-07');
    expect(cuposDisponibles(c07, [])).toBe(7);
    expect(etiquetaCupos(c07, [])).toBe('7 de 12 cupos');
  });

  test('Cupos con la reserva de Laura sumada', () => {
    const c07 = clase('C-07');
    const reservas = [{ claseId: 'C-07' }];
    expect(cuposDisponibles(c07, reservas)).toBe(6);
    expect(etiquetaCupos(c07, reservas)).toBe('6 de 12 cupos');
  });

  test('Último cupo tomado por Laura deja la clase sin cupos', () => {
    const c06 = clase('C-06');
    const reservas = [{ claseId: 'C-06' }];
    expect(cuposDisponibles(c06, reservas)).toBe(0);
    expect(etiquetaCupos(c06, reservas)).toBe(MENSAJES.llena);
  });
});
