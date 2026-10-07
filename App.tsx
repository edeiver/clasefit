import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, StatusBar as RNStatusBar, StyleSheet, Text, View } from 'react-native';
import datos from './src/data/clases.json';
import { MENSAJES } from './src/domain/messages';
import { MyReservationsScreen } from './src/screens/MyReservationsScreen';
import { UpcomingClassesScreen } from './src/screens/UpcomingClassesScreen';
import { BookingProvider, useBooking } from './src/state/BookingContext';
import { colores, espacio, radio, sombra } from './src/theme';

type Pestana = 'proximas' | 'reservas';

// "ClaseFit · Sede Laureles" → "Sede Laureles"
const sede = datos.gimnasio.split('· ').pop() ?? datos.gimnasio;
const altoBarraEstado = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 54;

function Contenido() {
  const [pestana, setPestana] = useState<Pestana>('proximas');
  const { state, dispatch } = useBooking();

  const cambiarPestana = (nueva: Pestana) => {
    setPestana(nueva);
    dispatch({ type: 'limpiarMensaje' });
  };

  const exito = state.mensaje === MENSAJES.reservaExitosa;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>ClaseFit</Text>
        <Text style={styles.subtitulo}>
          {sede} · {datos.socio.nombre}
        </Text>
      </View>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, pestana === 'proximas' && styles.tabActiva]}
          onPress={() => cambiarPestana('proximas')}
        >
          <Text style={[styles.textoTab, pestana === 'proximas' && styles.textoTabActiva]}>
            Próximas clases
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, pestana === 'reservas' && styles.tabActiva]}
          onPress={() => cambiarPestana('reservas')}
        >
          <Text style={[styles.textoTab, pestana === 'reservas' && styles.textoTabActiva]}>
            Mis reservas ({state.reservas.length})
          </Text>
        </Pressable>
      </View>
      {state.mensaje && (
        <View style={[styles.banner, exito ? styles.bannerExito : styles.bannerError]}>
          <View style={[styles.icono, exito ? styles.iconoExito : styles.iconoError]}>
            <Text style={styles.textoIcono}>{exito ? '✓' : '!'}</Text>
          </View>
          <Text style={styles.textoBanner}>{state.mensaje}</Text>
          <Pressable hitSlop={12} onPress={() => dispatch({ type: 'limpiarMensaje' })}>
            <Text style={styles.cerrar}>✕</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.pantalla}>
        {pestana === 'proximas' ? <UpcomingClassesScreen /> : <MyReservationsScreen />}
      </View>
      <StatusBar style="dark" />
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
  container: { flex: 1, backgroundColor: colores.fondo, paddingTop: altoBarraEstado },
  header: { paddingHorizontal: espacio.m + 4, paddingTop: espacio.s, paddingBottom: espacio.l },
  titulo: { fontSize: 34, fontWeight: '800', color: colores.texto, letterSpacing: -0.5 },
  subtitulo: { marginTop: 2, fontSize: 16, color: colores.textoSecundario },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: espacio.m,
    padding: 3,
    backgroundColor: colores.grisSuave,
    borderRadius: 12,
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  tabActiva: { backgroundColor: colores.tarjeta, ...sombra },
  textoTab: { fontSize: 15, color: colores.textoSecundario },
  textoTabActiva: { color: colores.texto, fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: espacio.m,
    marginTop: espacio.m,
    padding: espacio.m,
    borderRadius: radio,
  },
  bannerExito: { backgroundColor: colores.verdeSuave },
  bannerError: { backgroundColor: colores.rojoSuave },
  icono: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: espacio.s + 4,
  },
  iconoExito: { backgroundColor: colores.verde },
  iconoError: { backgroundColor: colores.rojo },
  textoIcono: { color: '#fff', fontWeight: '800', fontSize: 15 },
  textoBanner: { flex: 1, fontSize: 15, fontWeight: '500', color: colores.texto },
  cerrar: { fontSize: 18, color: colores.textoSecundario, marginLeft: espacio.s },
  pantalla: { flex: 1 },
});
