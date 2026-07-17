import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR_MARCA } from "../constants/reserva.constants";

export type SeccionReserva = "vehiculo" | "fechas";

interface SeccionConfig {
  id: SeccionReserva;
  label: string;
}

const SECCIONES: SeccionConfig[] = [
  { id: "vehiculo", label: "Ver vehículo" },
  { id: "fechas", label: "Seleccionar fechas y lugar" },
];

interface Props {
  seccionActiva: SeccionReserva;
  onCambiarSeccion: (seccion: SeccionReserva) => void;
}

export default function TabsSeccion({ seccionActiva, onCambiarSeccion }: Props) {
  return (
    <View style={styles.contenedor}>
      {SECCIONES.map((seccion) => {
        const activa = seccion.id === seccionActiva;
        return (
          <TouchableOpacity
            key={seccion.id}
            style={[styles.tab, activa && styles.tabActivo]}
            onPress={() => onCambiarSeccion(seccion.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activa && styles.tabTextActivo]} numberOfLines={1}>
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
  tabText: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.75)" },
  tabTextActivo: { color: COLOR_MARCA },
});