import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { ClassCard } from '../components/ClassCard';
import { cargarClases } from '../data/clases';
import { MENSAJES } from '../domain/messages';
import { misReservas } from '../domain/myReservations';
import type { Clase } from '../domain/types';
import { useBooking } from '../state/BookingContext';
import { colores, espacio } from '../theme';

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
    return (
      <View style={styles.vacio}>
        <Text style={styles.textoVacio}>{MENSAJES.sinReservas}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={lista}
      keyExtractor={({ clase }) => clase.id}
      contentContainerStyle={styles.contenido}
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

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: espacio.m, paddingTop: espacio.l, paddingBottom: espacio.l },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espacio.l },
  textoVacio: { fontSize: 16, color: colores.textoSecundario, textAlign: 'center' },
});
