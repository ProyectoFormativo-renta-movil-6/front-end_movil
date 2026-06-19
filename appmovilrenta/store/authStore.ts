// store/authStore.ts

import { create } from "zustand";

export interface Usuario {
  id: string;
  correo: string;
  nombres?: string;
  apellidos?: string;
  rol: "cliente" | "administrador" | "operador" | "supervisor";
}

interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  setUsuario: (usuario: Usuario, token: string) => void;
  cerrarSesion: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  usuario: null,
  token: null,
  setUsuario: (usuario, token) => set({ usuario, token }),
  cerrarSesion: () => set({ usuario: null, token: null }),
}));
