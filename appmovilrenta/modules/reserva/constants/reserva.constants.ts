import { COLORES, COLOR_MARCA } from "@/modules/catalogo/constants/catalogo.constants";

// Reutilizamos la paleta del catálogo, sin duplicar valores
export { COLORES, COLOR_MARCA };

// Placeholders de negocio — reemplazar cuando haya reglas reales de precios
export const PROTECCION_OBLIGATORIA_DIA = 29000;
export const PORCENTAJE_CARGOS_ADMINISTRATIVOS = 0.10;
export const RECARGO_LOGISTICO = 0;
export const PORCENTAJE_IVA = 0.19;

export const HORAS_DISPONIBLES = [
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00",
];

export const METODOS_PAGO = [
  {
    id: "wompi" as const,
    titulo: "Pago virtual con Wompi",
    descripcion: "Habilita entregas a domicilio, aeropuerto o terminal.",
  },
  {
    id: "efectivo" as const,
    titulo: "Pago en efectivo",
    descripcion: "Obligatorio retirar y pagar directamente en sucursal.",
  },
];

// FUNCIÓN: formatHoraAmPm
// Convierte una hora en formato 24h (ej: "14:00") a texto legible con
// a. m. / p. m. (ej: "2:00 p. m."). El valor guardado sigue siendo 24h;
// esto solo cambia cómo se MUESTRA la hora al usuario.
export function formatHoraAmPm(hora24: string): string {
  const [hStr, m] = hora24.split(":");
  let h = parseInt(hStr, 10);
  const sufijo = h >= 12 ? "p. m." : "a. m.";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${sufijo}`;
}

// ===================== TAB "PLANES" =====================

// Texto informativo sobre cómo se maneja el kilometraje en el alquiler
// de carros por días en Colombia. Es la práctica habitual del sector,
// no una norma legal específica.
export const INFO_KILOMETRAJE_COLOMBIA =
  "En Colombia la mayoría de las alquiladoras ofrecen dos modalidades: kilometraje limitado, con un tope de kilómetros por día y un cobro adicional por cada kilómetro que te pases, o kilometraje ilimitado, sin restricción de distancia dentro del territorio nacional. Ninguna de las dos modalidades incluye combustible, peajes ni parqueaderos.";

export interface BeneficioProteccion {
  tipo: "check" | "warning" | "cross";
  texto: string;
}

// Beneficios mostrados en cada tarjeta de protección. Se relacionan por
// el campo "nombre" que ya viene en vehiculo.seguros. Si aparece un
// seguro con un nombre nuevo que no está aquí, simplemente no muestra
// la lista de beneficios (pero sí el precio y el botón de selección).
export const BENEFICIOS_PROTECCION: Record<string, BeneficioProteccion[]> = {
  "Protección Obligatoria": [
    { tipo: "check", texto: "Asistencia durante tu viaje. No incluida en Alquiler Ligero" },
    { tipo: "check", texto: "Responsabilidad civil extracontractual (hasta $840 millones)" },
    { tipo: "check", texto: "Cobertura básica del vehículo (no incluye daños graves ni robo)" },
    { tipo: "warning", texto: "En caso de siniestro asumes una participación obligatoria de hasta $4.760.000, según el vehículo" },
    { tipo: "cross", texto: "No cubre uso indebido del vehículo" },
  ],
  "Protección Total": [
    { tipo: "check", texto: "Asistencia completa durante tu viaje" },
    { tipo: "check", texto: "Responsabilidad civil extracontractual (hasta $840 millones)" },
    { tipo: "check", texto: "Cobertura total del vehículo (incluye daños graves y robo)" },
    { tipo: "check", texto: "Sin pago de la participación obligatoria en caso de siniestro" },
    { tipo: "cross", texto: "No cubre uso indebido del vehículo" },
  ],
};

// Beneficios/condiciones mostrados en cada tarjeta de tipo de
// kilometraje, mismo patrón que BENEFICIOS_PROTECCION. Se relacionan
// por la clave "limitado" / "ilimitado", que coincide con
// planes.tipoKilometraje en el store.
export const BENEFICIOS_KILOMETRAJE: Record<"limitado" | "ilimitado", BeneficioProteccion[]> = {
  limitado: [
    { tipo: "check", texto: "Incluye un tope de kilómetros por día, según el vehículo elegido" },
    { tipo: "warning", texto: "Cada kilómetro adicional al tope se cobra aparte, al valor de excedente" },
    { tipo: "cross", texto: "No recomendado para trayectos largos o interdepartamentales" },
  ],
  ilimitado: [
    { tipo: "check", texto: "Sin restricción de distancia dentro del territorio nacional" },
    { tipo: "check", texto: "Ideal para viajes largos, interdepartamentales o de varios días" },
    { tipo: "cross", texto: "No incluye combustible, peajes ni parqueaderos" },
  ],
};

// Ícono por servicio adicional (coincide exactamente con los nombres
// usados en vehiculos.json). Si aparece un servicio nuevo que no está
// en este mapa, se usa el ícono por defecto.
export const ICONO_SERVICIO_DEFECTO = "add-circle-outline";
export const ICONOS_SERVICIOS: Record<string, string> = {
  GPS: "navigate-outline",
  "Silla bebé": "body-outline",
  "Conductor adicional": "person-add-outline",
  "Entrega en otra ciudad": "map-outline",
  "WiFi portátil": "wifi-outline",
};