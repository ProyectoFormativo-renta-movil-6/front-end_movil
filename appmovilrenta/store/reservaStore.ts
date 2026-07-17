import { create } from "zustand";
import { Vehiculo } from "@/modules/catalogo/types/catalogo.types";
import { DatosFechasLugar, PasoReserva } from "@/modules/reserva/types/reserva.types";

interface ReservaStore {
  vehiculoSeleccionado: Vehiculo | null;
  pasoActual: PasoReserva;
  fechasLugar: DatosFechasLugar;

  seleccionarVehiculo: (
    vehiculo: Vehiculo,
    datosPrecarga?: Partial<Pick<DatosFechasLugar, "lugarRetiro" | "fechaRetiro" | "fechaDevolucion">>
  ) => void;
  setPaso: (paso: PasoReserva) => void;
  actualizarFechasLugar: (data: Partial<DatosFechasLugar>) => void;
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
  };
}

export const useReservaStore = create<ReservaStore>()((set) => ({
  vehiculoSeleccionado: null,
  pasoActual: "fechas",
  fechasLugar: fechasLugarInicial(),

  // datosPrecarga viene de una búsqueda previa en "Consultar disponibilidad"
  // (BuscadorCatalogo). Si el usuario no buscó nada, llega undefined y el
  // spread no cambia nada — arranca igual que siempre.
  seleccionarVehiculo: (vehiculo, datosPrecarga) =>
    set({
      vehiculoSeleccionado: vehiculo,
      pasoActual: "fechas",
      fechasLugar: { ...fechasLugarInicial(vehiculo), ...datosPrecarga },
    }),

  setPaso: (paso) => set({ pasoActual: paso }),

  actualizarFechasLugar: (data) =>
    set((state) => ({ fechasLugar: { ...state.fechasLugar, ...data } })),

  limpiarReserva: () =>
    set({
      vehiculoSeleccionado: null,
      pasoActual: "fechas",
      fechasLugar: fechasLugarInicial(),
    }),
}));