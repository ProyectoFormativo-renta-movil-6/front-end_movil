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