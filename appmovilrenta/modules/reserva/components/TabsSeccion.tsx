import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR_MARCA } from "../constants/reserva.constants";

export type SeccionReserva = "fechas" | "planes";

interface SeccionConfig {
  id: SeccionReserva;
  label: string;
}

const SECCIONES: SeccionConfig[] = [
  { id: "fechas", label: "Seleccionar fechas y lugar" },
  { id: "planes", label: "Planes" },
];

interface Props {
  seccionActiva: SeccionReserva;
  onCambiarSeccion: (seccion: SeccionReserva) => void;
  tabsDeshabilitados?: SeccionReserva[];
}

export default function TabsSeccion({ seccionActiva, onCambiarSeccion, tabsDeshabilitados = [] }: Props) {
  return (
    <View style={styles.contenedor}>
      {SECCIONES.map((seccion) => {
        const activa = seccion.id === seccionActiva;
        const deshabilitado = tabsDeshabilitados.includes(seccion.id);
        return (
          <TouchableOpacity
            key={seccion.id}
            style={[styles.tab, activa && styles.tabActivo, deshabilitado && styles.tabDeshabilitado]}
            onPress={() => !deshabilitado && onCambiarSeccion(seccion.id)}
            activeOpacity={deshabilitado ? 1 : 0.8}
            disabled={deshabilitado}
          >
            <Text
              style={[
                styles.tabText,
                activa && styles.tabTextActivo,
                deshabilitado && styles.tabTextDeshabilitado,
              ]}
              numberOfLines={1}
            >
              {seccion.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
  },
  tabActivo: { backgroundColor: "#FFFFFF" },
  tabDeshabilitado: { opacity: 0.4 },
  tabText: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.75)" },
  tabTextActivo: { color: COLOR_MARCA },
  tabTextDeshabilitado: { color: "rgba(255,255,255,0.75)" },
});