// modules/catalogo/hooks/useCatalogo.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { catalogoService } from "../services/catalogoService";
import {
    BUSQUEDA_FECHAS_BASE,
    BusquedaFechas,
    FILTROS_BASE,
    FiltrosCatalogo,
    UseCatalogoReturn,
    Vehiculo,
} from "../types/catalogo.types";

const VEHICULOS_POR_PAGINA = 6;

export function useCatalogo(): UseCatalogoReturn {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(FILTROS_BASE);
  const [busquedaFechas, setBusquedaFechasState] =
    useState<BusquedaFechas>(BUSQUEDA_FECHAS_BASE);
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial de vehículos
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const data = await catalogoService.getVehiculos();
        setVehiculos(data);
      } catch (err) {
        setError("Error al cargar el catálogo. Intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Resetea paginación cuando cambian los filtros
  const setFiltro = useCallback(
    (key: keyof FiltrosCatalogo, value: string | boolean) => {
      setFiltros((prev) => ({ ...prev, [key]: value }));
      setPaginaActual(1);
    },
    [],
  );

  const setBusquedaFechas = useCallback(
    (key: keyof BusquedaFechas, value: string) => {
      setBusquedaFechasState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFiltros = useCallback(() => {
    setFiltros(FILTROS_BASE);
    setBusquedaFechasState(BUSQUEDA_FECHAS_BASE);
    setPaginaActual(1);
  }, []);

  // Aplica todos los filtros
  const vehiculosFiltrados = useMemo(() => {
    let resultado = [...vehiculos];

    // Filtro por búsqueda de texto
    if (filtros.busqueda.trim()) {
      const busq = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(
        (v) =>
          v.nombre.toLowerCase().includes(busq) ||
          v.marca.toLowerCase().includes(busq) ||
          v.modelo.toLowerCase().includes(busq),
      );
    }

    // Filtro por categoría
    if (filtros.categoria !== "Todos") {
      resultado = resultado.filter((v) => v.categoria === filtros.categoria);
    }

    // Filtro por transmisión
    if (filtros.transmision !== "Todas") {
      resultado = resultado.filter(
        (v) => v.transmision === filtros.transmision,
      );
    }

    // Filtro por combustible
    if (filtros.combustible !== "Todos") {
      resultado = resultado.filter(
        (v) => v.combustible === filtros.combustible,
      );
    }

    // Filtro por sucursal
    if (filtros.sucursal !== "Todas") {
      resultado = resultado.filter((v) => v.sucursal === filtros.sucursal);
    }

    // Filtro por precio mínimo
    if (filtros.precioMin !== "") {
      const min = parseFloat(filtros.precioMin);
      if (!isNaN(min)) {
        resultado = resultado.filter((v) => v.precio >= min);
      }
    }

    // Filtro por precio máximo
    if (filtros.precioMax !== "") {
      const max = parseFloat(filtros.precioMax);
      if (!isNaN(max)) {
        resultado = resultado.filter((v) => v.precio <= max);
      }
    }

    // Filtro solo disponibles
    if (filtros.soloDisponibles) {
      resultado = resultado.filter((v) => v.disponible);
    }

    // Ordenamiento
    switch (filtros.orden) {
      case "precio_asc":
        resultado.sort((a, b) => a.precio - b.precio);
        break;
      case "precio_desc":
        resultado.sort((a, b) => b.precio - a.precio);
        break;
      case "nombre_asc":
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nombre_desc":
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    return resultado;
  }, [vehiculos, filtros]);

  // Paginación
  const totalPaginas = Math.max(
    1,
    Math.ceil(vehiculosFiltrados.length / VEHICULOS_POR_PAGINA),
  );

  const vehiculosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * VEHICULOS_POR_PAGINA;
    return vehiculosFiltrados.slice(inicio, inicio + VEHICULOS_POR_PAGINA);
  }, [vehiculosFiltrados, paginaActual]);

  const irPagina = useCallback(
    (pagina: number) => {
      const paginaValida = Math.max(1, Math.min(pagina, totalPaginas));
      setPaginaActual(paginaValida);
    },
    [totalPaginas],
  );

  const paginaSiguiente = useCallback(() => {
    if (paginaActual < totalPaginas) setPaginaActual((p) => p + 1);
  }, [paginaActual, totalPaginas]);

  const paginaAnterior = useCallback(() => {
    if (paginaActual > 1) setPaginaActual((p) => p - 1);
  }, [paginaActual]);

  return {
    vehiculos,
    vehiculosFiltrados,
    vehiculosPaginados,
    filtros,
    busquedaFechas,
    paginaActual,
    totalPaginas,
    cargando,
    error,
    setFiltro,
    setBusquedaFechas,
    resetFiltros,
    irPagina,
    paginaSiguiente,
    paginaAnterior,
  };
}
