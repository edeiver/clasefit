import { Pressable, StyleSheet, Text, View } from 'react-native';
import { etiquetaCupos, sinCupos } from '../domain/availability';
import { etiquetaDia } from '../domain/dayLabel';
import type { Clase, Reserva } from '../domain/types';

type Props = {
  clase: Clase;
  reservas: Reserva[];
  onReservar?: () => void;
  onCancelar?: () => void;
};

export function ClassCard({ clase, reservas, onReservar, onCancelar }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>{clase.nombre}</Text>
      <Text>
        {etiquetaDia(clase.diaOffset)} · {clase.hora}
      </Text>
      <Text>{clase.instructor}</Text>
      <Text>{etiquetaCupos(clase, reservas)}</Text>
      {onReservar && !sinCupos(clase, reservas) && (
        <Pressable style={styles.boton} onPress={onReservar}>
          <Text style={styles.textoBoton}>Reservar</Text>
        </Pressable>
      )}
      {onCancelar && (
        <Pressable style={styles.boton} onPress={onCancelar}>
          <Text style={styles.textoBoton}>Cancelar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  nombre: { fontWeight: 'bold', fontSize: 16 },
  boton: { marginTop: 8, padding: 8, backgroundColor: '#222', borderRadius: 6, alignSelf: 'flex-start' },
  textoBoton: { color: '#fff' },
});
