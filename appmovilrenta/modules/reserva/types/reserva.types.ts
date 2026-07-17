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

  // Datos de entrega/devolución a domicilio — solo se usan cuando
  // lugarRetiro / lugarDevolucion === "domicilio".
  barrioRetiro: string;
  direccionRetiro: string;
  referenciasRetiro: string;
  barrioDevolucion: string;
  direccionDevolucion: string;
  referenciasDevolucion: string;
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

// ===================== TAB "PLANES" =====================
export type TipoKilometraje = "limitado" | "ilimitado";

export interface DatosPlanes {
  proteccion: string | null; // nombre del seguro elegido, ej: "Protección Obligatoria"
  tipoKilometraje: TipoKilometraje | null; // null hasta que el usuario elige (es obligatorio pero no viene preseleccionado)
  serviciosSeleccionados: string[]; // nombres de servicios adicionales elegidos
}