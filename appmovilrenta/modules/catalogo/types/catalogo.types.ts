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
  marca: string;
  modelo: string;
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
  ciudad: string;
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