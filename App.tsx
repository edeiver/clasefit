import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MyReservationsScreen } from './src/screens/MyReservationsScreen';
import { UpcomingClassesScreen } from './src/screens/UpcomingClassesScreen';
import { BookingProvider, useBooking } from './src/state/BookingContext';

type Pestana = 'proximas' | 'reservas';

function Contenido() {
  const [pestana, setPestana] = useState<Pestana>('proximas');
  const { state, dispatch } = useBooking();

  const cambiarPestana = (nueva: Pestana) => {
    setPestana(nueva);
    dispatch({ type: 'limpiarMensaje' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => cambiarPestana('proximas')}>
          <Text style={pestana === 'proximas' && styles.tabActiva}>Próximas clases</Text>
        </Pressable>
        <Pressable style={styles.tab} onPress={() => cambiarPestana('reservas')}>
          <Text style={pestana === 'reservas' && styles.tabActiva}>Mis reservas</Text>
        </Pressable>
      </View>
      {state.mensaje && (
        <Pressable style={styles.banner} onPress={() => dispatch({ type: 'limpiarMensaje' })}>
          <Text>{state.mensaje}</Text>
        </Pressable>
      )}
      <View style={styles.pantalla}>
        {pestana === 'proximas' ? <UpcomingClassesScreen /> : <MyReservationsScreen />}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <Contenido />
    </BookingProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 48 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  tabActiva: { fontWeight: 'bold' },
  banner: { margin: 12, padding: 12, backgroundColor: '#eef', borderRadius: 6 },
  pantalla: { flex: 1, paddingHorizontal: 12 },
});
