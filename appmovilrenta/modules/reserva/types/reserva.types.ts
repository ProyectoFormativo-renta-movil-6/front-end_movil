import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";

export type MetodoPago = "wompi" | "efectivo";

export interface DatosFechasLugar {
  metodoPago: MetodoPago | null;
  lugarRetiro: string;      // nombre de sucursal, ej: "Alquiler Neiva - Centro"
  lugarDevolucion: string;
  fechaRetiro: string | null;      // formato "YYYY-MM-DD"
  fechaDevolucion: string | null;  // formato "YYYY-MM-DD"
  horaRetiro: string;    // formato "HH:mm"
  horaDevolucion: string;
}

export interface DesgloseTarifa {
  diarias: number;
  proteccionObligatoria: number;
  cargosAdministrativos: number;
  recargoLogistico: number;
  total: number;
  diasReserva: number;
}

export type PasoReserva = "fechas" | "proteccion" | "datos";