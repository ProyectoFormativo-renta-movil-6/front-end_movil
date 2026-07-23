// modules/reserva/services/reservaPersistService.ts
//
// Servicio temporal para simular el almacenamiento de reservas en el
// dispositivo (AsyncStorage), igual que la web lo hace con localStorage
// (src/services/reservaService.js). Esto debería migrarse a un backend.
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "drivique_reservas";

// Tiempo que tiene el usuario para acercarse a la sucursal a pagar en
// efectivo antes de que la reserva se cancele automáticamente.
export const HORAS_LIMITE_PAGO_EFECTIVO = 4;

export type EstadoReserva =
  | "PENDIENTE"
  | "PENDIENTE_EFECTIVO"
  | "PENDIENTE_VALIDACION"
  | "CONFIRMADA"
  | "CANCELADA"
  | "CANCELADA_POR_TIEMPO";

export interface ReservaGuardada {
  referencia: string;
  vehiculoId: number | string;
  vehiculoNombre: string;
  estado: EstadoReserva;
  fechaReserva: string;
  metodoPago: "wompi" | "efectivo" | null;
  total: number;
  fechaLimitePago?: string | null;
  horasLimitePago?: number | null;
  paymentId?: string | null;
  [extra: string]: unknown;
}

function calcularFechaLimitePago(): string {
  return new Date(
    Date.now() + HORAS_LIMITE_PAGO_EFECTIVO * 60 * 60 * 1000
  ).toISOString();
}

/**
 * Cancela automáticamente (en el estado local) las reservas que quedaron en
 * PENDIENTE_EFECTIVO cuyo plazo de pago ya venció sin haberse confirmado.
 */
function vencerReservasEfectivo(reservas: ReservaGuardada[]): {
  actualizadas: ReservaGuardada[];
  cambiaron: boolean;
} {
  const ahora = Date.now();
  let cambiaron = false;

  const actualizadas = reservas.map((r) => {
    if (
      r.estado === "PENDIENTE_EFECTIVO" &&
      r.fechaLimitePago &&
      new Date(r.fechaLimitePago).getTime() < ahora
    ) {
      cambiaron = true;
      return { ...r, estado: "CANCELADA_POR_TIEMPO" as EstadoReserva };
    }
    return r;
  });

  return { actualizadas, cambiaron };
}

async function leer(): Promise<ReservaGuardada[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const reservas: ReservaGuardada[] = data ? JSON.parse(data) : [];
    const { actualizadas, cambiaron } = vencerReservasEfectivo(reservas);
    if (cambiaron) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    }
    return actualizadas;
  } catch (error) {
    console.error("[reservaPersistService] Error leyendo reservas", error);
    return [];
  }
}

export const reservaPersistService = {
  getReservas: leer,

  /**
   * Guarda una reserva nueva. Si el método de pago es "efectivo", calcula y
   * asigna automáticamente el plazo límite para pagar en sucursal
   * (fechaLimitePago) y deja el estado en PENDIENTE_EFECTIVO.
   */
  guardarReserva: async (
    reserva: Omit<ReservaGuardada, "estado"> & { estado?: EstadoReserva }
  ): Promise<ReservaGuardada> => {
    const reservas = await leer();

    const esEfectivo = reserva.metodoPago === "efectivo";
    const reservaFinal: ReservaGuardada = esEfectivo
      ? {
          ...reserva,
          estado: "PENDIENTE_EFECTIVO",
          fechaLimitePago: calcularFechaLimitePago(),
          horasLimitePago: HORAS_LIMITE_PAGO_EFECTIVO,
        }
      : { ...reserva, estado: reserva.estado ?? "PENDIENTE" };

    reservas.push(reservaFinal);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    return reservaFinal;
  },

  obtenerPorReferencia: async (
    referencia: string
  ): Promise<ReservaGuardada | undefined> => {
    const reservas = await leer();
    return reservas.find((r) => r.referencia === referencia);
  },

  actualizarEstado: async (
    referencia: string,
    nuevoEstado: EstadoReserva,
    paymentId?: string | null
  ): Promise<boolean> => {
    const reservas = await leer();
    const index = reservas.findIndex((r) => r.referencia === referencia);
    if (index !== -1) {
      reservas[index].estado = nuevoEstado;
      if (paymentId) reservas[index].paymentId = paymentId;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      return true;
    }
    return false;
  },

  cancelarReserva: async (referencia: string): Promise<boolean> => {
    return reservaPersistService.actualizarEstado(referencia, "CANCELADA");
  },
};
