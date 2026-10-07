import { FlatList } from 'react-native';
import { ClassCard } from '../components/ClassCard';
import { cargarClases } from '../data/clases';
import { proximasClases } from '../domain/upcoming';
import { useBooking } from '../state/BookingContext';

const clases = cargarClases();

export function UpcomingClassesScreen() {
  const { state, dispatch } = useBooking();
  const lista = proximasClases(clases, new Date());

  return (
    <FlatList
      data={lista}
      keyExtractor={({ clase }) => clase.id}
      renderItem={({ item: { clase } }) => (
        <ClassCard
          clase={clase}
          reservas={state.reservas}
          onReservar={() => dispatch({ type: 'reservar', claseId: clase.id, now: new Date() })}
        />
      )}
    />
  );
}
