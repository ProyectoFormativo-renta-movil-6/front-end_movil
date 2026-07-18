import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLOR_MARCA, COLORES } from "@/modules/catalogo/constants/catalogo.constants";

// Cuando el flujo completo de reserva esté terminado (protección + datos
// personales + confirmación), acá se conecta el array real de reservas
// hechas por el usuario (mock JSON primero, backend después).
// Por ahora la pantalla queda resuelta con su estado vacío.

export default function MisReservasScreen() {
  const insets = useSafeAreaInsets();

  const tieneReservas = false; // placeholder — se reemplaza cuando haya datos reales

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Mis reservas</Text>
        <Text style={styles.headerSubtitulo}>
          Historial de tus reservas realizadas
        </Text>
      </View>

      {tieneReservas ? (
        <View style={styles.lista}>{/* mapeo de reservas reales */}</View>
      ) : (
        <View style={styles.vacioContainer}>
          <View style={styles.vacioIconoWrap}>
            <Ionicons name="receipt-outline" size={40} color={COLOR_MARCA} />
          </View>
          <Text style={styles.vacioTitulo}>Aún no tienes reservas</Text>
          <Text style={styles.vacioTexto}>
            Cuando reserves un vehículo, vas a ver acá el historial completo
            con fechas, lugar y estado de cada reserva.
          </Text>
          <TouchableOpacity
            style={styles.vacioBtn}
            onPress={() => router.push("/(tabs)/catalogo")}
          >
            <Ionicons name="car-sport-outline" size={16} color="#fff" />
            <Text style={styles.vacioBtnText}>Explorar vehículos</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORES.pageBg },
  header: {
    backgroundColor: COLORES.panelBg,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.panelBorder,
  },
  headerTitulo: { fontSize: 20, fontWeight: "800", color: COLORES.textPrimary },
  headerSubtitulo: { fontSize: 13, color: COLORES.textSecondary, marginTop: 4 },
  lista: { flex: 1, padding: 16 },
  vacioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  vacioIconoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eef2fb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  vacioTitulo: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORES.textPrimary,
    marginBottom: 6,
  },
  vacioTexto: {
    fontSize: 13,
    color: COLORES.textMuted,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  vacioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLOR_MARCA,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  vacioBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});