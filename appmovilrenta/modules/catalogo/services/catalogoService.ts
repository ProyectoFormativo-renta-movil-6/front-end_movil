// modules/catalogo/services/catalogoService.ts

import { vehiculosMock } from "../data/vehiculos.mock";
import { Vehiculo } from "../types/catalogo.types";

// Cuando tengas el backend listo, reemplaza las funciones
// con llamadas a tu API REST usando axios

export const catalogoService = {
  /**
   * Obtiene todos los vehículos del catálogo
   * Por ahora usa mock data; luego reemplazar con:
   * const response = await axios.get('/api/vehiculos')
   * return response.data
   */
  getVehiculos: async (): Promise<Vehiculo[]> => {
    // Simula latencia de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    return vehiculosMock;
  },

  /**
   * Obtiene un vehículo por su ID
   */
  getVehiculoPorId: async (id: string): Promise<Vehiculo | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return vehiculosMock.find((v) => v.id === id) ?? null;
  },
};
