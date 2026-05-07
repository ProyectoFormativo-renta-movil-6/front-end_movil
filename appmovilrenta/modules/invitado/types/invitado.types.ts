import { ImageSourcePropType } from "react-native";

export type CategoriaFiltro =
  | "Todos"
  | "SUV"
  | "Económico"
  | "Sedán"
  | "Premium"
  | "Van";

export interface VehiculoInvitado {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  categoria: CategoriaFiltro;
  precioDia: number;
  capacidad: number;
  transmision: "manual" | "automatica";
  combustible: "gasolina" | "diesel" | "hibrido" | "electrico";
  estado: "disponible" | "reservado" | "mantenimiento";
  sucursal: string;
  calificacion: number;
  totalCalificaciones: number;
  imagen: ImageSourcePropType;
  kilometraje: "limitado" | "ilimitado";
  descripcion: string;
  serviciosIncluidos: string[];
}

export interface FiltrosInvitado {
  categoria: CategoriaFiltro;
  busqueda: string;
  soloDisponibles: boolean;
}

export interface VentajaRegistro {
  icon: string;
    titulo: string;
  descripcion: string;
}