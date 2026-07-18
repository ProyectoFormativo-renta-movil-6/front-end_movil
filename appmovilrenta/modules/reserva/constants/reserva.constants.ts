// modules/reserva/constants/reserva.constants.ts
import nacionalidadesData from "@/mocks/nacionalidades.json";
import {
  COLORES,
  COLOR_MARCA,
} from "@/modules/catalogo/constants/catalogo.constants";
import { TipoDocumento } from "@/modules/perfil/types/perfil.types";

// Reutilizamos la paleta del catálogo, sin duplicar valores
export { COLORES, COLOR_MARCA };

// Placeholders de negocio — reemplazar cuando haya reglas reales de precios
export const PROTECCION_OBLIGATORIA_DIA = 29000;
export const PORCENTAJE_CARGOS_ADMINISTRATIVOS = 0.1;
export const RECARGO_LOGISTICO = 0;
export const PORCENTAJE_IVA = 0.19;

// Valor cobrado por cada kilómetro que supere el límite pactado en el
// plan de kilometraje limitado. Se usa tanto en la tarjeta de Planes
// como en el texto de Términos y Condiciones, para no repetir el
// número quemado en dos lugares distintos.
export const VALOR_KM_EXCEDENTE = 1500;

export const HORAS_DISPONIBLES = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
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
    {
      tipo: "check",
      texto: "Asistencia durante tu viaje. No incluida en Alquiler Ligero",
    },
    {
      tipo: "check",
      texto: "Responsabilidad civil extracontractual (hasta $840 millones)",
    },
    {
      tipo: "check",
      texto: "Cobertura básica del vehículo (no incluye daños graves ni robo)",
    },
    {
      tipo: "warning",
      texto:
        "En caso de siniestro asumes una participación obligatoria de hasta $4.760.000, según el vehículo",
    },
    { tipo: "cross", texto: "No cubre uso indebido del vehículo" },
  ],
  "Protección Total": [
    { tipo: "check", texto: "Asistencia completa durante tu viaje" },
    {
      tipo: "check",
      texto: "Responsabilidad civil extracontractual (hasta $840 millones)",
    },
    {
      tipo: "check",
      texto: "Cobertura total del vehículo (incluye daños graves y robo)",
    },
    {
      tipo: "check",
      texto: "Sin pago de la participación obligatoria en caso de siniestro",
    },
    { tipo: "cross", texto: "No cubre uso indebido del vehículo" },
  ],
};

// Beneficios/condiciones mostrados en cada tarjeta de tipo de
// kilometraje, mismo patrón que BENEFICIOS_PROTECCION. Se relacionan
// por la clave "limitado" / "ilimitado", que coincide con
// planes.tipoKilometraje en el store.
export const BENEFICIOS_KILOMETRAJE: Record<
  "limitado" | "ilimitado",
  BeneficioProteccion[]
> = {
  limitado: [
    {
      tipo: "check",
      texto: "Incluye un tope de kilómetros por día, según el vehículo elegido",
    },
    {
      tipo: "warning",
      texto:
        "Cada kilómetro adicional al tope se cobra aparte, al valor de excedente",
    },
    {
      tipo: "cross",
      texto: "No recomendado para trayectos largos o interdepartamentales",
    },
  ],
  ilimitado: [
    {
      tipo: "check",
      texto: "Sin restricción de distancia dentro del territorio nacional",
    },
    {
      tipo: "check",
      texto: "Ideal para viajes largos, interdepartamentales o de varios días",
    },
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

// ===================== TAB "DATOS PERSONALES" =====================

// ⚠️ CAMBIO: se unificó al tipo de Perfil (CC | TI | Doc. Extranjero |
// Pasaporte). El id ahora tipa contra TipoDocumento (importado de
// perfil.types.ts) en vez de ser un literal local — así el compilador
// avisa si algún día los enums se vuelven a desalinear.
export const TIPOS_DOCUMENTO: { id: TipoDocumento; label: string }[] = [
  { id: "CC", label: "Cédula de ciudadanía" },
  { id: "TI", label: "Tarjeta de identidad" },
  { id: "Doc. Extranjero", label: "Documento de extranjería" },
  { id: "Pasaporte", label: "Pasaporte" },
];

// Estructura de cada nacionalidad: nombre visible + código de
// marcación telefónica. Sale de mocks/nacionalidades.json — simula lo
// que después va a devolver el backend, así que cuando exista ese
// endpoint solo se reemplaza esta línea de import.
export interface NacionalidadOpcion {
  nombre: string;
  prefijo: string; // ej: "+57". Vacío ("") para "Otro" — no hay país fijo.
}

export const NACIONALIDADES: NacionalidadOpcion[] = nacionalidadesData;

// Busca el prefijo telefónico según el nombre de nacionalidad elegido
// en el formulario. Devuelve "" (vacío) si todavía no se ha elegido
// nacionalidad, o si es "Otro" — en ese caso no se asume ningún país,
// el prefijo se muestra vacío/placeholder hasta que el usuario elija.
export function getPrefijoPorNacionalidad(nacionalidad: string | null): string {
  if (!nacionalidad) return "";
  const encontrada = NACIONALIDADES.find((n) => n.nombre === nacionalidad);
  return encontrada?.prefijo ?? "";
}

// Tipos de archivo aceptados por el selector de documentos
export const TIPOS_ARCHIVO_DOCUMENTO = ["application/pdf", "image/*"];

// Tamaño máximo permitido por archivo (5 MB)
export const TAMANO_MAXIMO_ARCHIVO_BYTES = 5 * 1024 * 1024;

// ===================== TÉRMINOS Y CONDICIONES =====================

export interface PuntoPolitica {
  titulo: string;
  items: string[];
}

// Contenido completo del panel de "Políticas importantes" que se
// despliega en la tarjeta de Términos y Condiciones (tab Datos
// personales). Vive aquí, no dentro del componente, para seguir el
// mismo patrón que BENEFICIOS_PROTECCION / INFO_KILOMETRAJE_COLOMBIA:
// contenido de negocio separado de la UI que lo renderiza.
export const RESUMEN_POLITICAS_IMPORTANTES =
  "Drivique NO realiza devoluciones de dinero bajo ninguna circunstancia una vez confirmada la reserva.";

export const PUNTOS_POLITICA: PuntoPolitica[] = [
  {
    titulo: "1. DURACIÓN DEL CONTRATO",
    items: [
      "La duración de la renta será la indicada en la reserva, desde la fecha y hora de inicio hasta la fecha y hora de finalizar.",
    ],
  },
  {
    titulo: "2. PAGOS Y TARIFAS",
    items: [
      "El precio incluye la renta del vehículo, impuestos y cargos administrativos.",
      "Se requiere un pago total o parcial al momento de confirmar la reserva.",
    ],
  },
  {
    titulo: "3. KILOMETRAJE",
    items: [
      `Opción limitado: Incluye km por día. Si se supera el límite, se cobrará un adicional por cada kilómetro extra ($${VALOR_KM_EXCEDENTE.toLocaleString("es-CO")} COP/km).`,
      "Opción ilimitado: No hay límite de kilómetros durante el periodo de renta.",
    ],
  },
  {
    titulo: "4. EXCESO DE KILOMETRAJE (solo para opción limitado)",
    items: [
      `Se cobrará un valor por kilómetro adicional ($${VALOR_KM_EXCEDENTE.toLocaleString("es-CO")} COP/km) por cada km que supere el límite pactado.`,
      "El exceso se calcula al momento de la devolución del vehículo.",
    ],
  },
  {
    titulo: "5. CANCELACIONES Y REEMBOLSOS",
    items: [
      "Drivique NO realiza devoluciones del dinero bajo ninguna circunstancia una vez confirmada la reserva.",
      "No se aplican reembolsos por cancelaciones, cambios de planes, no presentación ni por ningún otro motivo.",
    ],
  },
  {
    titulo: "6. DOCUMENTACIÓN REQUERIDA",
    items: [
      // ⚠️ CAMBIO: se actualizó la lista de documentos aceptados para
      // reflejar el nuevo enum (antes decía "CC, CE o Pasaporte").
      "El usuario debe presentar documento de identidad válido (CC, TI, Documento de extranjería o Pasaporte).",
      "Debe cumplir con los requisitos de edad y licencia de conducción según normativa vigente.",
    ],
  },
  {
    titulo: "7. USO DEL VEHÍCULO",
    items: [
      "El vehículo debe ser usado únicamente en territorio colombiano.",
      "No se permite subarriendo, uso comercial no autorizado, ni transporte de carga prohibida.",
    ],
  },
  {
    titulo: "8. DAÑOS Y RESPONSABILIDAD",
    items: [
      "El usuario es responsable por daños causados al vehículo durante el periodo de renta, excepto los cubiertos por el seguro contratado.",
      "En caso de accidente, se deberá notificar inmediatamente a Drivique y a las autoridades correspondientes.",
    ],
  },
  {
    titulo: "9. MODIFICACIONES AL CONTRATO",
    items: [
      "Cualquier cambio en fechas, horas, sucursal o tipo de kilometraje debe ser acordado previamente con Drivique.",
      "Los cambios pueden implicar ajustes en el precio total.",
    ],
  },
  {
    titulo: "10. LEGISLACIÓN APLICABLE",
    items: ["Este contrato se rige por las leyes de la República de Colombia."],
  },
];
