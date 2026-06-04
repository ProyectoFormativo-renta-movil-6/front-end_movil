/**
 * RF10 — Catálogo de vehículos
 * RF10.1: Listar vehículos registrados
 * RF10.2: Filtrar por marca
 * RF10.3: Filtrar por disponibilidad
 * RF10.5: Vista según rol
 * RF10.6: Mensajes de visualización
 */

import { useEffect, useMemo, useState } from "react";
import { FiltrosCatalogo, Vehiculo } from "../types/catalogo.types";
import { getVehiculos } from "../services/catalogoService";

const FILTROS_INICIALES: FiltrosCatalogo = {
  categoria: "Todas",
  busqueda: "",
  soloDisponibles: false,
};

export function useCatalogo() {
  const [todosLosVehiculos, setTodosLosVehiculos] = useState<Vehiculo[]>([]);
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(FILTROS_INICIALES);

  useEffect(() => {
    getVehiculos().then(setTodosLosVehiculos);
  }, []);

  const vehiculos = useMemo(() => {
    return todosLosVehiculos.filter((v) => {
      if (filtros.categoria !== "Todas" && v.categoria !== filtros.categoria)
        return false;
      if (filtros.soloDisponibles && v.estado !== "disponible") return false;
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase();
        if (
          !`${v.marca} ${v.modelo} ${v.categoria} ${v.sucursal}`
            .toLowerCase()
            .includes(q)
        )
          return false;
      }
      return true;
    });
  }, [filtros, todosLosVehiculos]);

  const actualizarFiltro = <K extends keyof FiltrosCatalogo>(
    clave: K,
    valor: FiltrosCatalogo[K],
  ) => setFiltros((prev) => ({ ...prev, [clave]: valor }));

  const resetFiltros = () => setFiltros(FILTROS_INICIALES);

  return {
    vehiculos,
    totalVehiculos: todosLosVehiculos.length,
    filtros,
    actualizarFiltro,
    resetFiltros,
  };
}
