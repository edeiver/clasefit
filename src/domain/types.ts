export type Clase = {
  id: string;
  nombre: string;
  instructor: string;
  diaOffset: number;
  hora: string;
  duracionMin: number;
  cupoTotal: number;
  ocupados: number;
};

export type Reserva = {
  claseId: string;
};
