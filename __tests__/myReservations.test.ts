import { cargarClases } from '../src/data/clases';
import { misReservas } from '../src/domain/myReservations';

const clases = cargarClases();
const now = new Date('2026-10-07T10:00:00-05:00');

describe('Requirement: HU-03 Ver y cancelar mis reservas', () => {
  test('Reservas ordenadas, la más próxima primero', () => {
    const reservas = [{ claseId: 'C-09' }, { claseId: 'C-02' }, { claseId: 'C-07' }];
    expect(misReservas(reservas, clases, now).map((p) => p.clase.id)).toEqual([
      'C-02', 'C-07', 'C-09',
    ]);
  });
});
