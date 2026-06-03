import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    FiltrosInvitado,
    VehiculoInvitado,
    VentajaRegistro,
} from "../types/invitado.types";

const VEHICULOS_MOCK: VehiculoInvitado[] = [
  {
    id: "1",
    marca: "Toyota",
    modelo: "RAV4",
    anio: 2023,
    categoria: "SUV",
    precioDia: 180000,
    capacidad: 5,
    transmision: "automatica",
    combustible: "gasolina",
    estado: "disponible",
    sucursal: "Neiva Centro",
    calificacion: 4.8,
    totalCalificaciones: 124,
    imagen: require("@/assets/images/vehiculos/ToyotaRav4.png"),
    kilometraje: "ilimitado",
    descripcion: "SUV espaciosa ideal para viajes largos y familia.",
    serviciosIncluidos: ["serv_soat", "serv_gps", "serv_aire"],
  },
  {
    id: "2",
    marca: "Chevrolet",
    modelo: "Spark",
    anio: 2022,
    categoria: "Económico",
    precioDia: 85000,
    capacidad: 4,
    transmision: "manual",
    combustible: "gasolina",
    estado: "disponible",
    sucursal: "Neiva Norte",
    calificacion: 4.5,
    totalCalificaciones: 89,
    imagen: require("@/assets/images/vehiculos/chevroletspark.png"),
    kilometraje: "limitado",
    descripcion: "Perfecto para ciudad, bajo consumo de combustible.",
    serviciosIncluidos: ["serv_soat", "serv_aire"],
  },
  {
    id: "3",
    marca: "Mazda",
    modelo: "CX-5",
    anio: 2023,
    categoria: "SUV",
    precioDia: 210000,
    capacidad: 5,
    transmision: "automatica",
    combustible: "gasolina",
    estado: "disponible",
    sucursal: "Neiva Centro",
    calificacion: 4.9,
    totalCalificaciones: 203,
    imagen: require("@/assets/images/vehiculos/camionetamazda.png"),
    kilometraje: "ilimitado",
    descripcion: "SUV premium con tecnología de punta.",
    serviciosIncluidos: ["serv_soat", "serv_gps", "serv_seguroRiesgo"],
  },
  {
    id: "4",
    marca: "Renault",
    modelo: "Logan",
    anio: 2021,
    categoria: "Económico",
    precioDia: 75000,
    capacidad: 5,
    transmision: "manual",
    combustible: "gasolina",
    estado: "reservado",
    sucursal: "Neiva Sur",
    calificacion: 4.2,
    totalCalificaciones: 56,
    imagen: require("@/assets/images/vehiculos/RenaultLogan.png"),
    kilometraje: "limitado",
    descripcion: "Sedán económico cómodo para uso diario.",
    serviciosIncluidos: ["serv_soat"],
  },
  {
    id: "5",
    marca: "Mercedes-Benz",
    modelo: "GLE 350",
    anio: 2023,
    categoria: "Premium",
    precioDia: 450000,
    capacidad: 5,
    transmision: "automatica",
    combustible: "diesel",
    estado: "disponible",
    sucursal: "Neiva Centro",
    calificacion: 5.0,
    totalCalificaciones: 42,
    imagen: require("@/assets/images/vehiculos/MercedesBenzsGle.png"),
    kilometraje: "ilimitado",
    descripcion: "Experiencia de lujo en cada kilómetro.",
    serviciosIncluidos: [
      "serv_soat",
      "serv_gps",
      "serv_seguroRiesgo",
      "serv_chofer",
    ],
  },
  {
    id: "6",
    marca: "Hyundai",
    modelo: "Tucson",
    anio: 2022,
    categoria: "SUV",
    precioDia: 165000,
    capacidad: 5,
    transmision: "automatica",
    combustible: "hibrido",
    estado: "disponible",
    sucursal: "Neiva Norte",
    calificacion: 4.7,
    totalCalificaciones: 118,
    imagen: require("@/assets/images/vehiculos/Hyundai.png"),
    kilometraje: "ilimitado",
    descripcion: "Híbrido eficiente con gran confort.",
    serviciosIncluidos: ["serv_soat", "serv_gps"],
  },
  {
    id: "7",
    marca: "Volkswagen",
    modelo: "Transporter",
    anio: 2022,
    categoria: "Van",
    precioDia: 220000,
    capacidad: 9,
    transmision: "manual",
    combustible: "diesel",
    estado: "disponible",
    sucursal: "Neiva Sur",
    calificacion: 4.6,
    totalCalificaciones: 31,
    imagen: require("@/assets/images/vehiculos/Volkswagen.png"),
    kilometraje: "limitado",
    descripcion: "Ideal para grupos y viajes corporativos.",
    serviciosIncluidos: ["serv_soat", "serv_seguroPasajeros"],
  },
  {
    id: "8",
    marca: "Kia",
    modelo: "Stinger",
    anio: 2023,
    categoria: "Sedán",
    precioDia: 195000,
    capacidad: 5,
    transmision: "automatica",
    combustible: "gasolina",
    estado: "mantenimiento",
    sucursal: "Neiva Centro",
    calificacion: 4.8,
    totalCalificaciones: 67,
    imagen: require("@/assets/images/vehiculos/kiastinger.png"),
    kilometraje: "ilimitado",
    descripcion: "Sedán deportivo con motor de alto rendimiento.",
    serviciosIncluidos: ["serv_soat", "serv_gps", "serv_seguroRiesgo"],
  },
];

export const VENTAJAS_REGISTRO: VentajaRegistro[] = [
  {
    icon: "📅",
    titulo: "Reservas instantáneas",
    descripcion: "Reserva tu vehículo en segundos desde tu celular.",
  },
  {
    icon: "💳",
    titulo: "Pagos seguros",
    descripcion: "PSE, Nequi y tarjeta con cifrado SSL.",
  },
  {
    icon: "📄",
    titulo: "Contrato digital",
    descripcion: "Recibe tu contrato en PDF al instante.",
  },
  {
    icon: "🔔",
    titulo: "Notificaciones",
    descripcion: "Seguimiento en tiempo real de tu reserva.",
  },
];

const FILTROS_INICIALES: FiltrosInvitado = {
  categoria: "Todos",
  busqueda: "",
  soloDisponibles: false,
};

export function useInvitado() {
  const [filtros, setFiltros] = useState<FiltrosInvitado>(FILTROS_INICIALES);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] =
    useState<VehiculoInvitado | null>(null);
  const [mostrarBannerReserva, setMostrarBannerReserva] = useState(false);

  const vehiculos = useMemo(() => {
    return VEHICULOS_MOCK.filter((v) => {
      if (filtros.categoria !== "Todos" && v.categoria !== filtros.categoria)
        return false;
      if (filtros.soloDisponibles && v.estado !== "disponible") return false;
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase();
        if (!`${v.marca} ${v.modelo}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filtros]);

  const actualizarFiltro = <K extends keyof FiltrosInvitado>(
    clave: K,
    valor: FiltrosInvitado[K],
  ) => setFiltros((prev) => ({ ...prev, [clave]: valor }));

  const resetFiltros = () => setFiltros(FILTROS_INICIALES);

  const intentarReservar = () => {
    console.log(
      "[AUDITORIA] Invitado intentó acceder a reserva:",
      new Date().toISOString(),
    );
    setMostrarBannerReserva(true);
  };

  const irARegistro = () => {
    setMostrarBannerReserva(false);
    router.push("/(auth)/registro");
  };

  const irALogin = () => {
    setMostrarBannerReserva(false);
    router.push("/(auth)/login");
  };

  const cerrarBanner = () => setMostrarBannerReserva(false);

  return {
    vehiculos,
    totalVehiculos: VEHICULOS_MOCK.length,
    filtros,
    actualizarFiltro,
    resetFiltros,
    vehiculoSeleccionado,
    setVehiculoSeleccionado,
    mostrarBannerReserva,
    intentarReservar,
    irARegistro,
    irALogin,
    cerrarBanner,
  };
}
