// store/auditStore.ts
//
// Registro de auditoría de la navegación en modo invitado (RF: "La
// navegación del visitante queda registrada en auditoría"). Sigue el
// mismo patrón de los demás stores: zustand + persist en AsyncStorage.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface EventoAuditoria {
  tipo: string;
  detalle?: string;
  fecha: string;
}

interface AuditStore {
  eventos: EventoAuditoria[];
  registrarEvento: (tipo: string, detalle?: string) => void;
}

// Cuántos eventos se conservan como máximo antes de descartar los más
// viejos — esto es un registro local de demo, no un backend de verdad.
const MAX_EVENTOS = 200;

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      eventos: [],
      registrarEvento: (tipo, detalle) =>
        set((state) => ({
          eventos: [
            { tipo, detalle, fecha: new Date().toISOString() },
            ...state.eventos,
          ].slice(0, MAX_EVENTOS),
        })),
    }),
    {
      name: "auditoria-invitado-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useAuditoria() {
  const registrarEvento = useAuditStore((s) => s.registrarEvento);
  return { registrarEvento };
}
