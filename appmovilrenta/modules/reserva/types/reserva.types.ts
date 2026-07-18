// modules/reserva/types/reserva.types.ts

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

// Debe coincidir exactamente con SeccionReserva (definido en
// modules/reserva/components/TabsSeccion.tsx), que es el tipo que la
// UI (FlujoReserva.tsx) realmente usa para sus tabs.
export type PasoReserva = "fechas" | "planes" | "datos";

// ===================== TAB "PLANES" =====================
export type TipoKilometraje = "limitado" | "ilimitado";

export interface DatosPlanes {
  proteccion: string | null; // nombre del seguro elegido, ej: "Protección Obligatoria"
  tipoKilometraje: TipoKilometraje | null; // null hasta que el usuario elige (es obligatorio pero no viene preseleccionado)
  serviciosSeleccionados: string[]; // nombres de servicios adicionales elegidos
}

// ===================== TAB "DATOS PERSONALES" =====================

export type TipoDocumento = "CC" | "CE" | "PA";

export interface DatosPersonales {
  nombreCompleto: string;
  nacionalidad: string;
  correo: string;
  celular: string; // solo dígitos, sin el prefijo +57
  tipoDocumento: TipoDocumento | null;
  numeroDocumento: string;
  terminosAceptados: boolean; // checkbox de "Autorizo el tratamiento de mis datos..."
}

// Representa un archivo ya seleccionado con expo-document-picker.
export interface ArchivoDocumento {
  uri: string;
  nombre: string;
  tipoMime: string;
  tamanoBytes: number;
}

export type LlaveDocumento = "cedulaFrente" | "cedulaReverso" | "licenciaConduccion";

export type DatosDocumentos = Record<LlaveDocumento, ArchivoDocumento | null>;