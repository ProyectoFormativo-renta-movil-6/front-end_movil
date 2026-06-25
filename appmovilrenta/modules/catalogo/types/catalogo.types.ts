// modules/catalogo/types/catalogo.types.ts

export interface Tarifa {
  km?: number;
  precio: number;
  excedente?: number;
}

export interface Seguro {
  nombre: string;
  precio: number;
}

export interface Vehiculo {
  id: number;
  nombre: string;
  // 👇 AQUÍ ESTÁ EL CAMBIO: Añadidos para solucionar el filtrado y quitar los "any"
  marca: string; // O 'marca?: string;' si es opcional en tu base de datos
  modelo: string; // O 'modelo?: string;' si es opcional en tu base de datos
  categoria: string;
  transmision: string;
  combustible: string;
  precio: number;
  calificacion: number;
  disponible: boolean;
  destacado?: boolean;
  puertas?: number;
  pasajeros?: number;
  maletero?: number;
  cilindraje?: string;
  color?: string;
  año?: number;
  placa?: string;
  sucursal?: string;
  // Características booleanas
  aireAcondicionado?: boolean;
  vidriosElectricos?: boolean;
  cierreCentralizado?: boolean;
  bluetooth?: boolean;
  camaraReversa?: boolean;
  sensoresParqueo?: boolean;
  tarifas?: {
    kmLimitado?: Tarifa;
    kmIlimitado?: Tarifa;
  };
  seguros?: Seguro[];
  imagenes?: string[];
  imagen?: string;
  foto?: string;
}

export interface FiltrosCatalogoState {
  categoria: string;
  precioMin: string;
  precioMax: string;
  transmision: string;
  combustible: string;
  sucursal: string;
  orden: string;
  busqueda: string;
}

export interface BusquedaForm {
  lugarRecogida: string;
  lugarDevolucion: string;
  fechaInicio: string;
  fechaFin: string;
  mismoLugar: boolean;
}
