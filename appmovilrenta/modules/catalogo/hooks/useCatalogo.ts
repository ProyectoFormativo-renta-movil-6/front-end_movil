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

// Aplica los criterios del modal "Consultar Disponibilidad" sobre un array dado.
// Se extrae aparte para poder reusarla tanto en el filtrado real (useMemo)
// como en la comprobación previa de "¿esto daría 0 resultados?" en handleBuscar.
function aplicarCriteriosBusqueda(
  arr: Vehiculo[],
  form: BusquedaForm,
): Vehiculo[] {
  let out = arr;

  if (form.lugarRecogida) {
    out = out.filter(
      (v) => v.sucursal && getCiudadPorSucursal(v.sucursal) === form.lugarRecogida,
    );
  }
  if (form.lugarDevolucion) {
    out = out.filter((v) => v.sucursal === form.lugarDevolucion);
  }
  if (form.fechaInicio && form.fechaFin) {
    out = out.filter((v) =>
      estaDisponibleEnRango(v, form.fechaInicio, form.fechaFin),
    );
  }

  return out;
}

const BUSQUEDA_FORM_BASE: BusquedaForm = {
  lugarRecogida: "",
  lugarDevolucion: "",
  fechaInicio: "",
  fechaFin: "",
  mismoLugar: true,
};

export function useCatalogo() {
  const [vehiculos] = useState<Vehiculo[]>(VEHICULOS_MOCK);
  const [cargando] = useState(false);
  const [error] = useState<string | null>(null);

  // Dominio exclusivo del modal "Filtros"
  const [filtros, setFiltros] = useState<FiltrosCatalogoState>(FILTROS_BASE);

  // Dominio exclusivo del modal "Consultar Disponibilidad"
  const [busquedaForm, setBusquedaForm] = useState<BusquedaForm>(BUSQUEDA_FORM_BASE);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  // Bandera para avisarle a la UI que la última búsqueda no encontró vehículos
  // (no es un estado vacío de catálogo: el catálogo se queda mostrando todo normal)
  const [sinResultadosBusqueda, setSinResultadosBusqueda] = useState(false);

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
      "Inicia sesion o regístrate para guardar y realizar búsquedas avanzadas.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Ir a registrarse", onPress: () => {} },
      ],
    );
  };

  const handleBuscar = () => {
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

    // Comprobación previa: ¿esta búsqueda daría 0 vehículos?
    const disponibles = aplicarCriteriosBusqueda(vehiculos, busquedaForm);

    if (disponibles.length === 0) {
      // No se activa el filtro de disponibilidad -> el catálogo sigue mostrando
      // todos los vehículos normal. Solo se avisa con alerta.
      setBusquedaRealizada(false);
      setSinResultadosBusqueda(true);
      return;
    }

    setBusquedaRealizada(true);
    setPagina(1);
  };

  const cerrarAlertaSinResultados = () => {
    setSinResultadosBusqueda(false);
  };

  // Responsabilidad EXCLUSIVA de "Consultar Disponibilidad" — no toca `filtros`
  const limpiarBusqueda = () => {
    setBusquedaForm(BUSQUEDA_FORM_BASE);
    setBusquedaRealizada(false);
    setErrorBusqueda("");
    setSinResultadosBusqueda(false);
    setPagina(1);
  };

  // Responsabilidad EXCLUSIVA del modal "Filtros" — no toca `busquedaForm`
  const limpiarFiltros = () => {
    setFiltros(FILTROS_BASE);
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

    // Ciudad/sucursal elegidas en el modal "Filtros" (independientes de disponibilidad)
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

    // Ciudad/sucursal/fechas de "Consultar Disponibilidad" — dominio propio,
    // solo se aplica si el usuario efectivamente completó una búsqueda con resultados
    if (busquedaRealizada) {
      arr = aplicarCriteriosBusqueda(arr, busquedaForm);
    }

    if (filtros.orden === "precio_asc") arr.sort((a, b) => a.precio - b.precio);
    if (filtros.orden === "precio_desc") arr.sort((a, b) => b.precio - a.precio);
    if (filtros.orden === "calificacion")
      arr.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));

    return arr;
  }, [vehiculos, filtros, busquedaRealizada, busquedaForm]);

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
    sinResultadosBusqueda,
    cerrarAlertaSinResultados,
    limpiarFiltros,
    limpiarBusqueda,
    handleBuscarInvitado,
    handleBuscar,
    pagina,
    setPagina,
    totalPaginas,
    vehiculosFiltrados: resultado,
    vehiculosPaginados: vehiculosPagina,
    paginaActual: pagina,
    paginaSiguiente: () => setPagina((p) => Math.min(p + 1, totalPaginas)),
    paginaAnterior: () => setPagina((p) => Math.max(p - 1, 1)),
  };
}