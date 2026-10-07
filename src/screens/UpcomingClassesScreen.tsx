import { SectionList, StyleSheet, Text } from 'react-native';
import { ClassCard } from '../components/ClassCard';
import { cargarClases } from '../data/clases';
import { etiquetaDia } from '../domain/dayLabel';
import { proximasClases, type ClaseProgramada } from '../domain/upcoming';
import { useBooking } from '../state/BookingContext';
import { colores, espacio } from '../theme';

const clases = cargarClases();

type Seccion = { title: string; data: ClaseProgramada[] };

// La lista ya viene ordenada por inicio, así que cada día queda contiguo.
function agruparPorDia(lista: ClaseProgramada[]): Seccion[] {
  const secciones: Seccion[] = [];
  for (const item of lista) {
    const titulo = etiquetaDia(item.clase.diaOffset);
    const ultima = secciones[secciones.length - 1];
    if (ultima && ultima.title === titulo) {
      ultima.data.push(item);
    } else {
      secciones.push({ title: titulo, data: [item] });
    }
  }
  return secciones;
}

export function UpcomingClassesScreen() {
  const { state, dispatch } = useBooking();
  const secciones = agruparPorDia(proximasClases(clases, new Date()));

  return (
    <SectionList
      sections={secciones}
      keyExtractor={({ clase }) => clase.id}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.contenido}
      renderSectionHeader={({ section }) => <Text style={styles.encabezado}>{section.title}</Text>}
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

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: espacio.m, paddingBottom: espacio.l },
  encabezado: {
    marginTop: espacio.l,
    marginBottom: espacio.s + 4,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colores.textoSecundario,
  },
});
