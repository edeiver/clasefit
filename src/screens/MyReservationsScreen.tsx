import { Alert, FlatList, Text } from 'react-native';
import { ClassCard } from '../components/ClassCard';
import { cargarClases } from '../data/clases';
import { MENSAJES } from '../domain/messages';
import { misReservas } from '../domain/myReservations';
import type { Clase } from '../domain/types';
import { useBooking } from '../state/BookingContext';

const clases = cargarClases();

export function MyReservationsScreen() {
  const { state, dispatch } = useBooking();
  const lista = misReservas(state.reservas, clases, new Date());

  const confirmarCancelacion = (clase: Clase) => {
    Alert.alert('Cancelar reserva', `¿Quieres cancelar ${clase.nombre} (${clase.hora})?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => dispatch({ type: 'cancelar', claseId: clase.id, now: new Date() }),
      },
    ]);
  };

  if (lista.length === 0) {
    return <Text>{MENSAJES.sinReservas}</Text>;
  }

  return (
    <FlatList
      data={lista}
      keyExtractor={({ clase }) => clase.id}
      renderItem={({ item: { clase } }) => (
        <ClassCard
          clase={clase}
          reservas={state.reservas}
          onCancelar={() => confirmarCancelacion(clase)}
        />
      )}
    />
  );
}
