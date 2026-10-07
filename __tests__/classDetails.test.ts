import { cargarClases } from '../src/data/clases';
import { etiquetaCupos } from '../src/domain/availability';
import { etiquetaDia } from '../src/domain/dayLabel';
import { proximasClases } from '../src/domain/upcoming';

const clases = cargarClases();
const now = new Date('2026-10-07T10:00:00-05:00');

describe('Requirement: HU-01 Ver próximas clases', () => {
  test('Datos mostrados por clase', () => {
    const c02 = proximasClases(clases, now).find((p) => p.clase.id === 'C-02')!.clase;
    expect(c02.nombre).toBe('Funcional');
    expect(etiquetaDia(c02.diaOffset)).toBe('Hoy');
    expect(c02.hora).toBe('18:00');
    expect(c02.instructor).toBe('Camila Ospina');
    expect(etiquetaCupos(c02, [])).toBe('6 de 15 cupos');
  });
});
