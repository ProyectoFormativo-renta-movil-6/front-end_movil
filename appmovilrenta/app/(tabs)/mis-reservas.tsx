import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GRADIENTES } from "@/constants/gradients";
import { COLOR_MARCA } from "@/modules/catalogo/constants/catalogo.constants";
import { useTemaColores } from "@/modules/i18n/hooks/useIdioma";

// Cuando el flujo completo de reserva esté terminado (protección + datos
// personales + confirmación), acá se conecta el array real de reservas
// hechas por el usuario (mock JSON primero, backend después).
// Por ahora la pantalla queda resuelta con su estado vacío.

export default function MisReservasScreen() {
  const insets = useSafeAreaInsets();
  const c = useTemaColores();

  const tieneReservas = false; // placeholder — se reemplaza cuando haya datos reales

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: c.bg }]}>
      <View style={[styles.header, { backgroundColor: c.bgHeader, borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitulo, { color: c.textPrimary }]}>Mis reservas</Text>
        <Text style={[styles.headerSubtitulo, { color: c.textSecondary }]}>
          Historial de tus reservas realizadas
        </Text>
      </View>

      {tieneReservas ? (
        <View style={styles.lista}>{/* mapeo de reservas reales */}</View>
      ) : (
        <View style={styles.vacioContainer}>
          <View style={[styles.vacioIconoWrap, { backgroundColor: c.primaryBg }]}>
            <Ionicons name="receipt-outline" size={40} color={COLOR_MARCA} />
          </View>
          <Text style={[styles.vacioTitulo, { color: c.textPrimary }]}>Aún no tienes reservas</Text>
          <Text style={[styles.vacioTexto, { color: c.textMuted }]}>
            Cuando reserves un vehículo, vas a ver acá el historial completo
            con fechas, lugar y estado de cada reserva.
          </Text>
          <TouchableOpacity
            style={styles.vacioBtnWrap}
            onPress={() => router.push("/(tabs)/catalogo")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={GRADIENTES.boton.colors}
              start={GRADIENTES.boton.start}
              end={GRADIENTES.boton.end}
              style={styles.vacioBtn}
            >
              <Ionicons name="car-sport-outline" size={16} color="#fff" />
              <Text style={styles.vacioBtnText}>Explorar vehículos</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitulo: { fontSize: 20, fontWeight: "800" },
  headerSubtitulo: { fontSize: 13, marginTop: 4 },
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  vacioTitulo: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  vacioTexto: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  vacioBtnWrap: {
    borderRadius: 12,
  },
  vacioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  vacioBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
