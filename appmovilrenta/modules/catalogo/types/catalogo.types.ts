import { ImageSourcePropType } from "react-native";

export type CategoriaVehiculo =
  | "Todas"
  | "SUVs"
  | "Económicos"
  | "Sedán"
  | "Premium"
  | "Van";

export type EstadoVehiculo = "disponible" | "reservado" | "mantenimiento";

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  categoria: CategoriaVehiculo;
  precioDia: number;
  capacidad: number;
  transmision: "manual" | "automatica";
  combustible: "gasolina" | "diesel" | "hibrido" | "electrico";
  estado: EstadoVehiculo;
  sucursal: string;
  calificacion: number;
  totalCalificaciones: number;
  imagen: ImageSourcePropType;
  kilometraje: "limitado" | "ilimitado";
  descripcion: string;
  serviciosIncluidos: string[];
  tarifaDia: number;
  aireAcondicionado: boolean;
}

export interface FiltrosCatalogo {
  categoria: CategoriaVehiculo;
  busqueda: string;
  soloDisponibles: boolean;
}