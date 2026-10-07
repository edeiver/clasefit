import { cargarClases } from '../src/data/clases';
import { etiquetaCupos, sinCupos } from '../src/domain/availability';
import { MENSAJES } from '../src/domain/messages';
import { proximasClases } from '../src/domain/upcoming';

const clases = cargarClases();
const ids = (now: Date) => proximasClases(clases, now).map((p) => p.clase.id);

describe('Requirement: HU-01 Ver próximas clases', () => {
  test('Listado ordenado de próximas clases', () => {
    const now = new Date('2026-10-07T10:00:00-05:00');
    expect(ids(now)).toEqual([
      'C-02', 'C-03', 'C-04', 'C-05', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10',
    ]);
  });

  test('Clase que ya empezó no aparece', () => {
    const now = new Date('2026-10-07T10:00:00-05:00');
    expect(ids(now)).not.toContain('C-01');
  });

  test('Clase cuyo inicio es exactamente igual a now', () => {
    const now = new Date('2026-10-07T18:00:00.000-05:00');
    expect(ids(now)).not.toContain('C-02');
  });

  test('Clase un instante antes de su inicio', () => {
    const now = new Date('2026-10-07T17:59:59.999-05:00');
    expect(ids(now)).toContain('C-02');
  });

  test('Clase sin cupos se muestra como Llena', () => {
    const now = new Date('2026-10-07T10:00:00-05:00');
    const c03 = proximasClases(clases, now).find((p) => p.clase.id === 'C-03')!.clase;
    expect(etiquetaCupos(c03, [])).toBe(MENSAJES.llena);
    expect(sinCupos(c03, [])).toBe(true);
    expect(etiquetaCupos(c03, [])).not.toMatch(/de \d+ cupos/);
  });
});
