import { Vehiculo } from "../types/catalogo.types";
import vehiculosMock from "../data/vehiculos.mock";

// Cuando la API esté lista, reemplaza el cuerpo de cada función por un fetch:
//   const res = await fetch(`${API_URL}/vehiculos`);
//   return res.json();
// El hook (useCatalogo) no necesita ningún cambio.

export async function getVehiculos(): Promise<Vehiculo[]> {
  return vehiculosMock;
}

export async function getVehiculoPorId(id: string): Promise<Vehiculo | undefined> {
  return vehiculosMock.find((v) => v.id === id);
}
