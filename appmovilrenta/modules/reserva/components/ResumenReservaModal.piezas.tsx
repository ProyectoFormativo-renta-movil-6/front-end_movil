// modules/reserva/components/ResumenReservaModal.piezas.tsx
//
// Piezas reutilizables + helpers usados por las 4 tarjetas editables
// del modal de resumen (Pago, Fechas, Planes, Datos personales).
// Se separan aquí para no tener un solo archivo gigante.

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  COLOR_MARCA,
  COLORES,
  ICONOS_SERVICIOS,
  ICONO_SERVICIO_DEFECTO,
} from "../constants/reserva.constants";
import { GRADIENTES } from "@/constants/gradients";
import { useMonedaStore } from "@/store/monedaStore";
import { formatCurrency } from "@/utils/monedaUtils";

// ---------- Helpers de formato ----------

// Los montos siempre llegan en COP; fmt los muestra según la moneda
// activa (COP o USD) leída del store en el momento de la llamada.
export const fmt = (n: number) => {
  const { monedaActual, tasaUSD } = useMonedaStore.getState();
  return formatCurrency(n, monedaActual, tasaUSD);
};
export const fmtPct = (n: number) => `${Math.round(n * 100)}%`;

export const fechaCorta = (f: string | null) =>
  f
    ? new Date(f + "T00:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
    : "";

export const fechaHora = (f: string | null, h: string, formatHoraAmPm: (h: string) => string) =>
  [fechaCorta(f), h ? formatHoraAmPm(h) : ""].filter(Boolean).join(" · ") || "Seleccionar";

export const diasEntre = (a: string | null, b: string | null) =>
  a && b
    ? Math.max(
        Math.round((new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86400000),
        1
      )
    : 0;

// ---------- Piezas visuales ----------

// Encabezado de cada tarjeta en modo "resumen": ícono + título + botón Editar.
export function SubcardHeader({
  icono,
  titulo,
  onEditar,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  onEditar: () => void;
}) {
  return (
    <View style={styles.subcardHeader}>
      <View style={styles.rowGap}>
        <Ionicons name={icono} size={14} color={COLOR_MARCA} />
        <Text style={styles.subcardTitulo}>{titulo}</Text>
      </View>
      <TouchableOpacity style={styles.editarBtn} onPress={onEditar} hitSlop={8}>
        <Ionicons name="pencil" size={11} color={COLOR_MARCA} />
        <Text style={styles.editarLink}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Encabezado de cada tarjeta en modo "editando" (sin botón Editar,
// porque ya estás editando).
export function SubcardHeaderEditando({
  icono,
  titulo,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
}) {
  return (
    <View style={styles.rowGap}>
      <Ionicons name={icono} size={14} color={COLOR_MARCA} />
      <Text style={styles.subcardTitulo}>{titulo}</Text>
    </View>
  );
}

// Una fila de dato de solo lectura: ícono + label chico + valor grande.
export function FilaDato({
  icono,
  label,
  valor,
  ultima,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  label: string;
  valor: string;
  ultima?: boolean;
}) {
  return (
    <>
      <View style={styles.filaDato}>
        <Ionicons name={icono} size={15} color={COLORES.textMuted} />
        <View style={{ flex: 1 }}>
          <Text style={styles.filaDatoLabel}>{label}</Text>
          <Text style={styles.filaDatoValor} numberOfLines={1}>{valor}</Text>
        </View>
      </View>
      {!ultima && <View style={styles.divisor} />}
    </>
  );
}

// Tarjeta seleccionable tipo radio (protección, kilometraje).
export function OpcionCard({
  titulo,
  desc,
  activo,
  onPress,
}: {
  titulo: string;
  desc: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.opcionCard, activo && styles.opcionCardActiva]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.opcionHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.opcionTitulo, activo && styles.opcionTituloActiva]}>{titulo}</Text>
          <Text style={[styles.opcionDesc, activo && styles.opcionDescActiva]}>{desc}</Text>
        </View>
        <View style={[styles.radio, activo && styles.radioActivo]}>{activo && <View style={styles.radioPunto} />}</View>
      </View>
    </TouchableOpacity>
  );
}

// Fila de servicio adicional (checkbox + ícono + nombre + precio).
export function ServicioRow({
  nombre,
  precio,
  activo,
  onPress,
}: {
  nombre: string;
  precio: number;
  activo: boolean;
  onPress: () => void;
}) {
  // Nos suscribimos al store de moneda para re-renderizar el precio
  // cuando cambie COP↔USD o llegue una tasa nueva.
  useMonedaStore();
  const icono = ICONOS_SERVICIOS[nombre] ?? ICONO_SERVICIO_DEFECTO;
  return (
    <TouchableOpacity style={[styles.servicioCard, activo && styles.opcionCardActiva]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={activo ? "checkbox" : "square-outline"} size={18} color={activo ? COLOR_MARCA : COLORES.textMuted} />
      <Ionicons name={icono as any} size={14} color={activo ? COLOR_MARCA : COLORES.textMuted} style={{ marginHorizontal: 8 }} />
      <Text style={[styles.servicioNombre, activo && styles.opcionTituloActiva]} numberOfLines={2}>{nombre}</Text>
      {precio > 0 && <Text style={styles.servicioPrecio}>{fmt(precio)}/día</Text>}
    </TouchableOpacity>
  );
}

// Línea del desglose de precio (label a la izquierda, valor a la derecha).
export function LineaPrecio({ label, valor, destacado }: { label: string; valor: string; destacado?: boolean }) {
  return (
    <View style={styles.lineaPrecio}>
      <Text style={[styles.lineaLabel, destacado && styles.lineaLabelDestacado]}>{label}</Text>
      <Text style={[styles.lineaValor, destacado && styles.lineaValorDestacado]}>{valor}</Text>
    </View>
  );
}

// Par de botones Volver/Actualizar — usado por las 4 tarjetas editables
// para que el patrón sea idéntico en todas.
export function FilaBotonesEdicion({ onVolver, onActualizar }: { onVolver: () => void; onActualizar: () => void }) {
  return (
    <View style={styles.filaBotones}>
      <TouchableOpacity style={styles.volverBtn} onPress={onVolver}><Text style={styles.volverBtnText}>Volver</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actualizarBtnWrap} onPress={onActualizar} activeOpacity={0.85}>
        <LinearGradient
          colors={GRADIENTES.boton.colors}
          start={GRADIENTES.boton.start}
          end={GRADIENTES.boton.end}
          style={styles.actualizarBtn}
        >
          <Text style={styles.actualizarBtnText}>Actualizar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  subcard: { paddingHorizontal: 14, paddingVertical: 14, borderTopWidth: 1, borderTopColor: COLORES.panelBorder },
  subcardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  subcardTitulo: { fontSize: 11, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.3, textTransform: "uppercase" },
  rowGap: { flexDirection: "row", alignItems: "center", gap: 6 },
  editarBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#eef2fb", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  editarLink: { fontSize: 11, fontWeight: "700", color: COLOR_MARCA },

  filaDato: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
  filaDatoLabel: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted, marginBottom: 3 },
  filaDatoValor: { fontSize: 14, fontWeight: "700", color: COLORES.textPrimary },
  divisor: { height: 1, backgroundColor: COLORES.panelBorder, marginLeft: 26 },

  bloqueSub: { fontSize: 11, color: COLORES.textMuted },
  filaBotones: { flexDirection: "row", gap: 10, marginTop: 14 },

  desgloseCabecera: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginBottom: 2 },
  desgloseCabeceraLabel: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted },
  desgloseCabeceraTotal: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted },
  desgloseSeccionTitulo: { fontSize: 12, fontWeight: "800", color: COLORES.textPrimary, marginTop: 12, marginBottom: 2 },
  desgloseSubtexto: { fontSize: 11, color: COLORES.textSecondary, marginBottom: 2 },
  desgloseDivisor: { height: 1, backgroundColor: COLORES.panelBorder, marginTop: 10, marginBottom: 4 },

  lineaPrecio: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  lineaLabel: { fontSize: 12, color: COLORES.textSecondary, flex: 1, marginRight: 8 },
  lineaValor: { fontSize: 12, fontWeight: "700", color: COLORES.textPrimary },
  lineaLabelDestacado: { fontWeight: "700", color: COLORES.textPrimary },
  lineaValorDestacado: { fontWeight: "800" },

  totalBlock: { backgroundColor: "#eef2fb", padding: 16, borderTopWidth: 1, borderTopColor: COLORES.panelBorder, alignItems: "center" },
  totalLabelChica: { fontSize: 11, fontWeight: "800", color: COLOR_MARCA, letterSpacing: 0.5 },
  totalValorGrande: { fontSize: 26, fontWeight: "800", color: "#1e3a8a", marginTop: 4 },
  totalNota: { fontSize: 10, color: COLORES.textMuted, marginTop: 8, fontStyle: "italic" },

  volverBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORES.panelBorderStrong, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  volverBtnText: { fontSize: 13, fontWeight: "800", color: COLORES.textSecondary },
  actualizarBtnWrap: { flex: 1, borderRadius: 12 },
  actualizarBtn: { borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  actualizarBtnText: { fontSize: 13, fontWeight: "800", color: "#fff" },

  label: { fontSize: 10, fontWeight: "700", color: COLORES.textMuted, letterSpacing: 0.3, marginBottom: 8, marginTop: 4 },
  filaDosCols: { flexDirection: "row", gap: 8, marginBottom: 14 },
  metodoCard: { flex: 1, borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 10 },
  metodoCardActivo: { borderColor: COLOR_MARCA, borderWidth: 1.5, backgroundColor: "#eef2fb" },
  metodoTitulo: { fontSize: 11, fontWeight: "700", color: COLORES.textSecondary },
  metodoDesc: { fontSize: 9, color: COLORES.textMuted, marginTop: 4 },

  selectBox: { flex: 1, borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 9 },
  selectLabel: { fontSize: 9, color: COLORES.textMuted, fontWeight: "700", marginBottom: 3 },
  selectValue: { fontSize: 11, fontWeight: "600", color: COLORES.textPrimary },

  opcionCard: { borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, padding: 12, marginBottom: 8 },
  opcionCardActiva: { borderColor: COLOR_MARCA, borderWidth: 1.5, backgroundColor: "#eef2fb" },
  opcionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  opcionTitulo: { fontSize: 12.5, fontWeight: "700", color: COLORES.textSecondary },
  opcionTituloActiva: { color: "#0c447c" },
  opcionDesc: { fontSize: 10.5, color: COLORES.textMuted, marginTop: 4 },
  opcionDescActiva: { color: "#185fa5" },

  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: COLORES.panelBorderStrong, alignItems: "center", justifyContent: "center", marginLeft: 8 },
  radioActivo: { borderColor: COLOR_MARCA },
  radioPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLOR_MARCA },

  servicioCard: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORES.panelBorderStrong, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 10, marginBottom: 8 },
  servicioNombre: { flex: 1, fontSize: 11.5, fontWeight: "600", color: COLORES.textSecondary },
  servicioPrecio: { fontSize: 10.5, fontWeight: "700", color: COLORES.textMuted, marginLeft: 6 },

  inputTexto: {
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 12,
    color: COLORES.textPrimary,
    backgroundColor: "#fafbfd",
  },
  inputDeshabilitado: { backgroundColor: "#F3F4F6", color: COLORES.textMuted },
  filaCelular: { flexDirection: "row", gap: 10 },
  prefijoBox: {
    borderWidth: 1.3,
    borderColor: COLOR_MARCA,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    minWidth: 46,
    alignItems: "center",
    backgroundColor: "#eef2fb",
  },
  prefijoBoxVacio: { backgroundColor: "#F3F4F6" },
  prefijoText: { fontSize: 12, fontWeight: "700", color: COLOR_MARCA },
  prefijoTextVacio: { color: COLORES.textMuted },
  inputCelular: { flex: 1 },
});