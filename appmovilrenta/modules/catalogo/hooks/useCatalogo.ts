import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  FILTROS_BASE,
  VEHICULOS_MOCK,
  getCiudadPorSucursal,
} from "../constants/catalogo.constants";
import {
  BusquedaForm,
  FiltrosCatalogoState,
  Vehiculo,
} from "../types/catalogo.types";

// Verifica si un vehículo está libre en el rango de fechas dado,
// comparando contra sus fechas ocupadas (mock/backend)
function estaDisponibleEnRango(
  vehiculo: Vehiculo,
  fechaInicio: string,
  fechaFin: string,
): boolean {
  const ocupados = vehiculo.disponibilidad?.ocupados ?? [];
  if (ocupados.length === 0) return true;

  const inicio = new Date(fechaInicio + "T00:00:00");
  const fin = new Date(fechaFin + "T00:00:00");

  return !ocupados.some((fechaStr) => {
    const fecha = new Date(fechaStr + "T00:00:00");
    return fecha >= inicio && fecha < fin;
  });
}

export function useCatalogo() {
  const [vehiculos] = useState<Vehiculo[]>(VEHICULOS_MOCK);
  const [cargando] = useState(false);
  const [error] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosCatalogoState>(FILTROS_BASE);
  const [busquedaForm, setBusquedaForm] = useState<BusquedaForm>({
    lugarRecogida: "",
    lugarDevolucion: "",
    fechaInicio: "",
    fechaFin: "",
    mismoLugar: true,
  });
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const setFiltro = (campo: keyof FiltrosCatalogoState, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    setPagina(1);
  };

  const setForm = (campo: keyof BusquedaForm, valor: string | boolean) => {
    setBusquedaForm((prev) => ({ ...prev, [campo]: valor }));
    setErrorBusqueda("");
  };

  const handleBuscarInvitado = () => {
    Alert.alert(
      "Modo invitado",
      "Inicia sesión o regístrate para guardar y realizar búsquedas avanzadas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ir a registrarse",
          onPress: () => router.push("/(auth)/registro"),
        },
      ],
    );
  };

  const handleBuscar = () => {
    // lugarRecogida = ciudad seleccionada | lugarDevolucion = sucursal seleccionada
    if (!busquedaForm.lugarRecogida || !busquedaForm.lugarDevolucion) {
      setErrorBusqueda("Selecciona la ciudad y la sucursal");
      return;
    }
    if (!busquedaForm.fechaInicio || !busquedaForm.fechaFin) {
      setErrorBusqueda("Selecciona las fechas de recogida y devolución");
      return;
    }
    if (busquedaForm.fechaFin <= busquedaForm.fechaInicio) {
      setErrorBusqueda("La fecha de devolución debe ser posterior a la de recogida");
      return;
    }
    setErrorBusqueda("");
    setBusquedaRealizada(true);
    setPagina(1);
    router.push({
      pathname: "/(tabs)/catalogo",
      params: {
        ciudad: busquedaForm.lugarRecogida,
        sucursal: busquedaForm.lugarDevolucion,
        fechaInicio: busquedaForm.fechaInicio,
        fechaFin: busquedaForm.fechaFin,
      },
    });
  };

  const limpiar = () => {
    setFiltros(FILTROS_BASE);
    setBusquedaForm({
      lugarRecogida: "",
      lugarDevolucion: "",
      fechaInicio: "",
      fechaFin: "",
      mismoLugar: true,
    });
    setBusquedaRealizada(false);
    setErrorBusqueda("");
    setPagina(1);
  };

  const resultado = useMemo(() => {
    let arr = [...vehiculos];

    if (filtros.busqueda.trim()) {
      const busq = filtros.busqueda.toLowerCase();
      arr = arr.filter((v) => v.nombre.toLowerCase().includes(busq));
    }

    if (filtros.categoria !== "Todos")
      arr = arr.filter((v) => v.categoria === filtros.categoria);
    if (filtros.transmision !== "Todas")
      arr = arr.filter((v) => v.transmision === filtros.transmision);
    if (filtros.combustible !== "Todos")
      arr = arr.filter((v) => v.combustible === filtros.combustible);

    // CIUDAD y SUCURSAL — independientes entre sí, ambas se aplican si están activas
    if (filtros.ciudad !== "Todas las ciudades") {
      arr = arr.filter(
        (v) => v.sucursal && getCiudadPorSucursal(v.sucursal) === filtros.ciudad,
      );
    }
    if (filtros.sucursal !== "Todas las sucursales") {
      arr = arr.filter((v) => v.sucursal === filtros.sucursal);
    }

    const min = filtros.precioMin ? Number(filtros.precioMin) : null;
    const max = filtros.precioMax ? Number(filtros.precioMax) : null;
    if (min !== null) arr = arr.filter((v) => v.precio >= min);
    if (max !== null) arr = arr.filter((v) => v.precio <= max);

    // DISPONIBILIDAD POR FECHAS — solo si el usuario ya buscó con fechas concretas
    if (busquedaRealizada && busquedaForm.fechaInicio && busquedaForm.fechaFin) {
      arr = arr.filter((v) =>
        estaDisponibleEnRango(v, busquedaForm.fechaInicio, busquedaForm.fechaFin),
      );
    }

    if (filtros.orden === "precio_asc") arr.sort((a, b) => a.precio - b.precio);
    if (filtros.orden === "precio_desc")
      arr.sort((a, b) => b.precio - a.precio);
    if (filtros.orden === "calificacion")
      arr.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));

    return arr;
  }, [vehiculos, filtros, busquedaRealizada, busquedaForm.fechaInicio, busquedaForm.fechaFin]);

  const POR_PAGINA = 6;
  const totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));

  const vehiculosPagina = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return resultado.slice(inicio, inicio + POR_PAGINA);
  }, [resultado, pagina]);

  return {
    vehiculos,
    cargando,
    error,
    filtros,
    setFiltro,
    busquedaForm,
    setForm,
    busquedaRealizada,
    errorBusqueda,
    limpiar,
    handleBuscarInvitado,
    handleBuscar,
    pagina,
    setPagina,
    totalPaginas,
    vehiculosFiltrados: resultado,
    vehiculosPaginados: vehiculosPagina,
    resetFiltros: limpiar,
    paginaActual: pagina,
    paginaSiguiente: () => setPagina((p) => Math.min(p + 1, totalPaginas)),
    paginaAnterior: () => setPagina((p) => Math.max(p - 1, 1)),
  };
}