// Etiqueta del día de la clase según su diaOffset (decisión de UI en design.md).
const ETIQUETAS_DIA = ['Hoy', 'Mañana', 'Pasado mañana'] as const;

export function etiquetaDia(diaOffset: number): string {
  return ETIQUETAS_DIA[diaOffset] ?? '';
}
