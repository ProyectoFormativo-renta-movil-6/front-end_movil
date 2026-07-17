import { create } from "zustand";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { DatosFechasLugar, DatosPlanes, PasoReserva } from "@/modules/reserva/types/reserva.types";

interface ReservaStore {
  vehiculoSeleccionado: Vehiculo | null;
  pasoActual: PasoReserva;
  fechasLugar: DatosFechasLugar;
  planes: DatosPlanes;

  seleccionarVehiculo: (
    vehiculo: Vehiculo,
    datosPrecarga?: Partial<Pick<DatosFechasLugar, "lugarRetiro" | "fechaRetiro" | "fechaDevolucion">>
  ) => void;
  setPaso: (paso: PasoReserva) => void;
  actualizarFechasLugar: (data: Partial<DatosFechasLugar>) => void;
  actualizarPlanes: (data: Partial<DatosPlanes>) => void;
  toggleServicioAdicional: (nombre: string) => void;
  limpiarReserva: () => void;
}

function fechasLugarInicial(vehiculo?: Vehiculo | null): DatosFechasLugar {
  return {
    metodoPago: null,
    lugarRetiro: "",
    lugarDevolucion: "",
    fechaRetiro: null,
    fechaDevolucion: null,
    horaRetiro: "",
    horaDevolucion: "",
    // Datos de entrega/devolución a domicilio — solo aplican cuando
    // lugarRetiro / lugarDevolucion === "domicilio".
    barrioRetiro: "",
    direccionRetiro: "",
    referenciasRetiro: "",
    barrioDevolucion: "",
    direccionDevolucion: "",
    referenciasDevolucion: "",
  };
}

// Ni la protección ni el tipo de kilometraje vienen preseleccionados:
// son obligatorios, pero los elige el usuario. Lo único realmente
// opcional son los servicios adicionales (arrancan vacíos).
function planesInicial(vehiculo?: Vehiculo | null): DatosPlanes {
  return {
    proteccion: null,
    tipoKilometraje: null,
    serviciosSeleccionados: [],
  };
}

export const useReservaStore = create<ReservaStore>()((set) => ({
  vehiculoSeleccionado: null,
  pasoActual: "fechas",
  fechasLugar: fechasLugarInicial(),
  planes: planesInicial(),

  // datosPrecarga viene de una búsqueda previa en "Consultar disponibilidad"
  // (BuscadorCatalogo). Si el usuario no buscó nada, llega undefined y el
  // spread no cambia nada — arranca igual que siempre.
  seleccionarVehiculo: (vehiculo, datosPrecarga) =>
    set({
      vehiculoSeleccionado: vehiculo,
      pasoActual: "fechas",
      fechasLugar: { ...fechasLugarInicial(vehiculo), ...datosPrecarga },
      planes: planesInicial(vehiculo),
    }),

  setPaso: (paso) => set({ pasoActual: paso }),

  actualizarFechasLugar: (data) =>
    set((state) => ({ fechasLugar: { ...state.fechasLugar, ...data } })),

  actualizarPlanes: (data) =>
    set((state) => ({ planes: { ...state.planes, ...data } })),

  toggleServicioAdicional: (nombre) =>
    set((state) => {
      const yaEsta = state.planes.serviciosSeleccionados.includes(nombre);
      const serviciosSeleccionados = yaEsta
        ? state.planes.serviciosSeleccionados.filter((s) => s !== nombre)
        : [...state.planes.serviciosSeleccionados, nombre];
      return { planes: { ...state.planes, serviciosSeleccionados } };
    }),

  limpiarReserva: () =>
    set({
      vehiculoSeleccionado: null,
      pasoActual: "fechas",
      fechasLugar: fechasLugarInicial(),
      planes: planesInicial(),
    }),
}));