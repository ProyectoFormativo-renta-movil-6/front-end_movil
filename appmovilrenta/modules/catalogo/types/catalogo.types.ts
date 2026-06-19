// modules/catalogo/types/catalogo.types.ts

export interface Vehiculo {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  categoria: "Sedan" | "SUV" | "Económico" | "Deportivo" | "Van" | "Premium";
  precio: number;
  transmision: "Automática" | "Manual";
  combustible: "Gasolina" | "Diesel" | "Híbrido" | "Eléctrico";
  sucursal: string;
  disponible: boolean;
  imagen: string;
  descripcion?: string;
  pasajeros?: number;
  puertas?: number;
}

export interface FiltrosCatalogo {
  categoria: string;
  precioMin: string;
  precioMax: string;
  transmision: string;
  combustible: string;
  sucursal: string;
  orden: string;
  busqueda: string;
  soloDisponibles: boolean;
}

export interface BusquedaFechas {
  lugarRecogida: string;
  lugarDevolucion: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface UseCatalogoReturn {
  vehiculos: Vehiculo[];
  vehiculosFiltrados: Vehiculo[];
  vehiculosPaginados: Vehiculo[];
  filtros: FiltrosCatalogo;
  busquedaFechas: BusquedaFechas;
  paginaActual: number;
  totalPaginas: number;
  cargando: boolean;
  error: string | null;
  setFiltro: (key: keyof FiltrosCatalogo, value: string | boolean) => void;
  setBusquedaFechas: (key: keyof BusquedaFechas, value: string) => void;
  resetFiltros: () => void;
  irPagina: (pagina: number) => void;
  paginaSiguiente: () => void;
  paginaAnterior: () => void;
}

export const CATEGORIAS = [
  "Todos",
  "Sedan",
  "SUV",
  "Económico",
  "Deportivo",
  "Van",
  "Premium",
];
export const TRANSMISIONES = ["Todas", "Automática", "Manual"];
export const COMBUSTIBLES = [
  "Todos",
  "Gasolina",
  "Diesel",
  "Híbrido",
  "Eléctrico",
];
export const SUCURSALES = [
  "Todas",
  "Localiza (El Dorado)",
  "Tu Roll (El Poblado)",
  "Europcar (El Dorado)",
  "Enterprise (El Dorado)",
  "Sixt (JMC)",
  "Alamo (El Dorado)",
];

export const FILTROS_BASE: FiltrosCatalogo = {
  categoria: "Todos",
  precioMin: "",
  precioMax: "",
  transmision: "Todas",
  combustible: "Todos",
  sucursal: "Todas",
  orden: "precio_asc",
  busqueda: "",
  soloDisponibles: false,
};

export const BUSQUEDA_FECHAS_BASE: BusquedaFechas = {
  lugarRecogida: "",
  lugarDevolucion: "",
  fechaInicio: "",
  fechaFin: "",
};
