import { Pressable, StyleSheet, Text, View } from 'react-native';
import { etiquetaCupos, sinCupos } from '../domain/availability';
import { etiquetaDia } from '../domain/dayLabel';
import type { Clase, Reserva } from '../domain/types';
import { colores, espacio, radio, sombra } from '../theme';

type Props = {
  clase: Clase;
  reservas: Reserva[];
  onReservar?: () => void;
  onCancelar?: () => void;
};

export function ClassCard({ clase, reservas, onReservar, onCancelar }: Props) {
  if (onCancelar) {
    return (
      <View style={[styles.card, styles.compacta]}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{clase.nombre}</Text>
          <Text style={styles.detalle} numberOfLines={1}>
            {etiquetaDia(clase.diaOffset)} · {clase.hora} · {clase.instructor}
          </Text>
        </View>
        <Pressable style={styles.botonCancelar} onPress={onCancelar}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  const llena = sinCupos(clase, reservas);
  const reservada = reservas.some((r) => r.claseId === clase.id);

  return (
    <View style={[styles.card, reservada && styles.reservada]}>
      <View style={styles.fila}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{clase.nombre}</Text>
          <Text style={styles.detalle}>
            {clase.hora} · {clase.instructor}
          </Text>
        </View>
        <View style={[styles.pill, llena && styles.pillLlena]}>
          <Text style={[styles.textoPill, llena && styles.textoPillLlena]}>
            {etiquetaCupos(clase, reservas)}
          </Text>
        </View>
      </View>
      {onReservar && !llena && (
        <Pressable style={styles.botonReservar} onPress={onReservar}>
          <Text style={styles.textoReservar}>Reservar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colores.tarjeta,
    borderRadius: radio,
    padding: espacio.m,
    marginBottom: espacio.s + 4,
    ...sombra,
  },
  reservada: { borderLeftWidth: 4, borderLeftColor: colores.acento },
  compacta: { flexDirection: 'row', alignItems: 'center' },
  fila: { flexDirection: 'row', alignItems: 'flex-start' },
  info: { flex: 1, marginRight: espacio.s },
  nombre: { fontSize: 17, fontWeight: '700', color: colores.texto },
  detalle: { marginTop: 2, fontSize: 15, color: colores.textoSecundario },
  pill: {
    backgroundColor: colores.grisSuave,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillLlena: { backgroundColor: colores.rojoSuave },
  textoPill: { fontSize: 12, color: colores.texto },
  textoPillLlena: { color: colores.rojo, fontWeight: '600' },
  botonReservar: {
    alignSelf: 'flex-end',
    marginTop: espacio.m,
    backgroundColor: colores.acento,
    borderRadius: 10,
    paddingHorizontal: espacio.m + 2,
    paddingVertical: 10,
  },
  textoReservar: { color: '#fff', fontWeight: '600', fontSize: 14 },
  botonCancelar: {
    backgroundColor: colores.rojoSuave,
    borderRadius: 999,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
  },
  textoCancelar: { color: colores.rojo, fontWeight: '600', fontSize: 15 },
});
